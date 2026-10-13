import { Stack } from 'expo-router';
import { formatWorkoutDate } from '../../src/utils/date';

export default function WorkoutLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: { backgroundColor: '#1C1C1E' },
                headerTintColor: '#6366f1',
                headerTitleStyle: {
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                },
                headerShadowVisible: false,
                contentStyle: {
                    backgroundColor: '#1C1C1E',
                },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen
                name="[date]"
                options={({ route }) => {
                    const date = (
                        route.params as { date?: string } | undefined
                    )?.date;

                    return {
                        title: date
                            ? formatWorkoutDate(date)
                            : 'Workout',
                    };
                }}
            />

            <Stack.Screen
                name="edit"
                options={{ title: 'Edit' }}
            />

            <Stack.Screen
                name="new"
                options={{ title: 'New' }}
            />
        </Stack>
    );
}