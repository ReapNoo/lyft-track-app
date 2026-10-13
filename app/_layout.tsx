import { Stack } from 'expo-router';

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                // Header Background
                headerStyle: { backgroundColor: '#1C1C1E' },
                // Back Arrow Color
                headerTintColor: '#6366f1',
                // Title Text Styling
                headerTitleStyle: { color: '#FFFFFF', fontWeight: 'bold' },
                // Removes the bottom border line for a flat look
                headerShadowVisible: false,
                // Prevents the white flash during navigation animations
                contentStyle: { backgroundColor: '#1C1C1E' },
                animation: 'slide_from_right'
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Home' }} />
            <Stack.Screen name="workout" options={{ headerShown: false }} />
            <Stack.Screen name="exercise" options={{title: 'Exercises'}} />
        </Stack>
    )
}