import test from 'node:test';
import assert from 'node:assert/strict';
import { logActivity } from '../src/activityService';
import { Activity, User } from '../src/models';
import { connectToDatabase } from '../src/db';

test('logActivity stores a new activity and computes points', async () => {
  await connectToDatabase();
  const user = await User.create({
    username: 'test-user',
    email: 'test-user@example.com',
    passwordHash: 'hash',
    age: 16,
    fitnessLevel: 'beginner'
  });

  const activity = await logActivity({
    userId: user._id.toString(),
    type: 'running',
    durationMinutes: 20,
    caloriesBurned: 240,
    notes: 'Test run'
  });

  const saved = await Activity.findById(activity._id);
  assert.ok(saved);
  assert.equal(saved?.pointsEarned, 20);
  assert.equal(saved?.user.toString(), user._id.toString());

  await Activity.deleteMany({});
  await User.deleteMany({});
});
