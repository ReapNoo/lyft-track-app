// src/hooks/useWorkoutByDate.ts
import { useState, useEffect } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '../db/database';
import { workouts, sets, exercises, routines } from '../db/schema';
import { FullWorkoutDetails } from '../types/workout';

export function useWorkoutByDate(date: string) {
    const [workoutData, setWorkoutData] = useState<FullWorkoutDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchWorkout() {
            if (!date) return;
            setIsLoading(true);
            try {
                // Step 1: Find the workout for this date and join its routine details
                const workoutResult = await db
                    .select()
                    .from(workouts)
                    .innerJoin(routines, eq(workouts.routineId, routines.id))
                    .where(eq(workouts.date, date));

                if (workoutResult.length === 0) {
                    setWorkoutData(null);
                    return;
                }

                const { workouts: foundWorkout, routines: foundRoutine } = workoutResult[0];

                // Step 2: Fetch all sets for this workout and join their exercise details
                const setsResult = await db
                    .select()
                    .from(sets)
                    .innerJoin(exercises, eq(sets.exerciseId, exercises.id))
                    .where(eq(sets.workoutId, foundWorkout.id));

                const formattedSets = setsResult.map((row) => ({
                    ...row.sets,
                    exercise: row.exercises,
                }));

                setWorkoutData({
                    ...foundWorkout,
                    routine: foundRoutine,
                    sets: formattedSets,
                });
            } catch (error) {
                console.error("Failed to fetch workout by date:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchWorkout();
    }, [date]);

    return { workoutData, isLoading };
}