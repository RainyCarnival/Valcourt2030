const User = require('../models/userModel');
const bcrypt = require('bcrypt');

/**
 * Method used to verify the received email does not exist already in the database.
 * 
 * @param {string} email - User entered email. 
 * @returns {boolean} Returns false if the email already exists in the database. Otherwise returns true.
 */
async function isEmailUnique(email) {
	try {
		if (!email){
			console.log('Missing email');
			return false;
		}

		const user = await User.findOne({ email });
		return !user;
	} catch (error) {
		console.error('Error checking email uniqueness: ', error);
		throw error;
	}
}

/**
 * Method to register a user into the database.
 * 
 * @param {Object} userInfo - An object containing the necessary information to create a user. (required: firstName, lastName, email, password, not required: municipality, interestedTags). interestedTags must be an Array.
 * @returns {boolean} Returns true on creation of user in the database. Otherwise returns false.
 */
async function registerUser(userInfo) {
	try {
		if(!userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.password){
			console.log('Missing required fields: ', Object.keys(userInfo).filter(key => !userInfo[key]));
			return false;
		}

		if(userInfo.interestedTags && !Array.isArray(userInfo.interestedTags)){
			console.log('interestedTags must be an array: ', userInfo.interestedTags);
			return false;
		}

		await User.create({
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			email: userInfo.email,
			password: userInfo.password,
			municipality: userInfo.municipality,
			interestedTags: userInfo.interestedTags,
		});

		return true;
	} catch(error) {
		console.error('Error creating user: ', error);
		return false;
	}
}

/**
 * Method to login the user into the system.
 * 
 * @param {string} email - Users email used to find the users information in the database. 
 * @param {string} password - Users password used for comparison with database password.
 * @returns {boolean} Returns true on succesful login. Otherwise returns false.
 */
async function loginUser(email, password) {
	try {
		if (!email){
			console.log('loginUser method requires an email.');
			return false;
		}

		if(!password){
			console.log('loginUser method requires a password.');
		}

		const user = await User.findOne({ email });

		if (!user){
			console.log('Email not found in database.');
			return false;
		}

		const verify = await bcrypt.compare(password, user.password);

		if(verify){
			return true;
		}
		else{
			console.log('Password validation failure.');
			return false;
		}
	}
	catch(error) {
		console.error('Error loging in: ', error);
		return false;
	}
}

// TODO: Create a function to update the users
// TODO: Create a function to delete a user
// TODO: Create a function to create a user as an admin
// TODO: Create a function to get all the users from the database.

module.exports = { isEmailUnique, registerUser, loginUser };