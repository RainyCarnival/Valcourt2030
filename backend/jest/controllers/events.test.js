const { test, expect } = require('@jest/globals');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { MongoMemoryServer } = require('mongodb-memory-server');
const Events = require('../../database/models/eventsModel');
const EventsController = require('../../database/controllers/eventsController');

let mongoServer;

const testEvent = {
	eventId: '1234',
	eventStatus: 'publish',
	title: 'testing event',
	description: 'this is a test event',
	tags: [],
	startDate: 'tomorrow',
	originUrl: 'test.com'
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
	await Events.deleteMany({});
});

describe('Events Controller - getAllEvents', () => {
	test('should get all the events', async() => {
		await Events.create(testEvent);
		testEvent.eventId = '123';
		await Events.create(testEvent);

		const result = await EventsController.getAllEvents();

		expect(result).toHaveLength(2);
	});

	test('should handle no events found', async() => {
		const findMock = jest.spyOn(Events, 'find').mockResolvedValueOnce({length: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await EventsController.getAllEvents();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No Events found'));

		findMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle an unexpected error', async() => {
		const findMock = jest.spyOn(Events, 'find').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);
		
		const result = await EventsController.getAllEvents();
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		findMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Events Controller - getOneEvent', () => {
	test('should get one event', async() => {
		await Events.create(testEvent);

		const result = await EventsController.getOneEvent(testEvent.eventId);

		expect(result.eventId).toEqual(testEvent.eventId);
	});

	test('should handle no events found', async() => {
		const findOneMock = jest.spyOn(Events, 'findOne').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await EventsController.getOneEvent(testEvent.eventId);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Event not found'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle an unexpected error', async() => {
		const findOneMock = jest.spyOn(Events, 'findOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);
		
		const result = await EventsController.getOneEvent(testEvent.eventId);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		findOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Events Controller - createOneEvent', () => {
	test('should create one event', async() => {
		const result = await EventsController.createOneEvent(testEvent);

		expect(result.eventId).toEqual(testEvent.eventId);
	});

	test('should handle event creation error', async() => {
		const createMock = jest.spyOn(Events, 'create').mockResolvedValueOnce(false);
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await EventsController.createOneEvent(testEvent);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to create the event'));

		createMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle an unexpected error', async() => {
		const createMock = jest.spyOn(Events, 'create').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		
		const result = await EventsController.createOneEvent(testEvent);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		createMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Events Controller - updateOneEvent', () => {
	test('should update one event', async() => {
		const event = await Events.create(testEvent);
		const updatedEvent = {
			eventId: '1234',
			title: 'event testing',
			description: 'event test this is',
			tags: [new ObjectId],
			venue: 'venue this',
			address: 'avenue 123 test',
			date: 'today',
			url: 'com.test'
		};


		const result = await EventsController.updateOneEvent(event.eventId, updatedEvent);
		const newEvent = await Events.findOne({eventId: updatedEvent.eventId});

		expect(result).toBeTruthy();
		expect({
			eventId: newEvent.eventId,
			title: newEvent.title,
			description: newEvent.description,
			tags: newEvent.tags,
			venue: newEvent.venue,
			address: newEvent.address,
			date: newEvent.date,
			url: newEvent.url
		}).toEqual({
			eventId: updatedEvent.eventId,
			title: updatedEvent.title,
			description: updatedEvent.description,
			tags: updatedEvent.tags,
			venue: updatedEvent.venue,
			address: updatedEvent.address,
			date: updatedEvent.date,
			url: updatedEvent.url
		});
	});

	test('should handle event not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await EventsController.updateOneEvent(testEvent.eventId, testEvent);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No document found for event id'));

		consoleErrorMock.mockRestore();
	});

	test('should handle no modifications made', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);

		const result = await EventsController.updateOneEvent(testEvent.eventId, testEvent);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('No modifications to be made'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failed event update', async() => {
		const updateOneMock = jest.spyOn(Events, 'updateOne').mockResolvedValueOnce({modifiedCount: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);
		testEvent.date = 'today';
		
		const result = await EventsController.updateOneEvent(testEvent.eventId, testEvent);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to update the event'));

		updateOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle an unexpected error', async() => {
		const updateOneMock = jest.spyOn(Events, 'updateOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);
		testEvent.date = 'yesterday';
		
		const result = await EventsController.updateOneEvent(testEvent.eventId, testEvent);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		updateOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});

describe('Events Controller - deleteOneEvent', () => {
	test('should delete one event', async() => {
		await Events.create(testEvent);

		const result = await EventsController.deleteOneEvent(testEvent.eventId);

		expect(result).toEqual(testEvent.tags);
	});

	test('should handle event not found', async() => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

		const result = await EventsController.deleteOneEvent(testEvent.eventId);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Event not found'));

		consoleErrorMock.mockRestore();
	});

	test('should handle failed event deletion', async() => {
		const deleteOneMock = jest.spyOn(Events, 'deleteOne').mockResolvedValueOnce({deletedCount: 0});
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);
		
		const result = await EventsController.deleteOneEvent(testEvent.eventId);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('Failed to delete event'));

		deleteOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});

	test('should handle an unexpected error', async() => {
		const deleteOneMock = jest.spyOn(Events, 'deleteOne').mockRejectedValueOnce(new Error('Mocked error: Unexpected error.'));
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		await Events.create(testEvent);
		
		const result = await EventsController.deleteOneEvent(testEvent.eventId);
		const errorMessage = console.error.mock.calls.toString();

		expect(result).toBe(false);
		expect(errorMessage).toEqual(expect.stringContaining('unexpected error'));

		deleteOneMock.mockRestore();
		consoleErrorMock.mockRestore();
	});
});