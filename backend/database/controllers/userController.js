const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { updateOneMailingList } = require('./mailingListController');
const { globalDefaultMunicipality } = require('../../globals');

/**
 * Checks if the given email is unique in the User collection.
 *
 * @param {string} email - The email to check for uniqueness.
 * @returns {boolean} - Returns true if the email is unique, false if it already exists or if the input is missing.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function isEmailUnique(email) {
	try {
		if (!email){
			console.error('Missing email');
			return false;
		}

		const user = await User.findOne({ email: email });

		if(user){
			console.error('Email already exists');
			return false;
		}

		return true;

	} catch (error) {
		console.error('Unexpected error checking email uniqueness: ', error);
		return false;
	}
}

/**
 * Retrieves a user based on the specified criteria and populates associated fields.
 *
 * @param {object} userEmail - Criteria to find the user in the User collection.
 * @returns {object|boolean} - Returns the found user object if successful, false if not found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getOneUser(userEmail){
	try {
		const user = await User.findOne({email: userEmail}).populate([{path: 'interestedTags', select: '_id tag'}, {path: 'municipality', select: '_id municipality'}]);

		if(!user){
			console.error('User not found.');
			return false;
		}

		return user;
	} catch (error) {
		console.error(`Unexpected error getting the user: ${error}`);
		return false;
	}
}

/**
 * Retrieves all users from the User collection and populates associated fields.
 *
 * @returns {Array} - Returns an array of user objects if successful, an empty array if no users found.
 * @throws {Error} - Throws an error if an unexpected error occurs during the process.
 */
async function getAllUsers(){
	try{
		const users = await User.find({}).populate([{path: 'interestedTags'}, {path: 'municipality', select: '_id municipality'}]);

		if(users.length === 0){
			console.error('No users found.');
			return false;
		}

		return users;

	} catch (error) {
		console.error(`Unexpected error retreiving the list of users: ${error}`);
		
		return false;
	}
}

/**
 * Registers a new user, optionally setting them as an admin and specifying validation status.
 *
 * @param {object} userInfo - User information, including firstName, lastName, email, password, municipality, interestedTags.
 * @param {boolean} isAdmin - Optional flag to designate the user as an admin. Default is false.
 * @param {boolean} isValidated - Optional flag to indicate if the user is validated. Default is false.
 * @returns {boolean} - Returns true if the registration is successful, false otherwise.
 */
async function registerUser(userInfo, isAdmin = false, isValidated = false) {
	const { getOneMunicipality } = require('./municipalityController');
	const session = await mongoose.startSession();
	session.startTransaction();

	try {
		// Validate required fields
		if(!userInfo.firstName || !userInfo.lastName || !userInfo.email || !userInfo.password){
			const missingFields = Object.keys({firstName: '', lastName: '', email: '', password: ''}).filter(key => !userInfo[key]);
			
			console.error(`Missing required fields: ${missingFields}`);
			return false;
		}

		// Validate that interestedTags is an array if provided
		if(userInfo.interestedTags && !Array.isArray(userInfo.interestedTags)){
			console.error('Invalid type error: interested tags must be an Array.');
			return false;
		}
		
		// Set a default municipality if not provided
		if(!userInfo.municipality){
			const municipality = await getOneMunicipality(globalDefaultMunicipality);
			
			if(!municipality){
				throw new Error('Creation Error: Failed to create default municipality');
			}
			
			userInfo.municipality = municipality._id;
		}

		const newUser = await User.create({
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			email: userInfo.email,
			password: userInfo.password,
			municipality: userInfo.municipality,
			interestedTags: userInfo.interestedTags,
			isAdmin: isAdmin,
			isValidated: isValidated
		});

		if (!newUser){
			throw new Error('Creation Error: Failed to create user.');
		}
		
		// Add user to mailing list for each interested tag
		if (newUser.interestedTags.length > 0){
			for (const tag of userInfo.interestedTags){
				const addTagResult = await updateOneMailingList(tag, 'add', newUser._id);
				
				if (!addTagResult){
					throw new Error('Update Error: Failed to add user to the mailing list.');
				}				
			}
		}

		await session.commitTransaction();
		return true;
	} catch(error) {
		await session.abortTransaction();

		if (error.message.startsWith('Creation Error')){
			console.error(error);
		} else if (error.message.startsWith('Update Error')){
			console.error(error);
		} else {
			console.error(`Unexpected error creating user: ${error}`);
		}

		return false;
	} finally {
		session.endSession();
	}
}

