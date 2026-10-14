// app/workout/[date].tsx
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutByDate } from '../../src/hooks/useWorkoutByDate';
import { debouncePress } from '../../src/utils/debounce';

export default function WorkoutDayScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { workoutData, isLoading } = useWorkoutByDate(date);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    // STATE 2: Empty Day -> Show "Start Workout" button
    if (!workoutData) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No workout logged.</Text>
                <Button 
                    title="Start Workout" 
                    color="#10b981"
                    // Pass the date through the URL so new.tsx knows what day it is
                    onPress={debouncePress(() => router.push(`/workout/new?date=${date}`))} 
                />
            </View>
        );
    }

    // STATE 3: Completed Day -> Show read-only summary
    return (
        <View style={styles.container}>
            <Text style={styles.header}>{workoutData.name || 'Workout'}</Text>
            
            <FlatList 
                data={workoutData.sets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.setRow}>
                        <Text style={styles.setText}>{item.exercise.name}</Text>
                        <Text style={styles.setText}>Set {index + 1}: {item.reps} reps @ {item.weight} kg</Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <Button 
                    title="Edit Workout" 
                    color="#6366f1"
                    onPress={debouncePress(() => router.push(`/workout/edit?date=${date}`))} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#1C1C1E' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1E' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFFFFF' },
    emptyText: { fontSize: 18, marginBottom: 20, color: '#9CA3AF' },
    setRow: { padding: 15, backgroundColor: '#2C2C2E', marginTop: 10, borderRadius: 8 },
    setText: { fontSize: 16, color: '#D1D5DB' },
    footer: { marginTop: 'auto', paddingBottom: 30 }
});