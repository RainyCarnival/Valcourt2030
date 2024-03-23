const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tag = require('../../database/models/tagsModel');
const MailingList = require('../../database/models/mailingListModel');
const User = require('../../database/models/userModel');
const Event = require('../../database/models/eventsModel');
const TagsController = require('../../database/controllers/tagsController');

let mongoServer;

const testUser = {
	firstName: 'test',
	lastName: 'testington',
	email: 'test@test.com',
	password: 'testing1',
	interestedTags: '',
	isAdmin: false,
	isValidated: false
};

const testEvent = {
	eventId: '1234',
	title: 'testing event',
	description: 'this is a test event',
	tags: '',
	venue: 'this venue',
	address: '123 test avenue',
	date: 'tomorrow',
	url: 'test.com'
};

const testMailingList = {
	tag: '',
	users: [],
};

async function deleteTagSetup() {
	const newTag = 'test';
		
	await Tag.create({tag: newTag});
	const tag = await Tag.findOne({tag: newTag});

	testEvent.tags = tag._id;
	await Event.create(testEvent);
	
	testUser.interestedTags = tag._id;
	const user = await User.create(testUser);
	
	testMailingList.tag = tag._id;
	testMailingList.users.push(user._id);
	await MailingList.create(testMailingList);

	return tag;
}

// Connect to database before tests.
beforeAll(async() => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	await mongoose.connect(mongoUri);
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
	await User.deleteMany({});
	await Event.deleteMany({});
});

