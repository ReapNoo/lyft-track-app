import { Stack, useGlobalSearchParams } from 'expo-router';
import { formatWorkoutDate } from '../../src/utils/date';

export default function WorkoutLayout() {
    const { date } = useGlobalSearchParams<{ date?: string }>();

    return (
        <Stack>
            <Stack.Screen name="[date]" options={{ title: date ? formatWorkoutDate(date) : 'Workout'}} />
            <Stack.Screen name="edit" options={{ title: 'Edit' }} />
            <Stack.Screen name="new" options={{ title: 'New' }} />
        </Stack>
    )
}