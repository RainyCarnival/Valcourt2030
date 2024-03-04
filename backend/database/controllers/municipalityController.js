const Municipality = require('../models/municipalityModel');
// TODO Create documentation

async function getOneMunicipality(municipalityToFind){
	try {
		const municipality = await Municipality.findOne(municipalityToFind);

		if(municipality){
			return municipality;
		} else {
			console.error('Municipality not found.');
			return false;
		}

	} catch (error) {
		console.error('Unexpected error retreiving the municipality: ', error);
		throw error;
	}
}

async function getAllMunicipalities(){
	try {
		const municipalities = await Municipality.find({});

		if(municipalities.length === 0){
			console.warn('No municipalities found.');
		}

		return municipalities;

	} catch (error) {
		console.error('Unexpected error retreiving the list of municipalities: ', error);
		throw error;
	}
}

async function createOneMunicipality(newMunicipality){
	try{        
		const isExisting = await Municipality.findOne({ municipality: {$regex: newMunicipality, $options: 'i'} });

		if (!isExisting){
			await Municipality.create({ tag: newMunicipality });
			return true;
		} else {
			console.log('Municipality already exists.');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Municipality already exists. Duplicate key violation.');
			return false;
		} else {
			console.error('Unexpected error updating the municipality: ', error);
			throw error;
		}
	}
}

async function deleteOneMunicipality(municipalityToDelete){
	try {
		const result = await Municipality.deleteOne({ municipality: municipalityToDelete });
    
		if (result.deletedCount > 0){
			return true;
		} else {
			console.error('No matching municipalities to delete.');
			return false;
		}
	} catch (error) {
		console.error('Unexpected error deleting municipality: ', error);
		throw error;
	}
}

async function updateMunicipality(currentMunicipality, municipalityUpdateData) {
	try{
		const result = await Municipality.updateOne({ municipality: currentMunicipality }, { $set: { municipality: municipalityUpdateData }});

		if(result.n > 0){
			return true;
		} else {
			console.error('No matching municipalities to update.');
			return false;
		}
	} catch (error) {
		if (error.name === 'MongoError' && error.code === 11000) {
			console.error('Update failed due to duplicate municipality value.');
			return false;
		} else {
			console.error('Unexpected error updating the municipality: ', error);
			throw error;
		}
	}
}

module.exports = { getOneMunicipality, getAllMunicipalities, createOneMunicipality, deleteOneMunicipality, updateMunicipality };