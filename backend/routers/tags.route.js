const express = require('express');

const { getAllTags, createOneTag, deleteOneTag } = require('../database/controllers/tagsController')

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({
        message: 'Tags route is running.',
        status: true
    });
});

router.get('/getAllTags', async (req, res) => {
    const tags = await getAllTags();
	if (tags.length > 0) {
		res.status(200).send({status: true, tags: tags}); 
	}
	else {
		res.status(400).send({status: false, message: 'No tags in database'});
	}
});

router.post('/createTag', async (req, res) => {
    const body = req.body;

    const result = await createOneTag(body.tag);

    if (result.status) {
        res.status(201).send({
            message: 'Tag created.',
            status: true
        });
    } else {
        res.status(401).send({
            message:result.message,
            status:false
        })
    }
});

// DOESN'T WORK, NEEDS TO BE FIXED
/*router.delete('/deleteTag', async (req, res) => {
    const body = req.body;

    const result = await deleteOneTag(body.tag);

    if (result.status) {
        res.status(204).send({
            message: 'Tag deleted.',
            status: true
        });
    } else {
        res.status(404).send({
            message: result.message,
            status: false
        });
    }
});*/

module.exports = router;