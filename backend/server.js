// server.js
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

// Obtener todos los productos
app.get('/api/productos', (req, res) => {
    const query = 'SELECT p.*, c.nombre as categoria_nombre FROM productos p JOIN categorias c ON p.categoria_id = c.id';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtener productos destacados
app.get('/api/productos/destacados', (req, res) => {
    const query = 'SELECT p.*, c.nombre as categoria_nombre FROM productos p JOIN categorias c ON p.categoria_id = c.id WHERE p.destacado = true';
    connection.query(query, (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

// Obtener productos por categoría
app.get('/api/productos/categoria/:id', (req, res) => {
    const query = 'SELECT * FROM productos WHERE categoria_id = ?';
    connection.query(query, [req.params.id], (error, results) => {
        if (error) throw error;
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});