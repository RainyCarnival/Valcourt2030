const express = require('express');

const { getAllEvents } = require('../database/controllers/eventsController')

const router = express();

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Events route is running.'
    });
});

router.get('/getAllEvents', async (req, res) => {
    const result = await getAllEvents();

    if (result.status) {
        res.status(200).send({
            status: true,
            events: result.events
        });
    } else {
        res.status(404).send({
            status: false,
            message: result.message
        });
    }
});

module.exports = router;