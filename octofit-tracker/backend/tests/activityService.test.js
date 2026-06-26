"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const activityService_1 = require("../src/activityService");
const models_1 = require("../src/models");
const db_1 = require("../src/db");
(0, node_test_1.default)('logActivity stores a new activity and computes points', async () => {
    await (0, db_1.connectToDatabase)();
    const user = await models_1.User.create({
        username: 'test-user',
        email: 'test-user@example.com',
        passwordHash: 'hash',
        age: 16,
        fitnessLevel: 'beginner'
    });
    const activity = await (0, activityService_1.logActivity)({
        userId: user._id.toString(),
        type: 'running',
        durationMinutes: 20,
        caloriesBurned: 240,
        notes: 'Test run'
    });
    const saved = await models_1.Activity.findById(activity._id);
    strict_1.default.ok(saved);
    strict_1.default.equal(saved?.pointsEarned, 20);
    strict_1.default.equal(saved?.user.toString(), user._id.toString());
    await models_1.Activity.deleteMany({});
    await models_1.User.deleteMany({});
});
