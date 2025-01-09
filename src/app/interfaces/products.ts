export interface Products {
    // Campos principales de producto
    id_producto: number;
    codigo_sku: string | null;
    nombre: string;
    precio_regular: number;
    precio_oferta: number | null;
    descripcion: string;
    especificaciones_tecnicas: string | null;
    imagen_url: string | null;
    categoria_id: number;
    estado: boolean;
    fecha_ingreso: string;
    fecha_modificacion: string;
    // Campos calculados/unidos desde otras tablas
    categoria_nombre: string;
    stock_total: number;
    calificacion_promedio?: number;
    total_resenas?: number;
}