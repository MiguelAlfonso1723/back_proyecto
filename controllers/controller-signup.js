import User from '../models/users.mjs'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const saltRounds = 10;
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

        if (payload.role !== "administrador") {
            return "Unauthorized: role is not Administrador";
        }

        return true;

    } catch (err) {
        return "Invalid token";
    }
}

async function register(req, res) {
    const token = req.headers.authorization;
    const valid = validate(token);

    if (valid !== true) {
        return res.status(401).json({
            'state': false, 'message': 'Unauthorized role', 'data': null
        });
    }

    const { mail, password, role } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
        return res.status(400).json({
            'state': false, 'message': "Por favor ingresa un correo electrónico válido", 'data': null
        });
    }
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
        return res.status(409).json({
            'state': false, 'message': "El correo ya está registrado", 'data': null
        });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        const newUser = new User({ mail, password: hashedPassword, role });
        const result = await newUser.save()
        result.password = undefined;
        return res.status(201).json({ 'state': true, 'data': result })
    } catch (error) {
        return res.status(500).json({ "state": false, "message": error.message })

    }
}

export default register;