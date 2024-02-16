const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routers/auth.route');
const { standardAuth } = require('./middleware/auth.middleware')

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRouter);

// ------------> HAS AN ADMIN METHOD INSIDE THE MIDDLEWARE, DELETE LATER
// ------------> SET "authorization" HEADER TO "admin" FOR TESTING WITHOUT JWT TOKEN
app.use(standardAuth);

app.get('/', (req, res) => {
    res.status(200);
    res.send({message: 'Server is running.'});
});

app.listen(3000, () => {
    console.log('Server listening on port 3000.');
});