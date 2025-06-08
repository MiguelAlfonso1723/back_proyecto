import Order from '../models/order.mjs';
import jwt from 'jsonwebtoken';

const key = process.env.SECRET;

function validate(aux, role) {
    if (!aux) {
        return "The session has not been logged in or the token has not been entered.";
    }

    const token = aux.split(" ")[1];

    try {
        const payload = jwt.verify(token, key);

        if (Date.now() > payload.exp) {
            return "Session Expired";
        }

        if (payload.role !== role) {
            return "Unauthorized role";
        }

        return true;

    } catch (err) {
        return "Invalid token";
    }
}

async function getAllActive(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                'state': false, 'message': validWaiter, 'data': null
            });
        }
        const result = await Order.find({ is_active: true });
        return res.status(200).json({ state: true, data: result });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function getAllFinished(req, res) {
    try {
        const token = req.headers.authorization;
        const validAdmin = validate(token, "administrador");
        if (validAdmin !== true) {
            return res.status(401).json({
                'state': false, 'message': validAdmin, 'data': null
            });
        }
        const result = await Order.find({ is_active: false, is_cancelled: false });
        return res.status(200).json({ state: true, data: result });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function salesRecordDaily(req, res) {
    try {
        const token = req.headers.authorization;
        const validAdmin = validate(token, "administrador");
        if (validAdmin !== true) {
            return res.status(401).json({
                state: false,
                message: validAdmin,
                data: null
            });
        }

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            date: { $gte: todayStart, $lte: todayEnd },
            $or: [
                { is_active: false, is_cancelled: false },
                { is_cancelled: true }
            ]
        }).populate('products.menu');

        const pedidos = {
            ventas: { total: 0, cantidad: 0 },
            llevar: { total: 0, cantidad: 0 },
            domicilio: { total: 0, cantidad: 0 },
            local: { total: 0, cantidad: 0 },
            cancelados: { cantidad: 0 }
        };

        for (const order of orders) {
            if (order.is_cancelled) {
                pedidos.cancelados.cantidad++;
                continue;
            }

            let total = 0;
            for (const item of order.products) {
                if (item.menu && item.menu.price) {
                    total += item.menu.price * item.quantity;
                }
            }

            pedidos.ventas.total += total;
            pedidos.ventas.cantidad++;

            switch (order.order_type) {
                case 'llevar':
                    pedidos.llevar.total += total;
                    pedidos.llevar.cantidad++;
                    break;
                case 'domicilio':
                    pedidos.domicilio.total += total;
                    pedidos.domicilio.cantidad++;
                    break;
                case 'local':
                    pedidos.local.total += total;
                    pedidos.local.cantidad++;
                    break;
            }
        }

        return res.status(200).json({
            state: true,
            data: { pedidos }
        });

    } catch (err) {
        return res.status(500).json({
            state: false,
            message: err.message
        });
    }
}

async function salesRecordMonthly(req, res) {
    try {
        const token = req.headers.authorization;
        const validAdmin = validate(token, "administrador");
        if (validAdmin !== true) {
            return res.status(401).json({
                state: false,
                message: validAdmin,
                data: null
            });
        }

        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        lastDay.setHours(23, 59, 59, 999); // Fin del último día

        const orders = await Order.find({
            date: { $gte: firstDay, $lte: lastDay },
            $or: [
                { is_active: false, is_cancelled: false },
                { is_cancelled: true }
            ]
        }).populate('products.menu');

        const pedidos = {
            ventas: { total: 0, cantidad: 0 },
            llevar: { total: 0, cantidad: 0 },
            domicilio: { total: 0, cantidad: 0 },
            local: { total: 0, cantidad: 0 },
            cancelados: { cantidad: 0 }
        };

        for (const order of orders) {
            if (order.is_cancelled) {
                pedidos.cancelados.cantidad++;
                continue;
            }

            let total = 0;
            for (const item of order.products) {
                if (item.menu && item.menu.price) {
                    total += item.menu.price * item.quantity;
                }
            }

            pedidos.ventas.total += total;
            pedidos.ventas.cantidad++;

            switch (order.order_type) {
                case 'llevar':
                    pedidos.llevar.total += total;
                    pedidos.llevar.cantidad++;
                    break;
                case 'domicilio':
                    pedidos.domicilio.total += total;
                    pedidos.domicilio.cantidad++;
                    break;
                case 'local':
                    pedidos.local.total += total;
                    pedidos.local.cantidad++;
                    break;
            }
        }

        return res.status(200).json({
            state: true,
            data: { pedidos }
        });

    } catch (err) {
        return res.status(500).json({
            state: false,
            message: err.message
        });
    }
}

