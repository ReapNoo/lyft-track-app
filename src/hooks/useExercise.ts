// src/hooks/useExercises.ts
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { asc, eq } from 'drizzle-orm';
import { db } from '../db/database';
import { exercises } from '../db/schema';

export type Exercise = { id: number; name: string };

export function useExercises() {
    const [exerciseList, setExerciseList] = useState<Exercise[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchExercises = async () => {
        try {
            const data = await db
                .select()
                .from(exercises)
                .orderBy(asc(exercises.name)); // Orders A-Z natively in SQLite
            setExerciseList(data);
        } catch (error) {
            console.error("Failed to fetch exercises:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchExercises();
        }, [])
    );

    const addExercise = async (name: string) => {
        try {
            await db.insert(exercises).values({ name });
            await fetchExercises(); // Refresh the list instantly
            return true;
        } catch (error) {
            console.error("Failed to add exercise:", error);
            return false; // Will trigger if the user tries to save a duplicate name
        }
    };

    const editExercise = async (id: number, newName: string) => {
        try {
            await db.update(exercises)
                .set({ name: newName })
                .where(eq(exercises.id, id));
            await fetchExercises(); // Refresh the list instantly
            return true;
        } catch (error) {
            console.error("Failed to update exercise:", error);
            return false;
        }
    };

    return { exerciseList, isLoading, addExercise, editExercise };
}