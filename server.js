const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routers/auth.route');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.status(200);
    res.send({message: 'Server is running.'});
});

app.listen(3000, () => {
    console.log('Server listening on port 3000.');
});