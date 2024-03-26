const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tag = require('../../database/models/tagsModel');
const MailingList = require('../../database/models/mailingListModel');
const User = require('../../database/models/userModel');
const Event = require('../../database/models/eventsModel');
const UserController = require('../../database/controllers/userController');

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

// TODO
describe('User Controller - getAllUsers', () => {
	test('should get all users', async() => {

	});

	// test('should handle no users found', async() => {

	// });

	// test('should handle unexpected errors', async() => {

	// });
});

// describe('User Controller - isEmailUnique', () => {
// 	test('should get all users', async() => {

// 	});

// 	test('should handle no users found', async() => {

// 	});

// 	test('should handle unexpected errors', async() => {

// 	});
// });

// describe('User Controller - getOneUsers', () => {
// 	test('should get one user', async() => {

// 	});

// 	test('should handle no users found', async() => {

// 	});

// 	test('should handle unexpected errors', async() => {

// 	});
// });

// describe('User Controller - registerUser', () => {
// 	test('should register a users and update mailing lists', async() => {

// 	});

// 	test('should handle missing required fields', async() => {

// 	});

// 	test('should handle bad interestedTags type', async() => {

// 	});
	
// 	test('should handle setting default municipality', async() => {

// 	});
	
// 	test('should handle failure to get default municipality', async() => {

// 	});
	
// 	test('should handle failure to create user', async() => {

// 	});

// 	test('should handle failure updating mailing list', async() => {

// 	});

// 	test('should handle unexpected errors', async() => {

// 	});
// });

// describe('User Controller - loginUser', () => {
// 	test('should get all users', async() => {

// 	});

// 	test('should handle no users found', async() => {

// 	});

// 	test('should handle unexpected errors', async() => {

// 	});
// });

// describe('User Controller - updateOneUser', () => {
// 	test('should get all users', async() => {

// 	});

// 	test('should handle no users found', async() => {

// 	});

// 	test('should handle unexpected errors', async() => {

// 	});
// });

// describe('User Controller - deleteOneUser', () => {
// 	test('should get all users', async() => {

// 	});

// 	test('should handle no users found', async() => {

// 	});

// 	test('should handle unexpected errors', async() => {

// 	});
// });