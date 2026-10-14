// src/types/workout.ts
import { Workout, WorkoutSet, Exercise, Routine } from '../db/schema';

export type SetWithExercise = WorkoutSet & {
    exercise: Exercise;
};

export type FullWorkoutDetails = Workout & {
    routine: Routine;
    sets: SetWithExercise[];
};