const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const validation = require('../utils/validation.utils');

const { isEmailUnique, registerUser, loginUser, updateOneUser } = require('../database/controllers/userController');


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

	const confirmationToken = jwt.sign({
		email: body.email,
	}, process.env.SECRET, { expiresIn: '1d' });

	try {
		await sendConfirmationEmail(body.email, confirmationToken);
	} catch (error) {
		console.error('Error sending confirmation email:', error);
		res.status(500).send({
			message: 'Error sending confirmation email. Please try again later.',
			status: false
		});
		return;
	}

	const userInfo = {
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email,
		password: passwordHash,
		municipality: body.municipality,
		interestedTags: body.interestedTags,
		isValidated: false,
		confirmationToken: confirmationToken
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

router.get('/confirm-email', async (req, res) => {
    // Extract token from URL parameters
    const token = req.query.token;

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.SECRET);

        // Extract email from decoded token
        const email = decoded.email;

        // Update user status in database (e.g., set emailConfirmed flag to true)
        await updateUserStatus(email);

        // Respond with confirmation message in French
        res.status(200).send(`
            <html>
            <head>
                <title>Email confirmé</title>
                <meta charset="UTF-8">
                <script>
                    // Fermer l'onglet après 5 secondes
                    setTimeout(() => {
                        window.close();
                    }, 5000);
                </script>
            </head>
            <body>
                <h1>Email confirmé</h1>
                <p>Votre adresse email a été confirmée avec succès.</p>
            </body>
            </html>
        `);
    } catch (error) {
        // Handle token verification failure
        console.error('Erreur lors de la confirmation de l\'email:', error);
        res.status(400).send('Jeton invalide ou expiré. Veuillez réessayer.');
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
		if (!user.isValidated) {
			res.status(401).send({
				message: 'Please confirm your email address before logging in.',
				status: false
			});
			return;
		}
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

async function sendConfirmationEmail(email, token) {
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com', // SMTP server hostname
		port: 587, // SMTP port (587 for TLS)
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.EMAIL_USER, // Your email address
			pass: process.env.EMAIL_PASSWORD // Your email password or app password
		}
	});

	let info = await transporter.sendMail({
		from: `${process.env.EMAIL_USER}`,
		to: email,
		subject: 'Confirmation de compte',
		html: `<p>Veuillez confirmer votre adresse e-mail en cliquant sur le lien suivant : <a href="${process.env.HOST}/auth/confirm-email?token=${token}">Confirmer l'email</a></p>`
	});

	console.log('Email de confirmation envoyé :', info.messageId);
}

async function updateUserStatus(email) {
    const userUpdateData = {
        isValidated: true,
        confirmationToken: null // Assuming the field should be deleted
    };

    const result = await updateOneUser(email, userUpdateData);

    return result;
}

module.exports = router;