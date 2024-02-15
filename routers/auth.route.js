const express = require('express');
const emailVerification = require('../utils/validation.utils');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200);
    res.send({message: 'Auth route is running.'});
});

router.post('/register', async (req, res) => {
    const body = req.body;

    if (!emailVerification(body.email)) {
        res.status(400);
        res.send({
            message: 'Please properly fill all required fields and accept Terms and Conditions.',
            body: body
        });
        return
    }

    /*const user = await userCollection.findOne({email: body.email});
    
    if (user){
        res.status(409);
        res.send({
            message: 'Email already in use.'
        });
        return
    };*/

    res.status(201);
    res.send("success");
});

router.post('/login', async (req, res) => {
    const body = req.body;
    
    if (!body.email) {
        res.status(400);
        res.send({
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

    res.status(200);
    res.send({
        message: "Success.",
        body: body
    });
});

module.exports = router;