const { beforeAll, afterAll } = require('@jest/globals');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

beforeAll(async() => {
	const mongoUri = await mongoServer.getUri();
	await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async() => {
	await mongoose.disconnect();
	await mongoServer.stop();
});