describe('Tag Controller - createOneTag', () => {
	test('should create a new tag.', async() => {
		const newTag = 'test';
	
		await TagsController.createOneTag(newTag);
	
		const createdTag = await Tag.findOne({ tag: newTag });
		const createdMailingList = await MailingList.findOne({ tag: createdTag._id });
		
		expect(createdTag.tag).toEqual(newTag);
		expect(createdMailingList).toBeTruthy();
	});

	test('should handle duplicate tag creation.', async() => {
		console.error = jest.fn();
		const newTag = 'test';
		await Tag.create({ tag: newTag });
	
		const result = await TagsController.createOneTag(newTag);
		const errorMessage = console.error.mock.calls.toString();
	
		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Tag already exists'));
	});

	test('should handle failed tag creation', async() => {
		const tagCreateMock = jest.spyOn(Tag, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';

		const result = await TagsController.createOneTag(newTag);
		const errorMessage = consoleErrorMock.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create tag'));

		tagCreateMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle failed mailing list creation', async() => {
		const mailingListCreateMock = jest.spyOn(MailingList, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';

		const result = await TagsController.createOneTag(newTag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create mailing list'));
		
		mailingListCreateMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const tagFindOneMock = jest.spyOn(Tag, 'create').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in create.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';

		const result = await TagsController.createOneTag(newTag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));
	
		tagFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Tag Controller - getOneTag', () => {
	test('should get the specified tag', async() => {
		const newTag = 'test';
		await Tag.create({tag: newTag});

		const result = await TagsController.getOneTag(newTag);

		expect(result.tag).toEqual(newTag);
	});

	test('should handle no tags found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const tag = 'test';

		const result = await TagsController.getOneTag(tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBeNull();
		expect(errorMessage).toEqual(expect.stringContaining('Tag not found'));
	
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected error', async() => {
		const tagFindOneMock = jest.spyOn(Tag, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in findOne.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const tag = 'test';

		await Tag.create({tag: tag});

		const result = await TagsController.getOneTag(tag);
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBeFalsy();
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

		const result = await TagsController.getAllTags();

		expect(result).toHaveLength(2);
	});

	test('should handle no tags to return', async() => {
		const result = await TagsController.getAllTags();

		expect(result).toHaveLength(0);
	});

	test('should handle unexpected error', async() => {
		const tagFindOneMock = jest.spyOn(Tag, 'find').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in find.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await TagsController.getAllTags();
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBeFalsy();
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));
	
		tagFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Tag Controller - updateTag', () => {
	test('should update and existing tag', async() => {		
		const tag = 'test';
		const newTag = 'chest';
		await Tag.create({tag: tag});

		await TagsController.updateOneTag(tag, newTag);
		const result = await Tag.findOne({tag: newTag});

		expect(result.tag).toEqual(newTag);
	});

	test('should handle duplicate tag update', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';

		await Tag.create({tag: newTag});

		const result = await TagsController.updateOneTag(newTag, newTag);
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('tag already exists'));

		consoleErrorMock.mockRestore();
	});

	test('should handle no modifications made', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const badTag = 'chest';

		await Tag.create({tag: newTag});

		const result = await TagsController.updateOneTag(badTag, badTag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No modifications made'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected error', async() => {
		const tagFindOneMock = jest.spyOn(Tag, 'updateOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in updateOne.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const updatedTag = 'chest';

		await Tag.create({tag: newTag});
		
		const result = await TagsController.updateOneTag(newTag, updatedTag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		tagFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Tag Controller - deleteOneTag', () => {
	test('should delete one tag and keep database integrity', async() => {
		// Setup
		const tag = await deleteTagSetup();

		// Action
		const tagResult = await TagsController.deleteOneTag(tag._id);
	
		// Verification
		const userResult = await User.findOne({email: testUser.email});
		const eventResult = await Event.findOne({eventId: testEvent.eventId});
		const mailingListResult = await MailingList.findOne({tag: tag._id});
		
		expect(tagResult).toBe(true);
		expect(userResult.interestedTags).toHaveLength(0);
		expect(eventResult.tags).toHaveLength(0);
		expect(mailingListResult).toBeNull();
	});

	test('should handle tag not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const badTag = new mongoose.Types.ObjectId('65fe1f2bba7518c0145108df');
		await Tag.create({tag: newTag});

		const result = await TagsController.deleteOneTag(badTag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to find the tag'));

		consoleErrorMock.mockRestore();
	});

	// FIXME findOne not returning the mocked result
	// test('should handle failed tag deletion from users', async() => {
	// 	const tag = await deleteTagSetup();
	// 	const updateUsersMock = jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Mocked error: failed to find one user.'));
	// 	const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

	// 	const result = await TagsController.deleteOneTag(tag);
	// 	const errorMessage = console.error.mock.calls.toString();

	// 	expect(result).toBe(false);
	// 	expect(errorMessage).toEqual(expect.stringContaining('Failed to remove tag from users'));

	// 	updateUsersMock.mockRestore();
	// 	consoleErrorMock.mockRestore();
	// });

	// FIXME findOne not returning the mocked result
	// test('should handle failed tag deletion from events', async() => {
	// 	const tag = await deleteTagSetup();
	// 	const updateEventsMock = jest.spyOn(Event, 'findOne').mockResolvedValueOnce(null);
	// 	const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

	// 	const result = await TagsController.deleteOneTag(tag);
	// 	const errorMessage = console.error.mock.calls.toString();

	// 	expect(result).toBe(false);
	// 	expect(errorMessage).toEqual(expect.stringContaining('Failed to remove tag from events'));

	// 	updateEventsMock.mockRestore();
	// 	consoleErrorMock.mockRestore();
	// });

	test('should handle failed mailing list deletion', async() => {
		const tag = await deleteTagSetup();
		const deleteMailingListMock = jest.spyOn(MailingList, 'deleteOne').mockReturnValue({deletedCount: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await TagsController.deleteOneTag(tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to delete the corresponding mailing list'));

		deleteMailingListMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle failed tag deletion', async() => {
		const tag = await deleteTagSetup();
		const updateUsersMock = jest.spyOn(Tag, 'deleteOne').mockReturnValue({deletedCount: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await TagsController.deleteOneTag(tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to delete the tag'));

		updateUsersMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const tag = await deleteTagSetup();
		const tagDeleteOneMock = jest.spyOn(Tag, 'deleteOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error in updateOne.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await TagsController.deleteOneTag(tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		tagDeleteOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});