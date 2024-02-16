const express = require('express');
const bcrypt = require('bcrypt');
const validation = require('../utils/validation.utils');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200);
    res.send({message: 'Auth route is running.'});
});

router.post('/register', async (req, res) => {
    const body = req.body;

    const verifiedEmail = validation.emailValidation(body.email);

    const verifiedPassword = validation.passwordValidation(body.password);

    if (!verifiedEmail.valid) {
        res.status(400).send({message: verifiedEmail.message});
        return
    };

    if (!verifiedPassword.valid) {
        res.status(400).res.send({message: verifiedPassword.message});
        return
    };

    const user = await userCollection.findOne({email: body.email});
    
    if (user){
        res.status(409);
        res.send({
            message: 'Email already in use.'
        });
        return;
    };

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const result = await userCollection.insertOne({
        firstName: body.firstName,
        lastName: body.lastName,
        municipality: municipality,
        email: body.email,
        password: passwordHash,
    });

    res.status(201).send({
        message: "Success.",
        result
    });
});

router.post('/login', async (req, res) => {
    const body = req.body;
    
    if (!body.email) {
        res.status(400).send({
            message: 'Email field is required.'
        });
        return
    }
    if (!body.password) {
        res.status(400);
        res.send({
            message: 'Password field is required.'
        });
        return
    }

    const verify = await bcrypt.compare(body.password, passwordHash);

    res.status(200);
    res.send({
        message: "Success.",
        body: body,
        verify
    });
});

module.exports = router;