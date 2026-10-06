// src/types/workout.ts
import { Workout, WorkoutSet, Exercise } from '../db/schema';

// Combines a logged set with the actual exercise details
export type SetWithExercise = WorkoutSet & {
    exercise: Exercise;
};

// The complete data shape required for the workout detail screen
export type FullWorkoutDetails = Workout & {
    sets: SetWithExercise[];
};