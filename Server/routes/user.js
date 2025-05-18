import express from 'express';
const router = express.Router();
import User from '../model/user.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authhandler from '../middleware/authhandler.js';
import { invalidateToken } from '../middleware/authhandler.js';

//register - POST
router.post("/register", async (req, res, next) => {
	try {
		const {name, email, password} = req.body;

		if (!name, !email, !password) {
			res.status(404);
			throw new Error("All fields are required");
		}

		const userExist = await User.findOne({email})

		if (userExist) {
			res.status(404);
			throw new Error("User Already Exists");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await User.create({
			name,
			email,
			password : hashedPassword
		});
		
		if (user) {
			res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				password: generatejwt(user._id)
			});
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
});

//login - POST
router.post('/login',async (req, res, next) => {
	try {
		const {email, password} = req.body;

		if ( !email, !password) {
			res.status(404);
			throw new Error("All fields are required");
			return next(error)
		}

		const user = await User.findOne({email});

		if (user && (bcrypt.compare(password, user.password))) {
			res.status(200).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				password: generatejwt(user._id)
			});
		}
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
})

router.post('/logout', authhandler, async (req, res) => {
    try {
        // Invalidate the current token
        invalidateToken(req.token);

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/',async (req, res, next) => {
	try {
		const users = await User.find({}); // Exclude password field
		
		if (!users || users.length === 0) {
			return res.status(404).json({ message: "No users found" });
		}

		res.status(200).json(users);
	
	} catch (error) {
		res.status(500).json({ error: error.message });
	
	}
})
//JWT 
const generatejwt = (id) => {
	return jwt.sign({ id },process.env.JWT_SCERTE,{
			expiresIn: '1hr'
		}
	)
}

export default router;