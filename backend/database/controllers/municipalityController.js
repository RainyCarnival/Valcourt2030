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
		const tags = await Municipality.find({});

		if(tags.length === 0){
			console.warn('No municipalities found.');
		}

		return tags;

	} catch (error) {
		console.error('Unexpected error retreiving the list of municipalities: ', error);
		throw error;
	}
}

async function createOneTag(newMunicipality){
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
		console.error('Unexpected error creating municipality: ', error);
		throw error;
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
		console.error('Unexpected error updated the municipality: ', error);
		throw error;
	}
}

module.exports = { getOneMunicipality, getAllMunicipalities, createOneTag, deleteOneMunicipality, updateMunicipality };