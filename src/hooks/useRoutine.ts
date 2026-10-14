// src/hooks/useRoutines.ts
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { asc, eq } from 'drizzle-orm';
import { db } from '../db/database';
import { routines, Routine } from '../db/schema';

export function useRoutines() {
    const [routineList, setRoutineList] = useState<Routine[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRoutines = async () => {
        try {
            const data = await db
                .select()
                .from(routines)
                .orderBy(asc(routines.name));
            setRoutineList(data);
        } catch (error) {
            console.error("Failed to fetch routines:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            const timer = setTimeout(() => {
                fetchRoutines();
            }, 300);

            return () => clearTimeout(timer);
        }, [])
    );

    const addRoutine = async (name: string) => {
        try {
            await db.insert(routines).values({ name });
            await fetchRoutines();
            return true;
        } catch (error) {
            console.error("Failed to add routine:", error);
            return false;
        }
    };

    const editRoutine = async (id: number, newName: string) => {
        try {
            await db.update(routines)
                .set({ name: newName })
                .where(eq(routines.id, id));
            await fetchRoutines();
            return true;
        } catch (error) {
            console.error("Failed to update routine:", error);
            return false;
        }
    };

    return { routineList, isLoading, addRoutine, editRoutine };
}