const readlineSync = require('readline-sync');
const fs = require('fs');
const { default: mongoose } = require('mongoose');
const User = require('./database/models/userModel');
const Municipality = require('./database/models/municipalityModel');
const bcrypt = require('bcrypt');

/**
 * Connects to the MongoDB database.
 * @param {mongoose.Connection} db - The Mongoose connection object.
 * @returns {boolean} Returns true if the connection is successful, false otherwise.
 */
async function dbConnect(db){
	require('dotenv').config();
	
	db.on('error', (error) => {
		console.error('MongoDB connection error:', error);
	});
	
	db.once('open', () => {
		console.log('Connected to MongoDB database:', db.name);
	});

	if(!process.env.MONGO_URL){
		console.log('No MONGO_URL set in the .env file.');
		return false;
	}

	if(!process.env.DATABASE){
		console.log('No DATABASE set in the .env file.');
		return false;
	}

	const databaseUri = process.env.MONGO_URL + process.env.DATABASE;

	console.log(`Connecting to ${process.env.DATABASE}`);
	await mongoose.connect(databaseUri);
	console.log('Connected!');
}

/**
 * Hashes the given password using bcrypt.
 * @param {string} password - The password to hash.
 * @returns {Promise<string>} A promise that resolves with the hashed password.
 */
async function hashPassword(password){
	const salt = await bcrypt.genSalt(10);
	return await bcrypt.hash(password, salt);
}

/**
 * Checks if the email has a valid format.
 * @param {string} email - The email to validate.
 * @returns {boolean} Returns true if the email is valid, false otherwise.
 */
function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

/**
 * Prompts the user to enter a valid email.
 * @returns {string} The valid email entered by the user.
 */
function emailPrompt(){
	// eslint-disable-next-line no-constant-condition
	while (true){
		const accountEmail = readlineSync.question('Enter admin account email: ');

		if (isValidEmail(accountEmail)){
			return accountEmail;
		} else {
			console.log('Invalid email format. Please enter a valid email address.');
		}
	}
}

/**
 * Prompts the user to enter a valid port number for running the backend.
 * @returns {number} The valid port number entered by the user. Defaults to 3333 if input is blank.
 */
function portPrompt(){
	// eslint-disable-next-line no-constant-condition
	while (true){
		const backendPort = readlineSync.question('Enter the Port # to run the backend (Leave blank for default port: 3333): ');

		if (backendPort.length <= 0){
			return 3333;
		}

		const parsedPort = parseInt(backendPort);

		if (!isNaN(parsedPort) && isFinite(parsedPort) && parsedPort >= 0 && parsedPort <= 65535){
			return parsedPort;
		} else {
			console.log('Invalid port input. Please enter a valid port number (0-65535) or leave blank for the default port.');
		}
	}
}

/**
 * Prompts the user to enter valid input.
 * @param {string} prompt - The prompt message for the user.
 * @param {object} [options] - Options for readlineSync.question.
 * @returns {string} The valid user input.
 */
function userPrompt(prompt, options = {}){
	// eslint-disable-next-line no-constant-condition
	while (true){
		const userInput = readlineSync.question(prompt, options);

		if (userInput.length > 0){
			return userInput;
		} else {
			console.log('Invalid input. Please enter at least 1 character.');
		}
	}
}

/**
 * Prompts the user for MongoDB URL, database name, admin account email, and password.
 * Saves the information to the .env file and sets up the backend environment.
 * @returns {void} Returns nothing.
 */
async function promptAndSave() {
	console.log('Initiating environment setup sequence.\n');

	// User prompts
	let mongodbUrl = userPrompt('Enter MongoDB URL: ');
	const dbName = userPrompt('Enter database name: ');
	const jwtSecret = userPrompt('Enter your JWT secret: '); // TODO name could be changed to match its use.
	const port = portPrompt();
	const accountEmail = emailPrompt();
	const password = userPrompt('Enter password: ', {hideEchoBack: true, mask: '*'});

	if (!mongodbUrl.endsWith('/')){
		mongodbUrl += '/';
	}

	const hashedPassword = await hashPassword(password);

	// Write to .env file
	const envData = `MONGO_URL="${mongodbUrl}"\nDATABASE="${dbName}"\nSECRET="${jwtSecret}"\nPORT=${port}`;
	fs.writeFileSync('.env', envData);

	console.log('\nSuccessfully created the .env file!');

	const db = mongoose.connection;

	await dbConnect(db);

	console.log('\nCreating default Municipality');
	const defaultMunicipality = await Municipality.create({municipality: 'Autre'});
	console.log('Default Municipality created.');

	console.log('\nCreating admin user');
	await User.create({
		firstName: 'admin',
		lastName: 'admin',
		email: accountEmail,
		password: hashedPassword,
		municipality: defaultMunicipality._id,
		isAdmin: true,
		isValidated: true
	});
	console.log('Admin user created');

	db.close();

	console.log('\nDatabase Connection closed.');
	console.log('Environment setup completed.\n Sequence ending..');
}

promptAndSave();