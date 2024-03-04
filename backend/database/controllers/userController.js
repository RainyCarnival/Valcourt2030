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
		console.error('Unexpected error checking email uniqueness: ', error);
		throw error;
	}
}

/**
 * Method to register a user into the database.
 * 
 * @param {Object} userInfo - An object containing the necessary information to create a user. (required: firstName, lastName, email, password, not required: municipality, interestedTags). interestedTags must be an Array.
 * @param {boolean} isAdmin - A boolean value determining if the registered user will be an admin or not.
 * @returns {boolean} Returns true on creation of user in the database. Otherwise returns false.
 */
async function registerUser(userInfo, isAdmin = false) {
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
			isAdmin: isAdmin
		});

		return true;
	} catch(error) {
		console.error('Unexpected error creating user: ', error);
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
		console.error('Unexpected error logging in: ', error);
		return false;
	}
}

// TODO Add documentation to methods.
async function updateOneUser(email, userUpdateData) {
	try{
		const result = await User.updateOne({ email }, {$set: userUpdateData });

		if(result.nModified > 0) {
			return true;
		} else {
			console.error('No matching document found for update.');
			return false;
		}

	} catch (error) {
		console.error('Unexpected error occured when updated user data: ', error);
	}
}

async function deleteOneUser(userToDelete) {
	try{
		const result = await User.deleteOne({ email: userToDelete });

		if (result.deletedCount > 0){
			return true;
		} else {
			console.error('No matching user to delete');
			return false;
		}
	} catch (error) {
		console.error('Unexpected error occured deleting the user: ', error);
		throw error;
	}
}

async function getOneUser(userToFind){
	try {
		const user = await User.findOne(userToFind).populate(['interestedTags', 'municipality']);

		if(user){
			return user;
		} else {
			console.error('User not found.');
			return false;
		}
	} catch (error) {
		console.error('Unexpected error getting the user: ', error);
		throw error;
	}
}

async function getAllUsers(){
	try{
		const users = await User.find({}).populate(['interestedTags', 'municipality']);

		if(users.length === 0){
			console.warn('No users found.');
		}

		return users;

	} catch (error) {
		console.error('Unexpected error retreiving the list of users: ', error);
		throw error;
	}
}

module.exports = { isEmailUnique, registerUser, loginUser, deleteOneUser, updateOneUser, getOneUser, getAllUsers };