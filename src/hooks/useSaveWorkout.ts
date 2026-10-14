// src/hooks/useSaveWorkout.ts
import { useState } from 'react';
import { db } from '../db/database';
import { workouts, sets } from '../db/schema';

export type WorkoutPayload = {
    date: string;
    routineId: number;
    loggedSets: { exerciseId: number; reps: number; weight: number }[];
};

export function useSaveWorkout() {
    const [isSaving, setIsSaving] = useState(false);

    async function saveWorkout(payload: WorkoutPayload) {
        setIsSaving(true);
        try {
            await db.transaction(async (tx) => {
                // 1. Insert the parent workout with the selected routineId
                const [newWorkout] = await tx.insert(workouts).values({
                    date: payload.date,
                    routineId: payload.routineId,
                }).returning({ insertedId: workouts.id });

                // 2. Attach that new workout ID to every set, then insert them
                if (payload.loggedSets.length > 0) {
                    const setsToInsert = payload.loggedSets.map((set) => ({
                        workoutId: newWorkout.insertedId,
                        exerciseId: set.exerciseId,
                        reps: set.reps,
                        weight: set.weight,
                    }));

                    await tx.insert(sets).values(setsToInsert);
                }
            });

            return true;
        } catch (error) {
            console.error("Failed to save workout:", error);
            return false;
        } finally {
            setIsSaving(false);
        }
    }

    return { saveWorkout, isSaving };
}