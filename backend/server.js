const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const authRouter = require('./routers/auth.route');
const municipalitiesRouter = require('./routers/municipalities.route')
const tagsRouter = require('./routers/tags.route');

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

	app.use('/auth', authRouter);
	app.use('/municipalities', municipalitiesRouter);
	app.use('/tags', tagsRouter);
    
	app.use(standardAuth);
    
	app.get('/authTest', (req, res) => {
		res.status(200).send({
			message: 'You are authorized.',
			status: true
		});
	});
    
	app.listen(process.env.PORT || 3000, () => {
		console.log('Server listening on port 3000.');
	});
}).catch((error) => {
	console.error('Error connecting to the database: ', error);
	process.exit(1); // Exit the proccess if the database connection fails.
});
