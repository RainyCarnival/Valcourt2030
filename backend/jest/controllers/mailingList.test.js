const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tag = require('../../database/models/tagsModel');
const MailingList = require('../../database/models/mailingListModel');
const User = require('../../database/models/userModel');
const MailingListController = require('../../database/controllers/mailingListController');

let mongoServer;

const testUser = {
	firstName: 'test',
	lastName: 'testington',
	email: 'test@test.com',
	password: 'testing1',
	interestedTags: [],
	isAdmin: false,
	isValidated: false
};

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
	await MailingList.deleteMany({});
	await Tag.deleteMany({});
	await User.deleteMany({});
});

describe('MailingListController - createOneMailingList', () => {
	test('should create a mailing list', async() => {
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});

		const result = await MailingListController.createOneMailingList(tag._id);

		expect(result).toBe(true);
	});

	test('should handle duplicate lists', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		await MailingList.create({tag: tag._id});
		
		const result = await MailingListController.createOneMailingList(tag._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Mailing list already exists'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const mailingListCreateMock = jest.spyOn(MailingList, 'create').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		
		const result = await MailingListController.createOneMailingList(tag._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		mailingListCreateMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('MailingListController - getOneMailingList', () => {
	test('should get one mailing list', async() => {
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		const list = await MailingList.create({tag: tag._id});
		
		const result = await MailingListController.getOneMailingList(list.tag);

		expect(result.tag._id).toEqual(list.tag);
	});

	test('shoould handle mailing list not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		await MailingList.create({tag: tag._id});

		const result = await MailingListController.getOneMailingList(new ObjectId());
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBeUndefined();
		expect(errorMessage).toEqual(expect.stringContaining('Mailing list not found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const mailingListFindOneMock = jest.spyOn(MailingList, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		const list = await MailingList.create({tag: tag._id});

		const result = await MailingListController.getOneMailingList(list.tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBeUndefined();
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		mailingListFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('MailingListController - updateOneMailingList', () => {
	test('should add user to the mailing List', async() => {
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		const list = await MailingList.create({tag: tag._id});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		
		const result = await MailingListController.updateOneMailingList(list.tag, 'add', user._id);

		expect(result).toBe(true);
	});

	test('should remove a user from the mailing List', async() => {
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		const list = await MailingList.create({tag: tag._id, users: [user._id]});
		
		const result = await MailingListController.updateOneMailingList(list.tag, 'remove', user._id);

		expect(result).toBe(true);
	});

	test('should handle no matching mailing List', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		
		const result = await MailingListController.updateOneMailingList(tag._id, 'add', user._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No matching mailing list found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unable to add to mailing List', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		const list = await MailingList.create({tag: tag._id, users: [user._id]});
		
		const result = await MailingListController.updateOneMailingList(list.tag, 'add', user._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(true);
		expect(errorMessage).toEqual(expect.stringContaining('User already in mailing list'));


		consoleErrorMock.mockRestore();
	});

	test('should handle unable to remove from mailing List', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		const list = await MailingList.create({tag: tag._id});
		
		const result = await MailingListController.updateOneMailingList(list.tag, 'remove', user._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(true);
		expect(errorMessage).toEqual(expect.stringContaining('User not found in mailing list'));


		consoleErrorMock.mockRestore();
	});

	test('should handle invalid switch action', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		const list = await MailingList.create({tag: tag._id});
		
		const result = await MailingListController.updateOneMailingList(list.tag, 'invalid', user._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Invalid action specified'));

		consoleErrorMock.mockRestore();
	});

	test('should handle a failed mailing list update', async() => {
		const mailingListFindOneMock = jest.spyOn(MailingList, 'updateOne').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		const list = await MailingList.create({tag: tag._id});

		const result = await MailingListController.updateOneMailingList(list.tag, 'add', user._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to save updated information'));

		consoleErrorMock.mockRestore();
		mailingListFindOneMock.mockRestore();
	});

	test('should handle an unexpected error', async() => {
		const mailingListFindOneMock = jest.spyOn(MailingList, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		testUser.interestedTags = tag._id;
		const user = await User.create(testUser);
		const list = await MailingList.create({tag: tag._id});
		
		const result = await MailingListController.updateOneMailingList(list.tag, 'add', user._id);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		consoleErrorMock.mockRestore();
		mailingListFindOneMock.mockRestore();
	});
});

describe('MailingListController - deleteOneMailingList', () => {
	test('should delete a mailing list', async() => {
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		const list = await MailingList.create({tag: tag._id});

		const result = await MailingListController.deleteOneMailingList(list.tag);

		expect(result).toBe(true);
	});

	test('should handle failed deletion', async() => {
		const mailingListFindOneMock = jest.spyOn(MailingList, 'deleteOne').mockReturnValue({deletedCount: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		const list = await MailingList.create({tag: tag._id});

		const result = await MailingListController.deleteOneMailingList(list.tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No matching mailing list to delete'));
		
		mailingListFindOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected error', async() => {
		const mailingListDeleteOneMock = jest.spyOn(MailingList, 'deleteOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newTag = 'test';
		const tag = await Tag.create({tag: newTag});
		const list = await MailingList.create({tag: tag._id});

		const result = await MailingListController.deleteOneMailingList(list.tag);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));
		
		mailingListDeleteOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});