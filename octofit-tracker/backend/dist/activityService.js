"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = logActivity;
exports.getActivitiesForUser = getActivitiesForUser;
exports.getActivitySummary = getActivitySummary;
const models_1 = require("./models");
const POINTS_BY_TYPE = {
    running: 10,
    walking: 6,
    strength: 8
};
async function logActivity(input) {
    const user = await models_1.User.findById(input.userId);
    if (!user) {
        throw new Error('User not found');
    }
    const pointsEarned = POINTS_BY_TYPE[input.type] * Math.max(1, Math.round(input.durationMinutes / 10));
    const activity = await models_1.Activity.create({
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
async function getActivitiesForUser(userId) {
    return models_1.Activity.find({ user: userId }).sort({ date: -1 }).lean();
}
async function getActivitySummary(userId) {
    const activities = await getActivitiesForUser(userId);
    const totalMinutes = activities.reduce((sum, activity) => sum + activity.durationMinutes, 0);
    const totalPoints = activities.reduce((sum, activity) => sum + activity.pointsEarned, 0);
    return {
        totalActivities: activities.length,
        totalMinutes,
        totalPoints
    };
}
