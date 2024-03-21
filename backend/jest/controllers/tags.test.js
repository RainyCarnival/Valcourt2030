// Import necessary modules and setup files
const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tag = require('../../database/models/tagsModel');
const { createOneTag, getOneTag, getAllTags, updateTag } = require('../../database/controllers/tagsController');
const MailingList = require('../../database/models/mailingListModel');
const { createOneMailingList } = require('../../database/controllers/mailingListController');

let mongoServer;

// Connect to database before tests.
beforeAll(async() => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Disconnect from database after tests.
afterAll(async() => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

// Clean up the database
afterEach(async() => {
	await Tag.deleteMany({});
	await MailingList.deleteMany({});
});

describe('Tag Controller - createOneTag', () => {

	test('should create a new tag.', async() => {
		const newTag = 'test';
	
		await createOneTag(newTag);
	
		const createdTag = await Tag.findOne({ tag: newTag });
		expect(createdTag.tag).toEqual(newTag);

		const createdMailingList = await MailingList.findOne({ tag: createdTag._id });
		expect(createdMailingList).toBeTruthy();
	});

	test('should handle duplicate tag creation.', async() => {
		console.error = jest.fn();
		const newTag = 'test';
		await createOneTag(newTag);
	
		const result = await createOneTag(newTag);
	
		expect(result).toBe(false);
		
		const errorMessage = console.error.mock.calls[0][0].toString();
		expect(errorMessage).toEqual(expect.stringContaining('already exists'));
	});

	test('should handle failed tag creation', async() => {
		const tagCreateMock = jest.spyOn(Tag, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const newTag = 'test';

		const result = await createOneTag(newTag);

		expect(result).toBe(false);

		const errorMessage = consoleErrorMock.mock.calls[0][0].toString();
		expect(errorMessage).toEqual(expect.stringContaining('create tag'));

		tagCreateMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	// FIXME Does not return the right error message
	// test('should handle failed mailing list creation', async() => {
	// 	const mailingListCreateMock = jest.spyOn(createOneMailingList, 'createOneMailingList').mockResolvedValueOnce(false);
	// 	const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

	// 	const newTag = 'test';

	// 	const result = await createOneTag(newTag);

	// 	expect(result).toBe(false);

	// 	const errorMessage = console.error.mock.calls[0][0].toString();
	// 	expect(errorMessage).toEqual(expect.stringContaining('create mailing list'));
		
	// 	mailingListCreateMock.mockRestore();
	// 	consoleErrorMock.mockRestore();
	// });

	test('should handle unexpected errors', async() => {
		const tagFindOneMock = jest.spyOn(Tag, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in findOne.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const newTag = 'test';

		const result = await createOneTag(newTag);

		expect(result).toBe(false);

		const errorMessage = console.error.mock.calls[0][0].toString();
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));
	
		tagFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Tag Controller - getOneTag', () => {
	test('should get the specified tag', async() => {
		const newTag = 'test';
		await Tag.create({tag: newTag});

		const result = await getOneTag(newTag);

		expect(result.tag).toEqual(newTag);
	});

	test('should fail to get the specified tag', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const tag = 'test';

		const result = await getOneTag(tag);

		expect(result).toBeNull();

		const errorMessage = console.error.mock.calls[0][0].toString();
		expect(errorMessage).toEqual(expect.stringContaining('Tag not found'));
	
		consoleErrorMock.mockRestore();
	});

	test('should fail with an unexpected error', async() => {
		const tag = 'test';
		await Tag.create({tag: tag});
		
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const tagFindOneMock = jest.spyOn(Tag, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in findOne.'));


		const result = await getOneTag(tag);
		expect(result).toBeFalsy();


		const errorMessage = console.error.mock.calls[0][0].toString();
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));
	
		tagFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Tag Controller - getAllTags', () => {
	test('should retrieve all the tags', async() => {
		const newTag1 = 'test';
		const newTag2 = 'testing';
		await Tag.create({tag: newTag1});
		await Tag.create({tag: newTag2});

		const result = await getAllTags();

		expect(result).toHaveLength(2);
	});

	test('should fail to retrieve the tags', async() => {
		const result = await getAllTags();

		expect(result).toHaveLength(0);
	});

	test('should fail with an unexpected error', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const tagFindOneMock = jest.spyOn(Tag, 'find').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in find.'));

		const result = await getAllTags();
		expect(result).toBeFalsy();

		const errorMessage = console.error.mock.calls[0][0].toString();
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));
	
		tagFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

// TODO
describe('Tag Controller - updateTag', () => {
	test('should update the tag', async() => {
		const tag = 'test';
		const newTag = 'cosmo';
		await Tag.create({tag: tag});

		await updateTag(tag, newTag);

		const result = await Tag.findOne({tag: newTag});
		expect(result.tag).toEqual(newTag);
	});
});

// TODO
// describe('Tag Controller - deleteOneTag', () => {

// });
