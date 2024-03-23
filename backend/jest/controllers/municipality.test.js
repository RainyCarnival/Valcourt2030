const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Tag = require('../../database/models/tagsModel');
const MailingList = require('../../database/models/mailingListModel');
const User = require('../../database/models/userModel');
const Municipality = require('../../database/models/municipalityModel');
const MunicipalityController = require('../../database/controllers/municipalityController');

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
	await Municipality.deleteMany({});
});

describe('Municipality Controller - getOneMunicipality', () => {
	test('should get one municipality', async() => {
		const newMunicipality = 'test';
		await Municipality.create({municipality: newMunicipality});

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);

		expect(result.municipality.toLowerCase()).toEqual(newMunicipality.toLowerCase());
	});

	test('should handle creating the default municipality', async() => {
		const newMunicipality = 'autre';

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);

		expect(result.municipality.toLowerCase()).toEqual(newMunicipality.toLowerCase());
	});
	
	test('should handle failed default municipality creation', async() => {
		const createOneMock = jest.spyOn(Municipality, 'create').mockResolvedValueOnce(null);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'autre';

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create default municipality'));

		createOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle not finding the municipality', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Municipality not found'));

		consoleErrorMock.mockRestore();
	});
	
	test('should handle unexpected error', async() => {
		const createOneMock = jest.spyOn(Municipality, 'findOne').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		createOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Municipality Controller - getAllMunicipalities', () => {
	test('should get all municipality', async() => {
		const municipality1 = 'test';
		const municipality2 = 'chest';
		await Municipality.create({municipality: municipality1});
		await Municipality.create({municipality: municipality2});

		const result = await MunicipalityController.getAllMunicipalities();

		expect(result).toHaveLength(2);
	});

	test('should handle not finding any municipalities', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const result = await MunicipalityController.getAllMunicipalities();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toHaveLength(0);
		expect(errorMessage).toEqual(expect.stringContaining('No municipalities found'));

		consoleErrorMock.mockRestore();
	});
	
	test('should handle unexpected error', async() => {
		const createOneMock = jest.spyOn(Municipality, 'find').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await MunicipalityController.getAllMunicipalities();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		createOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});