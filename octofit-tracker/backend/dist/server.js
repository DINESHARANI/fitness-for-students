"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("./models");
const activityService_1 = require("./activityService");
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const port = process.env.PORT ? Number(process.env.PORT) : 8000;
const codespaceName = process.env.CODESPACE_NAME;
const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev`
    : `http://localhost:${port}`;
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', apiBaseUrl });
});
app.get(['/api/users', '/api/users/'], async (_req, res) => {
    const users = await models_1.User.find().lean();
    res.json(users);
});
app.get(['/api/teams', '/api/teams/'], async (_req, res) => {
    const teams = await models_1.Team.find().lean();
    res.json(teams);
});
app.get(['/api/activities', '/api/activities/'], async (_req, res) => {
    const activities = await models_1.Activity.find().sort({ date: -1 }).lean();
    res.json(activities);
});
app.post(['/api/activities', '/api/activities/'], async (req, res) => {
    try {
        const activity = await (0, activityService_1.logActivity)(req.body);
        res.status(201).json(activity);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to log activity';
        res.status(400).json({ error: message });
    }
});
app.get('/api/activities/:userId', async (req, res) => {
    const activities = await (0, activityService_1.getActivitiesForUser)(req.params.userId);
    res.json(activities);
});
app.get('/api/activities/:userId/summary', async (req, res) => {
    const summary = await (0, activityService_1.getActivitySummary)(req.params.userId);
    res.json(summary);
});
app.get(['/api/leaderboard', '/api/leaderboard/'], async (_req, res) => {
    const leaderboard = await models_1.LeaderboardEntry.find().sort({ totalPoints: -1 }).lean();
    res.json(leaderboard);
});
app.get(['/api/workouts', '/api/workouts/'], async (_req, res) => {
    const workouts = await models_1.WorkoutSuggestion.find().lean();
    res.json(workouts);
});
app.get('/api/config', (_req, res) => {
    res.json({ apiBaseUrl, port });
});
async function start() {
    await (0, db_1.connectToDatabase)();
    app.listen(port, () => {
        console.log(`OctoFit API listening on port ${port}`);
    });
}
start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
