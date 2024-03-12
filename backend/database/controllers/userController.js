const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { updateOneMailingList } = require('./mailingListController');


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

		// TODO: Update mailing list if user selected any interested tags
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

/**
 * Updates user data, including handling interested tags and ensuring transactional consistency.
 *
 * @param {string} email - The email of the user to be updated.
 * @param {object} userUpdateData - The updated data for the user.
 * @returns {boolean} - Returns true if the update is successful, false otherwise.
 */

async function updateOneUser(email, userUpdateData) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const originalUser = await User.findOne({email});

		if(!originalUser){
			throw new Error(`Document Not Found: No document found for ${email} to update.`);
		}

		const updatedUser = await User.findOneAndUpdate({email}, {$set: userUpdateData}, {new: true});

		// Take the keys from userUpdateData as references to compare the keys from the original and updated data. Returns true if a difference is found, otherwise returns false.
		const isModified = !Object.keys(userUpdateData).every(key => {
			return JSON.stringify(updatedUser[key]) === JSON.stringify(originalUser[key]);
		});

		if(!isModified){
			throw new Error('Update Error: No modifications made the data is the same.');
		}

		const addedTags = updatedUser.interestedTags.filter(tag => !originalUser.interestedTags.includes(tag));

		if (addedTags.length > 0){
			for (const tag of addedTags){
				const addTagResult = await updateOneMailingList(tag, 'add', updatedUser._id);
				
				if (!addTagResult){
					throw new Error('Update Error: Failed to add user to the mailing list.');
				}				
			}
		}

		const removedTags = originalUser.interestedTags.filter(tag => !updatedUser.interestedTags.includes(tag));

		if (removedTags.length > 0 ){
			for (const tag of removedTags){
				const removedTagResult = await updateOneMailingList(tag, 'remove', updatedUser._id);
				
				if (!removedTagResult){
					throw new Error('Update Error: Failed to add user to the mailing list.');
				}				
			}
		}

		await session.commitTransaction();
		return true;

	} catch (error) {
		await session.abortTransaction();

		if (error.message.startsWith('Document Not Found')){
			console.error(error.message);
		} else if (error.message.startsWith('Update Error')) {
			console.error(error.message);
		} else {
			console.error('An unexpected error occured when updated user data: ', error);
		}
		
		return false;
	} finally {
		session.endSession();
	}
}

async function deleteOneUser(userToDelete) {
	try{
		const result = await User.deleteOne({ email: userToDelete });

		if (result.deletedCount > 0){
			// TODO: Update the mailing list.
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