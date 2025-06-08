import Category from "../models/category.mjs";
import jwt from "jsonwebtoken";

const key = process.env.SECRET

function validate(aux) {
    if (!aux) {
        return "The session has not been logged in or the token has not been entered.";
    }

    const token = aux.split(" ")[1];

    try {
        const payload = jwt.verify(token, key);

        if (Date.now() > payload.exp) {
            return "Session Expired";
        }

        if (payload.role !== "administrador" && payload.role !== "camarero") {
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
        const valid = validate(token);
        if (valid !== true) {
            return res.status(401).json({
                'state': false, 'message': valid, 'data': null
            });
        }
        const result = await Category.find({});
        return res.status(200).json({ state: true, data: result });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });

    }
}

async function save(req, res) {
    const token = req.headers.authorization;
    const valid = validate(token);
    if (valid !== true) {
        return res.status(401).json({
            'state': false, 'message': valid, 'data': null
        });
    }

    const { name_category, description } = req.body;

    const category = await Category.findOne({ name_category: name_category });
    if (category) {
        return res.status(409).json({ state: false, message: "Category already exists" });
    }

    try {
        const newCategory = new Category({ name_category, description });
        await newCategory.save();
        return res.status(201).json({ state: true, data: newCategory });
    } catch (err) {
        return res.status(500).json({ state: false, message: err.message });
    }
}

export { getAll, save };