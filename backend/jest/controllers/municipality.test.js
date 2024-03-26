const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../database/models/userModel');
const Municipality = require('../../database/models/municipalityModel');
const MunicipalityController = require('../../database/controllers/municipalityController');
const { globalDefaultMunicipality } = require('../../globals');

let mongoServer;

const testUser = {
	firstName: 'test',
	lastName: 'testington',
	email: 'test@test.com',
	password: 'testing1',
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
		const createMock = jest.spyOn(Municipality, 'create').mockResolvedValueOnce(null);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'autre';

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create default municipality'));

		createMock.mockRestore();
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
		const createMock = jest.spyOn(Municipality, 'findOne').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.getOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		createMock.mockRestore();
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
		const findMock = jest.spyOn(Municipality, 'find').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await MunicipalityController.getAllMunicipalities();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Municipality Controller - createOneMunicipality', () => {
	test('should create a municipality', async() => {
		const newMunicipality = 'test';

		const result = await MunicipalityController.createOneMunicipality(newMunicipality);

		expect(result).toBe(true);
	});

	test('should handle duplicate municipalities', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';
		await Municipality.create({municipality: newMunicipality});

		const result = await MunicipalityController.createOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Municipality already exists'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failed municipality creation', async() => {
		const createMock = jest.spyOn(Municipality, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.createOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create municipality'));

		createMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
	
	test('should handle unexpected error', async() => {
		const findOneMock = jest.spyOn(Municipality, 'findOne').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.createOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Municipality Controller - deleteOneMunicipality', () => {
	test('should delete a municipality and update users if needed', async() => {
		const newMunicipality = 'test';
		const municipality = await Municipality.create({municipality: newMunicipality});
		testUser.municipality = municipality._id;
		await User.create(testUser);

		const result = await MunicipalityController.deleteOneMunicipality(newMunicipality);
		const user = await User.findOne({email: testUser.email});
		const defaultMunitcipality = await Municipality.findOne({municipality: globalDefaultMunicipality});

		expect(result).toBe(true);
		expect(user.municipality).toEqual(defaultMunitcipality._id);
	});

	test('should handle default municipality deletion error', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Municipality.create({municipality: globalDefaultMunicipality});

		const result = await MunicipalityController.deleteOneMunicipality(globalDefaultMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Cannot delete default Municipality'));

		consoleErrorMock.mockRestore();
	});

	test('should handle municipality not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.deleteOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Could not find municipality to delete'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failed user update', async() => {
		const findOneMock = jest.spyOn(User, 'findOne').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';
		const municipality = await Municipality.create({municipality: newMunicipality});
		testUser.municipality = municipality._id;
		await User.create(testUser);

		const result = await MunicipalityController.deleteOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to update the municipality of user'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
	
	test('should handle unexpected error', async() => {
		const findOneAndDeleteMock = jest.spyOn(Municipality, 'findOneAndDelete').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';

		const result = await MunicipalityController.deleteOneMunicipality(newMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		findOneAndDeleteMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Municipality Controller - updateMunicipality', () => {
	test('should update the municipality', async() => {
		const newMunicipality = 'test';
		const updatedMunicipality = 'chest';
		await Municipality.create({municipality: newMunicipality});

		const result = await MunicipalityController.updateMunicipality(newMunicipality, updatedMunicipality);

		expect(result).toBe(true);
	});

	test('should handle municipality not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';
		const updatedMunicipality = 'chest';

		const result = await MunicipalityController.updateMunicipality(newMunicipality, updatedMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No matching municipality to update'));

		consoleErrorMock.mockRestore();
	});
	
	test('should handle unexpected error', async() => {
		const updateOneMock = jest.spyOn(Municipality, 'updateOne').mockRejectedValueOnce(new Error('Mocked Error: unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const newMunicipality = 'test';
		const updatedMunicipality = 'chest';

		const result = await MunicipalityController.updateMunicipality(newMunicipality, updatedMunicipality);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Unexpected error'));

		updateOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});