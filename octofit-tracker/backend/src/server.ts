import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Activity, LeaderboardEntry, Team, User, WorkoutSuggestion } from './models';
import { getActivitiesForUser, getActivitySummary, logActivity } from './activityService';
import { connectToDatabase } from './db';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT ? Number(process.env.PORT) : 8000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/users', async (_req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

app.get('/api/teams', async (_req, res) => {
  const teams = await Team.find().lean();
  res.json(teams);
});

app.get('/api/activities', async (_req, res) => {
  const activities = await Activity.find().sort({ date: -1 }).lean();
  res.json(activities);
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await logActivity(req.body);
    res.status(201).json(activity);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to log activity';
    res.status(400).json({ error: message });
  }
});

app.get('/api/activities/:userId', async (req, res) => {
  const activities = await getActivitiesForUser(req.params.userId);
  res.json(activities);
});

app.get('/api/activities/:userId/summary', async (req, res) => {
  const summary = await getActivitySummary(req.params.userId);
  res.json(summary);
});

app.get('/api/leaderboard', async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find().sort({ totalPoints: -1 }).lean();
  res.json(leaderboard);
});

app.get('/api/workouts', async (_req, res) => {
  const workouts = await WorkoutSuggestion.find().lean();
  res.json(workouts);
});

async function start() {
  await connectToDatabase();
  app.listen(port, () => {
    console.log(`OctoFit API listening on port ${port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
