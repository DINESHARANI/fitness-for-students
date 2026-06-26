import { Activity, Activity as ActivityModel, User } from './models';

export type ActivityType = 'running' | 'walking' | 'strength';

export interface CreateActivityInput {
  userId: string;
  type: ActivityType;
  durationMinutes: number;
  distanceKm?: number;
  caloriesBurned: number;
  notes?: string;
  date?: Date;
}

const POINTS_BY_TYPE: Record<ActivityType, number> = {
  running: 10,
  walking: 6,
  strength: 8
};

export async function logActivity(input: CreateActivityInput) {
  const user = await User.findById(input.userId);
  if (!user) {
    throw new Error('User not found');
  }

  const pointsEarned = POINTS_BY_TYPE[input.type] * Math.max(1, Math.round(input.durationMinutes / 10));

  const activity = await ActivityModel.create({
    user: user._id,
    type: input.type,
    durationMinutes: input.durationMinutes,
    distanceKm: input.distanceKm,
    caloriesBurned: input.caloriesBurned,
    notes: input.notes,
    date: input.date ?? new Date(),
    pointsEarned
  });

  return activity;
}

export async function getActivitiesForUser(userId: string) {
  return ActivityModel.find({ user: userId }).sort({ date: -1 }).lean();
}

export async function getActivitySummary(userId: string) {
  const activities = await getActivitiesForUser(userId);
  const totalMinutes = activities.reduce((sum, activity) => sum + activity.durationMinutes, 0);
  const totalPoints = activities.reduce((sum, activity) => sum + activity.pointsEarned, 0);

  return {
    totalActivities: activities.length,
    totalMinutes,
    totalPoints
  };
}
