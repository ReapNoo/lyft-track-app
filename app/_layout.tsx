// app/_layout.tsx
import { Stack } from "expo-router";
import { View } from "react-native";
import { formatWorkoutDate } from "../src/utils/date";

const APP_BG = "#1C1C1E"; // Replace with your exact dark background hex

export default function RootLayout() {
  return (
    // Wrapping the entire Stack in a dark View guarantees that even if a native
    // transition lags by 1 frame, the pixel behind it is physically dark.
    <View style={{ flex: 1, backgroundColor: APP_BG }}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: APP_BG },
          headerTintColor: "#ffffff",
          headerShadowVisible: false,
          // 1. Forces the inner card wrapper of EVERY screen to be dark
          contentStyle: { backgroundColor: APP_BG },
          // 2. Forces Android to use a clean horizontal slide instead of a fade transition
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />

        {/* Notice you don't need a workout/_layout.tsx! 
            You can configure folder screens directly here if needed, 
            or let them set their own titles via <Stack.Screen /> inside their own files. */}
        <Stack.Screen
          name="workout/[date]"
          options={({ route }) => {
            const date = (route.params as { date?: string } | undefined)?.date;

            return {
              title: date ? formatWorkoutDate(date) : "Workout",
            };
          }}
        />
        <Stack.Screen name="workout/new" options={{ title: "New" }} />
        <Stack.Screen name="workout/edit" options={{ title: "Edit" }} />
        <Stack.Screen name="exercise" options={{ title: "Exercises" }} />
      </Stack>
    </View>
  );
}
