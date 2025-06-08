import User from '../models/users.mjs'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const key = process.env.SECRET;
const saltRounds = 10;

async function loggin(req, res) {
    const { mail, password } = req.body;
    const userlog = await User.findOne({ mail: mail })
    try {
        if (userlog) {
            const isMatch = await bcrypt.compare(password, userlog.password)
            if (isMatch) {
                const token = jwt.sign({
                    sub: 'Token',
                    role: userlog.role,
                    exp: Date.now() + 24 * 60 * 60 * 1000 //24 hours of expiration (86400000 ms = 24 hours)
                }, key)
                console.log('You access')
                return res.status(200).json({ state: true, message: "Logged In", token: token });
            } else {
                return res.status(404).json({ state: false, message: "Password is Wrong", token: null });
            }
        } else {
            return res.status(403).json({ state: false, message: "User Don't Exist", token: null });
        }

    } catch (err) {
        return res.status(500).json({ "state": false, "message": err.message })
    }

}

export default loggin;