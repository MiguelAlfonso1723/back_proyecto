import Menu from '../models/menu.mjs';
import jwt from 'jsonwebtoken';

const key = process.env.SECRET

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

async function getAll(req, res) {
    try {
        const token = req.headers.authorization;
        const validAdmin = validate(token, "administrador");
        const validWaiter = validate(token, "camarero");
        if (validAdmin !== true && validWaiter !== true) {
            return res.status(401).json({
                'state': false, 'message': validAdmin, 'data': null
            });
        }
        const result = await Menu.find({});
        return res.status(200).json({ state: true, data: result });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function save(req, res) {
    const token = req.headers.authorization;
    const valid = validate(token, "administrador");
    if (valid !== true) {
        return res.status(401).json({
            'state': false, 'message': valid, 'data': null
        });
    }

    const {
        name_product,
        price,
        category,
        capasity,
        is_available,
    } = req.body;

    const menu = await Menu.findOne({ name_product: name_product });
    if (menu) {
        return res.status(409).json({
            'state': false, 'message': "El menú ya existe", 'data': null
        });
    }

    const newMenu = new Menu({
        name_product,
        price,
        category,
        capasity,
        is_available,
    });
    await newMenu.save();
    return res.status(201).json({ state: true, message: "Menu created successfully", data: newMenu });
}

const update = async (req, res) => {
    const token = req.headers.authorization;
    const valid = validate(token, "administrador");
    if (valid !== true) {
        return res.status(401).json({
            'state': false, 'message': valid, 'data': null
        });
    }

    const { id } = req.params;
    const { name_product, price, category, capasity, is_available } = req.body;

    try {
        const updatedMenu = await Menu.findByIdAndUpdate(id, {
            name_product,
            price,
            category,
            capasity,
            is_available
        }, { new: true });

        if (!updatedMenu) {
            return res.status(404).json({ state: false, message: "Menu not found" });
        }

        return res.status(200).json({ state: true, message: "Menu updated successfully", data: updatedMenu });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function remove(req, res) {
    const token = req.headers.authorization;
    const valid = validate(token, "administrador");
    if (valid !== true) {
        return res.status(401).json({
            'state': false, 'message': valid, 'data': null
        });
    }

    const { id } = req.params;

    try {
        const deletedMenu = await Menu.findByIdAndDelete(id);
        if (!deletedMenu) {
            return res.status(404).json({ state: false, message: "Menu not found" });
        }
        return res.status(200).json({ state: true, message: "Menu deleted successfully", data: deletedMenu });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

async function updateAvailability(req, res) {
    const token = req.headers.authorization;
    const valid = validate(token, "administrador");
    if (valid !== true) {
        return res.status(401).json({
            'state': false, 'message': valid, 'data': null
        });
    }

    const { id } = req.params;
    const { is_available } = req.body;

    try {
        const updatedMenu = await Menu.findByIdAndUpdate(id, { is_available }, { new: true });

        if (!updatedMenu) {
            return res.status(404).json({ state: false, message: "Menu not found" });
        }

        return res.status(200).json({ state: true, message: "Menu availability updated successfully", data: updatedMenu });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

export { getAll, save, update, remove, updateAvailability };