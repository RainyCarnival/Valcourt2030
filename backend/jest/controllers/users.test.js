const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const Tag = require('../../database/models/tagsModel');
const MailingList = require('../../database/models/mailingListModel');
const User = require('../../database/models/userModel');
const Event = require('../../database/models/eventsModel');
const Municipality = require('../../database/models/municipalityModel');
const UserController = require('../../database/controllers/userController');
const { globalDefaultMunicipality } = require('../../globals');

let mongoServer;

const testUser = {
	firstName: 'test',
	lastName: 'testington',
	email: 'test@test.com',
	password: 'testing1',
	interestedTags: []
};

const testEvent = {
	eventId: '1234',
	title: 'testing event',
	description: 'this is a test event',
	tags: [],
	venue: 'this venue',
	address: '123 test avenue',
	date: 'tomorrow',
	url: 'test.com'
};

const testMailingList = {
	tag: new ObjectId(),
	users: [],
};

// Connect to database before tests.
beforeAll(async() => {
	mongoServer = await MongoMemoryServer.create();
	const mongoUri = mongoServer.getUri();
	await mongoose.connect(mongoUri);

	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(testUser.password, salt);
	testUser.password = passwordHash;
	testUser.interestedTags = [testMailingList.tag];
});

// Disconnect from database after tests.
afterAll(async() => {
	await mongoose.disconnect();
	await mongoServer.stop();
});

// Clean up the database
afterEach(async() => {
	testUser.interestedTags = [testMailingList.tag];

	await Tag.deleteMany({});
	await MailingList.deleteMany({});
	await User.deleteMany({});
	await Event.deleteMany({});
	await Municipality.deleteMany({});
});