/**
 * Attempts to authenticate a user by matching the provided email and password.
 *
 * @param {string} email - The user's email for authentication.
 * @param {string} password - The user's password for authentication.
 * @returns {boolean} - Returns true if authentication is successful, false otherwise.
 */
async function loginUser(email, password) {
	try {
		if (!email){
			throw new Error('Login Error: loginUser method requires an email.');
		}

		if(!password){
			throw new Error('Login Error: loginUser method requires a password.');
		}

		const user = await User.findOne({ email: email });

		if (!user){
			throw new Error('Login Error: User not found in database.');
		}

		const verify = await bcrypt.compare(password, user.password);

		if(!verify){
			throw new Error('Login Error: Password validation failure.');
		}

		return {
			success: true,
			user
		};
	}
	catch(error) {
		if(error.message.startsWith('Login Error')){
			console.error(error);
		} else {
			console.error(`Unexpected error logging in: ${error}`);
		}
		
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
		const originalUser = await User.findOne({email: email});

		if(!originalUser){
			throw new Error(`Document Not Found: User not found ${email}.`);
		}

		// Update the user document and retrieve the updated version.
		const updatedUser = await User.findOneAndUpdate({email}, {$set: userUpdateData}, {new: true});

		// Check if any modifications were made by comparing keys in userUpdateData
		const isModified = !Object.keys(userUpdateData).every(key => {
			return JSON.stringify(updatedUser[key]) === JSON.stringify(originalUser[key]);
		});

		if(!isModified){
			throw new Error('Update Error: No modifications made. The data is the same.');
		}

		// Handle added tags.
		const addedTags = updatedUser.interestedTags.filter(tag => !originalUser.interestedTags.includes(tag));

		if (addedTags.length > 0){
			for (const tag of addedTags){
				const addTagResult = await updateOneMailingList(tag, 'add', updatedUser._id);
				
				if (!addTagResult){
					throw new Error('Update Error: Failed to add user to the mailing list.');
				}				
			}
		}

		// Handle removed tags.
		const removedTags = originalUser.interestedTags.filter(tag => !updatedUser.interestedTags.includes(tag));

		if (removedTags.length > 0 ){
			for (const tag of removedTags){
				const removedTagResult = await updateOneMailingList(tag, 'remove', updatedUser._id);
				
				if (!removedTagResult){
					throw new Error('Update Error: Failed to remove user from the mailing list.');
				}				
			}
		}

		await session.commitTransaction();
		return true;

	} catch (error) {
		await session.abortTransaction();

		if (error.message.startsWith('Document Not Found')){
			console.error(error);
		} else if (error.message.startsWith('Update Error')) {
			console.error(error);
		} else {
			console.error(`An unexpected error occured when updated user data: ${error}`);
		}
		
		return false;
	} finally {
		session.endSession();
	}
}

/**
 * Deletes a user and removes them from the associated mailing lists.
 *
 * @param {string} userEmail - The email of the user to be deleted.
 * @returns {boolean} - Returns true if the deletion is successful, false otherwise.
 */
async function deleteOneUser(userEmail) {
	const session = await mongoose.startSession();
	session.startTransaction();

	try{
		const user = await User.findOne({email: userEmail});

		if(!user){
			throw new Error('Deletion Error: User not found.');
		}

		// Remove the user from associated mailing lists
		if (user.interestedTags.length > 0 ){
			for (const tag of user.interestedTags){
				const removedTagResult = await updateOneMailingList(tag, 'remove', user._id);
				
				if (!removedTagResult){
					throw new Error('Deletion Error: Failed to remove user from the mailing list.');
				}				
			}
		}

		const result = await User.deleteOne({ email: userEmail });
		
		if (result.deletedCount === 0){
			throw new Error('Deletion Error: Failed to delete user.');
		}

		session.commitTransaction();
		return true;

	} catch (error) {
		session.abortTransaction();
		if(error.message.startsWith('Deletion Error')){
			console.error(error);
		} else {
			console.error('Unexpected error occured deleting the user: ', error);
		}
		return false;

	} finally {
		session.endSession();
	}
}

module.exports = { isEmailUnique, registerUser, loginUser, deleteOneUser, updateOneUser, getOneUser, getAllUsers };