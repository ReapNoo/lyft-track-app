// src/hooks/useWorkoutByDate.ts
import { useState, useEffect } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '../db/database';
import { workouts, sets, exercises } from '../db/schema';
import { FullWorkoutDetails } from '../types/workout'; // This is the composite type we discussed earlier

export function useWorkoutByDate(date: string) {
    // Starts as null because the user might tap a day with no logged workout
    const [workoutData, setWorkoutData] = useState<FullWorkoutDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchWorkout() {
            setIsLoading(true);
            try {
                // Step 1: Find the parent workout for this specific date
                const [workout] = await db
                    .select()
                    .from(workouts)
                    .where(eq(workouts.date, date));

                // If no workout exists for this date, stop here and return null
                if (!workout) {
                    setWorkoutData(null);
                    return; 
                }

                // Step 2: If the workout exists, fetch its sets AND the exercise names
                const workoutSets = await db
                    .select({
                        id: sets.id,
                        workoutId: sets.workoutId,
                        exerciseId: sets.exerciseId,
                        reps: sets.reps,
                        weight: sets.weight,
                        // This nests the exercise object exactly how our FullWorkoutDetails type expects
                        exercise: {
                            id: exercises.id,
                            name: exercises.name,
                        },
                    })
                    .from(sets)
                    .innerJoin(exercises, eq(sets.exerciseId, exercises.id)) // Matches the set to the correct exercise
                    .where(eq(sets.workoutId, workout.id));

                // Step 3: Package it all together
                setWorkoutData({
                    ...workout,
                    sets: workoutSets,
                });
            } catch (error) {
                console.error("Failed to fetch workout by date:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchWorkout();
    }, [date]); // Re-runs automatically if the date parameter changes

    return { workoutData, isLoading };
}