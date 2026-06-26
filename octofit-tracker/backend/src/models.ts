import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  age: number;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  team?: mongoose.Types.ObjectId | null;
  createdAt: Date;
}

export interface ITeam extends Document {
  name: string;
  school: string;
  members: mongoose.Types.ObjectId[];
  points: number;
  createdAt: Date;
}

export interface IActivity extends Document {
  user: mongoose.Types.ObjectId;
  type: 'running' | 'walking' | 'strength';
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  notes?: string;
  date: Date;
  pointsEarned: number;
  createdAt: Date;
}

export interface ILeaderboardEntry extends Document {
  user: mongoose.Types.ObjectId;
  totalPoints: number;
  week: string;
  updatedAt: Date;
}

export interface IWorkoutSuggestion extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationMinutes: number;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true },
  passwordHash: { type: String, required: true },
  age: { type: Number, required: true, min: 10, max: 100 },
  fitnessLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  team: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
  createdAt: { type: Date, default: Date.now }
});

const teamSchema = new Schema<ITeam>({
  name: { type: String, required: true, trim: true, unique: true },
  school: { type: String, required: true, trim: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  points: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const activitySchema = new Schema<IActivity>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['running', 'walking', 'strength'], required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  distanceKm: { type: Number, min: 0 },
  caloriesBurned: { type: Number, required: true, min: 0 },
  notes: { type: String, trim: true },
  date: { type: Date, default: Date.now },
  pointsEarned: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now }
});

const leaderboardSchema = new Schema<ILeaderboardEntry>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  totalPoints: { type: Number, default: 0 },
  week: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

const workoutSuggestionSchema = new Schema<IWorkoutSuggestion>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', userSchema);
export const Team = mongoose.model<ITeam>('Team', teamSchema);
export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
export const LeaderboardEntry = mongoose.model<ILeaderboardEntry>('LeaderboardEntry', leaderboardSchema);
export const WorkoutSuggestion = mongoose.model<IWorkoutSuggestion>('WorkoutSuggestion', workoutSuggestionSchema);
