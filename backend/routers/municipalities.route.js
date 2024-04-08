const express = require('express');

const { adminAuth } = require('../middleware/auth.middleware');

const { getAllMunicipalities, createOneMunicipality } = require('../database/controllers/municipalityController')

const router = express.Router();

router.get('/', adminAuth, (req, res) => {
    res.status(200).send({
        message: 'Municipalities route is running.',
        status: true
    });
});

router.get('/getAllMunicipalities', async (req, res) => {
    const municipalities = await getAllMunicipalities();
    if(municipalities.length > 0){
        res.status(200).send({status: true, municipalities: municipalities}); 
    }
    else{
        res.status(400).send({status: false, message: 'No municipalities in database'});
    }
});

router.post('/createMunicipality', async (req, res) => {
    const body = req.body;

    const result = await createOneMunicipality(body.municipality);

    if (result.status) {
        res.status(201).send({
            message: 'Municipality created.',
            status: true
        });
    } else {
        res.status(401).send({
            message: result.message,
            status: false
        });
    }
});

module.exports = router;