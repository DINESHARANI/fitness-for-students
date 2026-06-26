import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Activity, LeaderboardEntry, Team, User, WorkoutSuggestion } from '../models';
import { connectToDatabase } from '../db';

dotenv.config();

/* Seed the octofit_db database with test data */
export async function seedDatabase() {
  await connectToDatabase();

  await Promise.all([
    User.deleteMany({}),
    Team.deleteMany({}),
    Activity.deleteMany({}),
    LeaderboardEntry.deleteMany({}),
    WorkoutSuggestion.deleteMany({})
  ]);

  const [maria, jaden, leo] = await User.create([
    {
      username: 'maria',
      email: 'maria@example.com',
      passwordHash: 'hash-1',
      age: 16,
      fitnessLevel: 'intermediate'
    },
    {
      username: 'jaden',
      email: 'jaden@example.com',
      passwordHash: 'hash-2',
      age: 15,
      fitnessLevel: 'beginner'
    },
    {
      username: 'leo',
      email: 'leo@example.com',
      passwordHash: 'hash-3',
      age: 17,
      fitnessLevel: 'advanced'
    }
  ]);

  const team = await Team.create({
    name: 'Storm Squad',
    school: 'Mergington High',
    members: [maria._id, jaden._id, leo._id],
    points: 120
  });

  await User.updateMany({}, { team: team._id });

  const activities = await Activity.create([
    {
      user: maria._id,
      type: 'running',
      durationMinutes: 25,
      distanceKm: 3.5,
      caloriesBurned: 280,
      notes: 'Morning jog',
      pointsEarned: 30
    },
    {
      user: jaden._id,
      type: 'walking',
      durationMinutes: 40,
      distanceKm: 3.0,
      caloriesBurned: 180,
      notes: 'Walk with friends',
      pointsEarned: 24
    },
    {
      user: leo._id,
      type: 'strength',
      durationMinutes: 35,
      caloriesBurned: 320,
      notes: 'Upper body workout',
      pointsEarned: 32
    }
  ]);

  await LeaderboardEntry.create([
    {
      user: maria._id,
      totalPoints: activities[0].pointsEarned,
      week: '2026-W26'
    },
    {
      user: jaden._id,
      totalPoints: activities[1].pointsEarned,
      week: '2026-W26'
    },
    {
      user: leo._id,
      totalPoints: activities[2].pointsEarned,
      week: '2026-W26'
    }
  ]);

  await WorkoutSuggestion.create([
    {
      user: maria._id,
      title: 'Tempo Run',
      description: 'Alternate brisk and easy laps for 20 minutes.',
      difficulty: 'intermediate',
      durationMinutes: 20
    },
    {
      user: jaden._id,
      title: 'Beginner Mobility',
      description: 'Short mobility flow to improve posture.',
      difficulty: 'beginner',
      durationMinutes: 15
    },
    {
      user: leo._id,
      title: 'Strength Circuit',
      description: 'A focused bodyweight workout for upper body strength.',
      difficulty: 'advanced',
      durationMinutes: 30
    }
  ]);

  console.log('Seed the octofit_db database with test data');
  console.log(JSON.stringify({ users: 3, team: team.name, activities: activities.length }, null, 2));
}

if (require.main === module) {
  seedDatabase()
    .then(() => mongoose.disconnect())
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