describe('User Controller - getAllUsers', () => {
	test('should get all users', async() => {
		await User.create(testUser);
		testUser.email = 'com@test.com';
		await User.create(testUser);

		const result = await UserController.getAllUsers();

		expect(result).toHaveLength(2);
	});

	test('should handle no users found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await UserController.getAllUsers();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No users found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const findMock = jest.spyOn(User, 'find').mockResolvedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.getAllUsers();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('User Controller - isEmailUnique', () => {
	test('should get true users', async() => {
		const result = await UserController.isEmailUnique(testUser.email);

		expect(result).toBe(true);
	});

	test('should handle no email sent', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await UserController.isEmailUnique();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Missing email'));

		consoleErrorMock.mockRestore();
	});

	test('should handle no email sent', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);

		const result = await UserController.isEmailUnique(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Email already exists'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const findOneMock = jest.spyOn(User, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		
		const result = await UserController.isEmailUnique(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('User Controller - getOneUsers', () => {
	test('should get one users', async() => {
		await User.create(testUser);

		const result = await UserController.getOneUser(testUser.email);

		expect(result.email).toEqual(testUser.email);
	});

	test('should handle no users found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await UserController.getOneUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('User not found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.getOneUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('User Controller - registerUser', () => {
	test('should register a users and update mailing lists', async() => {
		const mailingList = await MailingList.create(testMailingList);

		const userResult = await UserController.registerUser(testUser, false, false);
		const mailingListResult = await MailingList.findOne({_id: mailingList._id});
		const user = await User.findOne({email: testUser.email});
		const municipality = await Municipality.findOne({municipality: globalDefaultMunicipality});
		
		expect(userResult).toBe(true);

		// Ensure the user is added to the mailing list
		expect(mailingListResult.users[0]._id).toEqual(user._id);

		// Ensure the default municipality is created
		expect(user.municipality).toEqual(municipality._id);
	});

	test('should register a users as an admin and update mailing lists', async() => {
		const mailingList = await MailingList.create(testMailingList);

		const userResult = await UserController.registerUser(testUser, true, false);
		const mailingListResult = await MailingList.findOne({_id: mailingList._id});
		const user = await User.findOne({email: testUser.email});

		expect(userResult).toBe(true);
		expect(mailingListResult.users).toHaveLength(1);
		expect(user.isAdmin).toBe(true);
	});

	test('should register a validated user and update mailing lists', async() => {
		const mailingList = await MailingList.create(testMailingList);

		const userResult = await UserController.registerUser(testUser, false, true);
		const mailingListResult = await MailingList.findOne({_id: mailingList._id});
		const user = await User.findOne({email: testUser.email});

		expect(userResult).toBe(true);
		expect(mailingListResult.users).toHaveLength(1);
		expect(user.isValidated).toBe(true);
	});

	test('should handle missing required fields', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		// Missing firstName
		let result = await UserController.registerUser({lastName: 'test', email: 'test@test.com', password: 'test1'});
		let errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Missing required fields: firstName'));

		// Missing lastName
		result = await UserController.registerUser({firstName: 'test', email: 'test@test.com', password: 'test1'});
		errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Missing required fields: lastName'));

		// Missing email
		result = await UserController.registerUser({firstName: 'test', lastName: 'test', password: 'test1'});
		errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Missing required fields: email'));

		// Missing password
		result = await UserController.registerUser({firstName: 'test', lastName: 'test', email: 'test@test.com'});
		errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Missing required fields: password'));

		consoleErrorMock.mockRestore();
	});

	test('should handle bad interestedTags type', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		testUser.interestedTags = '1234';

		const result = await UserController.registerUser(testUser);
		const errorMessage = console.error.mock.calls.toString();


		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('interested tags must be an Array'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failure to get default municipality', async() => {
		const createMock = jest.spyOn(Municipality, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await MailingList.create(testMailingList);

		const test = {
			firstName: testUser.firstName,
			lastName: testUser.lastName,
			email: testUser.email,
			password: testUser.password
		};
		const result = await UserController.registerUser(test);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create default municipality'));

		createMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
	
	test('should handle failure to create user', async() => {
		const createMock = jest.spyOn(User, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await MailingList.create(testMailingList);

		const result = await UserController.registerUser(testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create user'));

		createMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle failure updating mailing list', async() => {
		const findOneMock = jest.spyOn(MailingList, 'findOne').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await MailingList.create(testMailingList);

		const result = await UserController.registerUser(testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to add user to the mailing list'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const createMock = jest.spyOn(User, 'create').mockResolvedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await MailingList.create(testMailingList);
		
		const result = await UserController.registerUser(testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		createMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('User Controller - loginUser', () => {
	test('should login the users', async() => {
		const compareMock = jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
		const user = await User.create(testUser);

		const result = await UserController.loginUser(user.email, user.password);

		expect(result).toBe(true);

		compareMock.mockRestore();
	});

	test('should handle no email received', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.loginUser();
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('method requires an email'));

		consoleErrorMock.mockRestore();
	});

	test('should handle no password received', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.loginUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('method requires a password'));

		consoleErrorMock.mockRestore();
	});
	
	test('should handle user not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await UserController.loginUser(testUser.email, testUser.password);
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('User not found'));

		consoleErrorMock.mockRestore();
	});
	
	test('should handle failed password validation', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		const salt = await bcrypt.genSalt(10);
		const passwordHash = await bcrypt.hash('test', salt);

		const result = await UserController.loginUser(testUser.email, passwordHash);
		const errorMessage = console.error.mock.calls.toString();
		
		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Password validation failure'));

		consoleErrorMock.mockRestore();
	});
	
	test('should handle unexpected error', async() => {
		const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.loginUser(testUser.email, testUser.password);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
	
});

// TODO
describe('User Controller - updateOneUser', () => {
	test('should update the user adding and removing tags', async() => {
		await MailingList.create(testMailingList);
		await User.create(testUser);
		const updatedUser = testUser;
		updatedUser.interestedTags = [];

		// Test updating user tags and removing them from the mailing list.
		let userResult = await UserController.updateOneUser(testUser.email, updatedUser);
		let mailingListResult = await MailingList.findOne({tag: testMailingList.tag});

		expect(userResult).toBe(true);
		expect(mailingListResult.users).toHaveLength(0);

		// Test updating user tags and adding them back to the mailing list.
		updatedUser.interestedTags = [testMailingList.tag];

		userResult = await UserController.updateOneUser(testUser.email, updatedUser);
		mailingListResult = await MailingList.findOne({tag: testMailingList.tag});

		expect(userResult).toBe(true);
		expect(mailingListResult.users).toHaveLength(1);
	});

	test('should handle no users found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await UserController.updateOneUser(testUser.email, testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('User not found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle no modifications made', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await MailingList.create(testMailingList);
		await User.create(testUser);

		const result = await UserController.updateOneUser(testUser.email, testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No modifications made'));

		consoleErrorMock.mockRestore();
	});

	
	test('should handle failure to add user to mailing list', async() => {
		const findOneMock = jest.spyOn(MailingList, 'findOne').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		testUser.interestedTags = [];
		await User.create(testUser);
		await MailingList.create(testMailingList);
		const updatedUser = testUser;
		updatedUser.interestedTags = [testMailingList.tag];


		const result = await UserController.updateOneUser(testUser.email, testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to add user to the mailing list'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle failure to remove user from mailing list', async() => {
		const findOneMock = jest.spyOn(MailingList, 'findOne').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		await MailingList.create(testMailingList);
		const updatedUser = testUser;
		updatedUser.interestedTags = [];

		const result = await UserController.updateOneUser(testUser.email, testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to remove user from the mailing list'));
		
		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		await MailingList.create(testMailingList);
		
		const result = await UserController.updateOneUser(testUser.email, testUser);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('User Controller - deleteOneUser', () => {
	test('should delete one users', async() => {
		const user = await User.create(testUser);
		testMailingList.users.push(user._id);
		const mailingList = await MailingList.create(testMailingList);

		const userResult = await UserController.deleteOneUser(testUser.email);
		const mailingListResult = await MailingList.findOne({_id: mailingList._id});

		expect(userResult).toBe(true);
		expect(mailingListResult.users).toHaveLength(0);
	});

	test('should handle no users found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		
		const result = await UserController.deleteOneUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('User not found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failed to remove user from mailing list', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.deleteOneUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to remove user from the mailing list'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failure to delete user', async() => {
		const deleteOneMock = jest.spyOn(User, 'deleteOne').mockReturnValue({deletedCount: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const user = await User.create(testUser);
		testMailingList.users.push(user._id);
		await MailingList.create(testMailingList);
		
		const result = await UserController.deleteOneUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to delete user'));

		deleteOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle unexpected errors', async() => {
		const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await User.create(testUser);
		
		const result = await UserController.deleteOneUser(testUser.email);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});