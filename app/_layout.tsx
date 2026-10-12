import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="workout" options={{ headerShown: false }} />
            <Stack.Screen name="exercise" options={{title: 'Exercises'}} />
        </Stack>
    )
}