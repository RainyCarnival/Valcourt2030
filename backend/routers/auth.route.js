const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const validation = require('../utils/validation.utils');

const { isEmailUnique, registerUser, loginUser } = require('../database/controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
	res.status(200);
	res.send({
		message: 'Auth route is running.',
		status: true
	});
});

router.post('/register', async(req, res) => {
	const body = req.body;

	if (!body.email) {
        res.status(400).send({
			password: 'Email field is required.',
			status: false
		});
        return
    }

    if (!body.password) {
        res.status(400).send({
			password: 'Password field is required.',
			status: false
		});
        return
    }

	const verifiedEmail = validation.emailValidation(body.email);

	const verifiedPassword = validation.passwordValidation(body.password);

	if (!verifiedEmail.valid) {
		res.status(400).send(
			{
				message: verifiedEmail.message,
				status: false
			});
		return;
	}

	if (!verifiedPassword.valid) {
		res.status(400).res.send(
			{
				message: verifiedPassword.message,
				status: false
			});
		return;
	}

    if (!body.firstName) {
        res.status(400).send({
            message: "First name is required.",
			status: false
        });
        return
    }

    if (!body.lastName) {
        res.status(400).send({
            message: "Last name is required.",
			status: false
        });
        return
    }

	if (!(await isEmailUnique(body.email))){
		// TODO: If needed adjust failure logic.
		res.status(409);
		res.send({
			message: 'Email already in use.',
			status: false
		});
		return;
	}

	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(body.password, salt);

	const userInfo = {
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email,
		password: passwordHash,
		municipality: body.municipality,
		interestedTags: body.interestedTags,
	}

	if (await registerUser(userInfo)){
		// TODO: If needed adjust success logic.
		res.status(201).send({
			message: 'Registration successful.',
			status: true
		});
	} else {
        res.status(401).send({
            message: 'User creation failed. Please try again later.',
			status: false
        });
	}
});

router.post('/login', async(req, res) => {
	const body = req.body;
    
	if (!body.email) {
		res.status(400).send({
			message: 'Email field is required.',
			status: false
		});
		return;
	}
	
	if (!body.password) {
		res.status(400);
		res.send({
			message: 'Password field is required.',
			status: false
		});
		return;
	}

	const login = await loginUser(body.email, body.password)
	const user = login.user;

	if (login.success) {
		const token = jwt.sign({ 
			userId: user._id,
			email: user.email,
			isAdmin: user.isAdmin
		 }, process.env.SECRET, { expiresIn: '2h'});
		
		// TODO: If needed adjust success logic.
		res.status(200);
		res.send({
			message: 'Login successful.',
			token,
			status: true
		});

	} else {
		res.status(401).send({
            message: 'Email or password is incorrect.',
			status: false
        });
	}
});

module.exports = router;