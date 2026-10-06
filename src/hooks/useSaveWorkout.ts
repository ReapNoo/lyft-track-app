// src/hooks/useSaveWorkout.ts
import { useState } from 'react';
import { db } from '../db/database';
import { workouts, sets } from '../db/schema';

// This defines the shape of the data the UI will hand to our save function
export type WorkoutPayload = {
    date: string;
    name: string;
    loggedSets: { exerciseId: number; reps: number; weight: number }[];
};

export function useSaveWorkout() {
    const [isSaving, setIsSaving] = useState(false);

    async function saveWorkout(payload: WorkoutPayload) {
        setIsSaving(true);
        try {
            // We use a transaction to guarantee data integrity
            await db.transaction(async (tx) => {
                
                // 1. Insert the parent workout and get its newly generated ID
                const [newWorkout] = await tx.insert(workouts).values({
                    date: payload.date,
                    name: payload.name,
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
            
            return true; // Tells the screen it is safe to route back home
        } catch (error) {
            console.error("Failed to save workout:", error);
            return false; // Tells the screen to show an error
        } finally {
            setIsSaving(false);
        }
    }

    return { saveWorkout, isSaving };
}