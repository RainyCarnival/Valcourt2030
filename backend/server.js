const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRouter = require('./routers/auth.route');
const { standardAuth } = require('./middleware/auth.middleware');
const { connectToDatabase } = require('./database/connection');
require('dotenv').config();
const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));

connectToDatabase().then(() => {
	app.use('/auth', authRouter);
    
	// ------------> HAS AN ADMIN METHOD INSIDE THE MIDDLEWARE, DELETE LATER
	// ------------> SET "authorization" HEADER TO "admin" FOR TESTING WITHOUT JWT TOKEN
	app.use(standardAuth);
    
	app.get('/', (req, res) => {
		res.status(200);
		res.send({message: 'Server is running.'});
	});
    
	app.listen(process.env.PORT || 3000, () => {
		console.log('Server listening on port 3000.');
	});
}).catch((error) => {
	console.error('Error connecting to the database: ', error);
	process.exit(1); // Exit the proccess if the database connection fails.
});
