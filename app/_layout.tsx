import { Stack } from "expo-router";
import { View } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";
import tamaguiConfig from "../tamagui.config";
import { formatWorkoutDate } from "../src/utils/date";

const APP_BG = "#121214"; // Deep graphite dark background

export default function RootLayout() {
  return (
    // Wrapping the entire Stack in a dark View guarantees that even if a native
    // transition lags by 1 frame, the pixel behind it is physically dark.
    <TamaguiProvider config={tamaguiConfig} defaultTheme="dark">
      <Theme name="dark">
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
            <Stack.Screen name="index" options={{ title: "Lyft Track", headerShown: false }} />

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
        <Stack.Screen name="workout/new" options={{ title: "New Workout" }} />
        <Stack.Screen name="workout/edit" options={{ title: "Edit Workout" }} />
        <Stack.Screen name="exercise" options={{ title: "Exercises" }} />
        <Stack.Screen name="routine" options={{ title: "Workouts" }} />
          </Stack>
        </View>
      </Theme>
    </TamaguiProvider>
  );
}