async function createOrder(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { order_type } = req.body;

        if (!order_type) {
            return res.status(400).json({
                state: false,
                message: "El campo 'order_type' es obligatorio",
                data: null
            });
        }

        const newOrder = new Order({
            order_type,
            date: new Date()
        });

        await newOrder.save();
        return res.status(201).json({ state: true, data: newOrder });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function addProductToOrder(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { orderId, menuId, quantity } = req.body;

        if (!orderId || !menuId || !quantity) {
            return res.status(400).json({
                state: false,
                message: "Los campos 'orderId', 'menuId' y 'quantity' son obligatorios",
                data: null
            });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({
                state: false,
                message: "La cantidad debe ser un número entero positivo",
                data: null
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, is_active: true },
            { $push: { products: { menu: menuId, quantity } } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                state: false,
                message: "Orden no encontrada o no está activa",
                data: null
            });
        }

        return res.status(200).json({ state: true, data: updatedOrder });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function cancelOrder(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                state: false,
                message: "El campo 'orderId' es obligatorio",
                data: null
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, is_active: true },
            { is_cancelled: true, is_active: false },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                state: false,
                message: "Orden no encontrada o no está activa",
                data: null
            });
        }

        return res.status(200).json({ state: true, data: updatedOrder });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function finishOrder(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                state: false,
                message: "El campo 'orderId' es obligatorio",
                data: null
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, is_active: true },
            { is_active: false },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                state: false,
                message: "Orden no encontrada o no está activa",
                data: null
            });
        }

        return res.status(200).json({ state: true, data: updatedOrder });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function getOrderById(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                state: false,
                message: "El campo 'orderId' es obligatorio",
                data: null
            });
        }

        const order = await Order.findById(orderId).populate('products.menu');

        if (!order || !order.is_active) {
            return res.status(404).json({
                state: false,
                message: "Orden no encontrada o no está activa",
                data: null
            });
        }

        return res.status(200).json({ state: true, data: order });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function removeProductFromOrder(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { orderId, menuId } = req.body;

        if (!orderId || !menuId) {
            return res.status(400).json({
                state: false,
                message: "Los campos 'orderId' y 'menuId' son obligatorios",
                data: null
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, is_active: true },
            { $pull: { products: { menu: menuId } } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                state: false,
                message: "Orden no encontrada o no está activa",
                data: null
            });
        }

        return res.status(200).json({ state: true, data: updatedOrder });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function updateQuantityProduct(req, res) {
    try {
        const token = req.headers.authorization;
        const validWaiter = validate(token, "camarero");
        if (validWaiter !== true) {
            return res.status(401).json({
                state: false, message: validWaiter, data: null
            });
        }

        const { orderId, menuId, quantity } = req.body;

        if (!orderId || !menuId || quantity === undefined) {
            return res.status(400).json({
                state: false,
                message: "Los campos 'orderId', 'menuId' y 'quantity' son obligatorios",
                data: null
            });
        }

        if (quantity <= 0 || !Number.isInteger(quantity)) {
            return res.status(400).json({
                state: false,
                message: "La cantidad debe ser un número entero positivo",
                data: null
            });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, is_active: true, 'products.menu': menuId },
            { $set: { 'products.$.quantity': quantity } },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                state: false,
                message: "Orden no encontrada o no está activa",
                data: null
            });
        }

        return res.status(200).json({ state: true, data: updatedOrder });

    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

export {
    getAllActive,
    getAllFinished,
    salesRecordDaily,
    salesRecordMonthly,
    createOrder,
    addProductToOrder,
    cancelOrder,
    finishOrder,
    getOrderById,
    removeProductFromOrder,
    updateQuantityProduct
}