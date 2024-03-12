const mongoose = require('mongoose');
const MailingList = require('../models/mailingListModel');

// TODO Create documentation
async function createOneMailingList(mailingTagId){
	try {
		const isExisting = await MailingList.findOne({ tag: {$regex: mailingTagId, $options: 'i'} });

		if (!isExisting){
			await MailingList.create({ tag: mailingTagId});
			return true;
		} else {
			console.log('Mailing list already exists');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Mailing list already exists. Duplicate key violation.');
			return false;
		} else {
			console.error('Unexpected error creating mailing list: ', error);
			throw error;
		}
	}
}

async function updateOneMailingList(tagId, action, userId){
	try{
		const existingMailingList = await MailingList.findOne({ tag: tagId });

		if (!existingMailingList){
			console.error('No matching mailing list found.');
			return false;
		}

		switch (action) {
		case 'add':
			if (existingMailingList.users.includes(userId)){
				console.error('User already in mailing list');
				return true;
			}

			existingMailingList.users.push(userId);
			break;
		case 'remove':
			if (!existingMailingList.users.includes(userId)){
				console.error('User not found in mailing list');
				return true;
			}
			
			existingMailingList.users = existingMailingList.users.filter(user => !user.equals(userId));

			break;
		default:
			console.error('Invalid action specified');
			return false;
		}

		const result = await existingMailingList.save();

		if(result){
			return true;
		} else {
			console.error('No modifications were made to the mailing list.');
			return false;
		}
	} catch (error) {
		console.error('An unexpected error occured updating the mailing list: ', error);
		throw error;
	}
}

async function getOneMailingList(mailingTagId){
	try {
		const mailingList = await MailingList.findOne(mailingTagId).populate(['tag', 'users']);

		if (mailingList){
			return mailingList;
		} else {
			console.error('Mailing list not found.');
		}
	} catch (error) {
		console.error('An unexpected error occured getting the mailing list: ', error);
		throw error;
	}
}

async function deleteOneMailingList(mailingTagId){
	try {
		const result = await MailingList.deleteOne(mailingTagId);

		if (result.deletedCount > 0){
			return true;
		} else {
			console.error('No mathing mailing list to delete.');
			return false;
		}
	} catch (error) {
		console.error('An unexpected error occured deleting the mailing list: ', error);
		throw error;
	}
}

module.exports = { createOneMailingList, updateOneMailingList, getOneMailingList, deleteOneMailingList };