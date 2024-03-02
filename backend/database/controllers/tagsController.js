const Tag = require('../models/tagsModel');
// TODO Create documentation

async function getOneTag(tagToFind){
    try {
        const tag = await Tag.findOne(tagToFind);

        if(tag){
            return tag;
        } else {
            console.error('Tag not found.');
            return false;
        }

    } catch (error) {
        console.error('Unexpected error retreiving the tag: ', error);
        throw error;
    }
}

async function getAllTags(){
    try {
        const tags = await Tag.find({});

        if(tags.length === 0){
            console.warn('No tags found.');
        }

        return tags;

    } catch (error) {
        console.error('Unexpected error retreiving the list of tags: ', error);
        throw error;
    }
}

async function createOneTag(newTag){
    try{        
        const isExisting = await Tag.findOne({ tag: {$regex: newTag, $options: 'i'} });

        if (!isExisting){
            await Tag.create({ tag: newTag });
            return true;
        } else {
            console.log('Tag already exists.');
            return false;
        }
    } catch (error) {
        console.error('Unexpected error creating tag: ', error);
        throw error;
    }
}

async function deleteOneTag(tagToDelete){
    try {
        const result = await Tag.deleteOne({ tag: tagToDelete });
    
        if (result.deletedCount > 0){
            return true;
        } else {
            console.error('No matching tags to delete.');
            return false;
        }
    } catch (error) {
        console.error('Unexpected error deleting tag: ', error);
        throw error;
    }
}

async function updateTag(currentTag, tagUpdateData) {
    try{
        const result = await Tag.updateOne({ tag: currentTag }, { $set: { tag: tagUpdateData }});

        if(result.n > 0){
            return true;
        } else {
            console.error('No matchin tags to update.');
            return false;
        }
    } catch (error) {
        console.error('Unexpected error updated the tag: ', error);
        throw error;
    }
}

module.exports = { getOneTag, getAllTags, createOneTag, deleteOneTag, updateTag };