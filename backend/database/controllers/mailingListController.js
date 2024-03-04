const MailingList = require('../models/mailingListModel');

// TODO: Create documentation
async function createOneMailingList(mailingTag){
	try {
		const isExisting = await MailingList.findOne({ tag: {$regex: mailingTag, $options: 'i'} });

		if (!isExisting){
			await MailingList.create({ tag: mailingTag});
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

// TODO: Create a function that updates the mailing list 
// TODO: Create a function the gets all the users from a specified tag
// TODO: Create a function that deletes a document in the database.

module.exports = { createOneMailingList };