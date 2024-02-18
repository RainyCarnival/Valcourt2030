const express = require('express');
const bcrypt = require('bcrypt');
const validation = require('../utils/validation.utils');
const { isEmailUnique, registerUser, loginUser } = require('../database/controllers/userController');

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
    
    // TODO: Add a verification that First name exists
    // TODO: Add a verification that Last name exists

    if (!(await isEmailUnique(body.email))){
        // TODO: If needed adjust failure logic.
        res.status(409);
        res.send({
            message: 'Email already in use.'
        });
        return;
    };

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(body.password, salt);

    const userInfo = {
        firstName: body.firstName,
        lastName: body.lastName,
        municipality: body.municipality,
        email: body.email,
        password: passwordHash,
        interestedTags: body.interestedTags
    }

    if (await registerUser(userInfo)){
        // TODO: If needed adjust success logic.
        res.status(201).send({
            message: "User succesfully created.",
        });
    } else {
        // TODO: Enter failure logic.
    }
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

    if(await loginUser(body.email, body.password)){
        // TODO: If needed adjust success logic.
        res.status(200);
        res.send({
            message: "Success.",
            body: body,
            verify
        });

    }else{
        // TODO: Enter failed login logic.
    }


});

module.exports = router;