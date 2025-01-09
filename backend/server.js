const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Cambia esto por tu usuario
    password: 'Giancito96ds', // Cambia esto por tu contraseña
    database: 'tienda_gaming'
});

// Conectar a MySQL
connection.connect(error => {
    if (error) throw error;
    console.log('Conectado exitosamente a la base de datos MySQL');
});

// Obtener todos los productos con información de stock
app.get('/api/productos', (req, res) => {
    const query = `
        SELECT 
            p.*,
            c.nombre as categoria_nombre,
            COALESCE(SUM(i.stock_actual), 0) as stock_total
        FROM productos p 
        JOIN categorias c ON p.categoria_id = c.id_categoria
        LEFT JOIN inventario i ON p.id_producto = i.producto_id
        WHERE p.estado = true
        GROUP BY p.id_producto
    `;
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtener productos por categoría
app.get('/api/productos/categoria/:id', (req, res) => {
    const query = `
        SELECT 
            p.*,
            c.nombre as categoria_nombre,
            COALESCE(SUM(i.stock_actual), 0) as stock_total
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id_categoria
        LEFT JOIN inventario i ON p.id_producto = i.producto_id
        WHERE p.categoria_id = ? AND p.estado = true
        GROUP BY p.id_producto
    `;
    connection.query(query, [req.params.id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtener detalles de un producto específico con reseñas
app.get('/api/productos/:id', (req, res) => {
    const query = `
        SELECT 
            p.*,
            c.nombre as categoria_nombre,
            COALESCE(SUM(i.stock_actual), 0) as stock_total,
            COALESCE(AVG(r.calificacion), 0) as calificacion_promedio,
            COUNT(r.id) as total_resenas
        FROM productos p
        JOIN categorias c ON p.categoria_id = c.id_categoria
        LEFT JOIN inventario i ON p.id_producto = i.producto_id
        LEFT JOIN resenas r ON p.id_producto = r.producto_id AND r.estado = true
        WHERE p.id_producto = ? AND p.estado = true
        GROUP BY p.id_producto
    `;
    connection.query(query, [req.params.id], (error, results) => {
        if (error) throw error;
        res.json(results[0]);
    });
});

// Obtener reseñas de un producto
app.get('/api/productos/:id/resenas', (req, res) => {
    const query = `
        SELECT 
            r.*,
            u.nombres,
            u.apellidos
        FROM resenas r
        JOIN usuarios u ON r.usuario_id = u.id_usuario
        WHERE r.producto_id = ? AND r.estado = true
        ORDER BY r.fecha_creacion DESC
    `;
    connection.query(query, [req.params.id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtener todas las categorías
app.get('/api/categorias', (req, res) => {
    const query = 'SELECT * FROM categorias WHERE estado = true';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Crear un nuevo pedido
app.post('/api/pedidos', (req, res) => {
    const { usuario_id, direccion_envio, metodo_pago, productos } = req.body;
    
    // Iniciar transacción
    connection.beginTransaction(err => {
        if (err) throw err;

        // Calcular totales
        let subtotal = 0;
        const costo_envio = 10.00; // Ejemplo de costo fijo de envío
        
        // Verificar stock y calcular subtotal
        const checkStockQuery = `
            SELECT p.id_producto, p.precio_regular, p.precio_oferta, 
                   COALESCE(SUM(i.stock_actual), 0) as stock_disponible
            FROM productos p
            LEFT JOIN inventario i ON p.id_producto = i.producto_id
            WHERE p.id_producto = ?
            GROUP BY p.id_producto
        `;

        const procesarProductos = productos.map(producto => {
            return new Promise((resolve, reject) => {
                connection.query(checkStockQuery, [producto.id_producto], (error, results) => {
                    if (error) reject(error);
                    const stockDisponible = results[0].stock_disponible;
                    if (stockDisponible < producto.cantidad) {
                        reject(new Error(`Stock insuficiente para el producto ${producto.id_producto}`));
                    }
                    const precio = results[0].precio_oferta || results[0].precio_regular;
                    subtotal += precio * producto.cantidad;
                    resolve();
                });
            });
        });

        Promise.all(procesarProductos)
            .then(() => {
                const total = subtotal + costo_envio;
                
                // Crear pedido
                const pedidoQuery = `
                    INSERT INTO pedidos (
                        usuario_id, direccion_envio, metodo_pago, 
                        subtotal, costo_envio, total
                    ) VALUES (?, ?, ?, ?, ?, ?)
                `;
                
                connection.query(pedidoQuery, 
                    [usuario_id, direccion_envio, metodo_pago, subtotal, costo_envio, total],
                    (error, results) => {
                        if (error) {
                            return connection.rollback(() => {
                                throw error;
                            });
                        }

                        const pedido_id = results.insertId;
                        
                        // Insertar detalles del pedido y actualizar inventario
                        productos.forEach(producto => {
                            const detalleQuery = `
                                INSERT INTO detalles_pedido (
                                    pedido_id, producto_id, cantidad, 
                                    precio_unitario, subtotal
                                ) VALUES (?, ?, ?, ?, ?)
                            `;
                            
                            connection.query(detalleQuery,
                                [pedido_id, producto.id_producto, producto.cantidad, 
                                 producto.precio, producto.cantidad * producto.precio],
                                (error) => {
                                    if (error) {
                                        return connection.rollback(() => {
                                            throw error;
                                        });
                                    }
                                }
                            );
                        });

                        // Confirmar transacción
                        connection.commit(err => {
                            if (err) {
                                return connection.rollback(() => {
                                    throw err;
                                });
                            }
                            res.json({
                                mensaje: 'Pedido creado exitosamente',
                                pedido_id: pedido_id
                            });
                        });
                    }
                );
            })
            .catch(error => {
                connection.rollback(() => {
                    res.status(400).json({
                        error: error.message
                    });
                });
            });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});