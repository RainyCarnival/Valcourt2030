const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routers/auth.route');
const apiRouter = require('./routers/api.route');
const { standardAuth } = require('./middleware/auth.middleware');
const { connectToDatabase } = require('./database/connection');
const { getAllTags } = require('./database/controllers/tagsController');
const { getAllMunicipalities } = require('./database/controllers/municipalityController');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cors());

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

connectToDatabase().then(() => {
	// FIXME Temp placement for frontend testing
	app.get('/getAllTags', async(req, res) => {
		const tags = await getAllTags();
		if(tags.length > 0){
			res.status(200).send({status: true, tags: tags}); 
		}
		else{
			res.status(400).send({status: false, message: 'No tags in database'});
		}
	});

	// FIXME Temp placement for frontend testing
	app.get('/getAllMunicipalities', async(req, res) => {
		const municipalities = await getAllMunicipalities();
		if(municipalities.length > 0){
			res.status(200).send({status: true, municipalities: municipalities}); 
		}
		else{
			res.status(400).send({status: false, message: 'No municipalities in database'});
		}
	});
	
	app.use('/api', apiRouter);
	app.use('/auth', authRouter);
    
	app.use(standardAuth);
    
	app.get('/', (req, res) => {
		res.status(200).send({
			message: 'Server is running.',
			status: true
		});
	});
    
	app.listen(process.env.PORT || 3333, () => {
		console.log(`Server listening on port ${process.env.PORT}.`);
	});
}).catch((error) => {
	console.error('Error connecting to the database: ', error);
	process.exit(1); // Exit the proccess if the database connection fails.
});
