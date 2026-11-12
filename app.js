const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Base de datos en memoria (para fines académicos y demostrativos)
let orders = [
    {
        id: 1,
        cliente: "Ana María Gómez",
        productos: "Laptop Gamer, Mouse RGB",
        cantidades: 2,
        direccion: "Calle 100 # 15-20, Bogotá",
        estado: "Pendiente",
        fecha: new Date().toISOString()
    }
];

// --- ENDPOINTS DE LA API REST ---

// 1. GET: Listar todos los pedidos (con filtro opcional por estado)
app.get('/api/orders', (req, res) => {
    const { estado } = req.query;
    if (estado) {
        const filtered = orders.filter(o => o.estado.toLowerCase() === estado.toLowerCase());
        return res.json(filtered);
    }
    res.json(orders);
});

// 2. POST: Crear un nuevo pedido
app.post('/api/orders', (req, res) => {
    const { cliente, productos, cantidades, direccion } = req.body;
    
    if (!cliente || !productos || !cantidades || !direccion) {
        return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newOrder = {
        id: orders.length > 0 ? orders[orders.length - 1].id + 1 : 1,
        cliente,
        productos,
        cantidades: parseInt(cantidades),
        direccion,
        estado: "Pendiente",
        fecha: new Date().toISOString()
    };

    orders.push(newOrder);
    res.status(201).json(newOrder);
});

// 3. PATCH: Actualizar el estado del pedido
app.patch('/api/orders/:id/status', (req, res) => {
    const orderId = parseInt(req.params.id);
    const { estado } = req.body;

    const validStates = ["Pendiente", "En Proceso", "Enviado", "Entregado"];
    if (!validStates.includes(estado)) {
        return res.status(400).json({ error: "Estado no válido" });
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) {
        return res.status(404).json({ error: "Pedido no encontrado" });
    }

    order.estado = estado;
    res.json(order);
});

// Puerto por defecto para AWS Elastic Beanstalk (usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});