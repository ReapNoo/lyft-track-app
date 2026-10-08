import { Stack } from 'expo-router';

export default function WorkoutLayout() {
    return (
        <Stack>
            <Stack.Screen name="[date]" />
            <Stack.Screen name="edit" options={{ title: 'Edit' }} />
            <Stack.Screen name="new" options={{ title: 'New' }} />
        </Stack>
    )
}