// src/hooks/useWorkoutDates.ts
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { db } from "../db/database";
import { workouts } from "../db/schema";

// Defines the exact dictionary structure the calendar requires
type MarkedDates = {
  [date: string]: { marked: boolean; dotColor?: string, selectedColor?: string };
};

export function useWorkoutDates() {
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;

      // 600ms deferral to allow native screen transition animation to complete
      const timer = setTimeout(async () => {
        try {
          // 1. Query SQLite: Select ONLY the date column from the workouts table
          const result = await db
            .select({ date: workouts.date })
            .from(workouts);

          if (!isMounted) return;

          // 2. Transform the array into the dictionary object React Native Calendar needs
          const formattedDates: MarkedDates = {};
          result.forEach((row) => {
            formattedDates[row.date] = { marked: true, dotColor: '#06b6d4', selectedColor: '#06b6d4' };
          });

          // 3. Prevent heavy calendar re-render if database records haven't changed
          setMarkedDates((prev) => {
            if (JSON.stringify(prev) === JSON.stringify(formattedDates)) {
              return prev;
            }
            return formattedDates;
          });
        } catch (error) {
          console.error("Failed to fetch workout dates:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }, 600);

      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }, []),
  );

  return { markedDates, isLoading };
}
