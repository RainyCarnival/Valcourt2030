const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { updateOneUser, deleteOneUser } = require('../database/controllers/userController');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Users route is running.',
        status: true
    })
});

router.patch('/updateUser', async (req, res) => {
    const body = req.body;

    if (body.password) {
        const salt = await bcrypt.genSalt(10);
	    body.password = await bcrypt.hash(body.password, salt);
    }

    const token = req.headers.authorization
    
    const email = jwt.verify(token, process.env.SECRET).email;

    const result = await updateOneUser(email, req.body)

    if (result.status) {
        res.status(200).send({
            message: 'Update successful.',
            status: true
        });
    } else {
        res.status(400).send({
            message: result.message,
            satus: false
        });
    }
});

router.delete('/deleteUser', async (req, res) => {
    const token = req.headers.authorization
    
    const email = jwt.verify(token, process.env.SECRET).email;

    const result = await deleteOneUser(email);

    if (result.status) {
        res.status(204).send({
            message: 'Deletion successful.',
            status: true
        });
    } else {
        res.status(400).send({
            message: result.message,
            satus: false
        });
    }
});

module.exports = router;