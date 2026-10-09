// app/workout/[date].tsx
import { View, Text, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutByDate } from '../../src/hooks/useWorkoutByDate';

export default function WorkoutDayScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { workoutData, isLoading } = useWorkoutByDate(date);

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
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
                    onPress={() => router.push(`/workout/new?date=${date}`)} 
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
                    color="#4f46e5"
                    onPress={() => router.push(`/workout/edit?date=${date}`)} 
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    emptyText: { fontSize: 18, marginBottom: 20, color: '#666' },
    setRow: { padding: 15, backgroundColor: '#f3f4f6', marginTop: 10, borderRadius: 8 },
    setText: { fontSize: 16 },
    footer: { marginTop: 'auto', paddingBottom: 30 }
});