// src/hooks/useUpdateWorkout.ts
import { useState } from 'react';
import { eq } from 'drizzle-orm';
import { db } from '../db/database';
import { workouts, sets } from '../db/schema';
import { WorkoutPayload } from './useSaveWorkout'; // Reuse the payload type we already built

export function useUpdateWorkout() {
    const [isUpdating, setIsUpdating] = useState(false);

    // We need the specific workoutId to know exactly which routine to overwrite
    async function updateWorkout(workoutId: number, payload: WorkoutPayload) {
        setIsUpdating(true);
        try {
            // We use a transaction so if any step fails, the old data is perfectly restored
            await db.transaction(async (tx) => {
                
                // 1. Update the parent workout (e.g., if they changed the name from "Push" to "Heavy Push")
                await tx.update(workouts)
                    .set({ name: payload.name })
                    .where(eq(workouts.id, workoutId));

                // 2. Wipe the slate clean: Delete all existing sets attached to this workout
                await tx.delete(sets)
                    .where(eq(sets.workoutId, workoutId));

                // 3. Insert the fresh payload array from the UI as brand new sets
                if (payload.loggedSets.length > 0) {
                    const setsToInsert = payload.loggedSets.map((set) => ({
                        workoutId: workoutId, // Reusing the existing parent ID
                        exerciseId: set.exerciseId,
                        reps: set.reps,
                        weight: set.weight,
                    }));
                    
                    await tx.insert(sets).values(setsToInsert);
                }
            });
            
            return true; 
        } catch (error) {
            console.error("Failed to update workout:", error);
            return false; 
        } finally {
            setIsUpdating(false);
        }
    }

    return { updateWorkout, isUpdating };
}