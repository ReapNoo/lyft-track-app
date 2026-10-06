// src/hooks/useWorkoutDates.ts
import { useEffect, useState } from 'react';
import { db } from '../db/database';
import { workouts } from '../db/schema';

// Defines the exact dictionary structure the calendar requires
type MarkedDates = {
    [date: string]: { marked: boolean; dotColor?: string };
};

export function useWorkoutDates() {
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchDates() {
            try {
                // 1. Query SQLite: Select ONLY the date column from the workouts table
                const result = await db.select({ date: workouts.date }).from(workouts);

                // 2. Transform the array into the dictionary object React Native Calendar needs
                const formattedDates: MarkedDates = {};
                result.forEach((row) => {
                    formattedDates[row.date] = { marked: true, dotColor: '#4f46e5' }; 
                });

                // 3. Update state
                setMarkedDates(formattedDates);
            } catch (error) {
                console.error("Failed to fetch workout dates:", error);
            } finally {
                setIsLoading(false); // Tell the UI the fetch is complete
            }
        }

        fetchDates();
    }, []);

    return { markedDates, isLoading };
}