import User from '../models/users.mjs'
import bcrypt from 'bcrypt';

const saltRounds = 10;

async function register(req, res) {
    const { mail, password } = req.body;

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
        const newUser = new User({ mail, password: hashedPassword });
        const result = await newUser.save()
        result.password = undefined;
        return res.status(201).json({ 'state': true, 'data': result })
    } catch (error) {
        return res.status(500).json({ "state": false, "message": error.message })

    }
}

export default register;