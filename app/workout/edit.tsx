// app/workout/edit.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useWorkoutByDate } from '../../src/hooks/useWorkoutByDate';
import { WorkoutPayload } from '../../src/hooks/useSaveWorkout';
import { formatWorkoutDate } from '../../src/utils/date';
import { db } from '../../src/db/database';
import { exercises } from '../../src/db/schema';

type RegisteredExercise = { id: number; name: string };

export default function EditWorkoutScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    
    // 1. Fetch the existing workout to pre-populate the form
    const { workoutData, isLoading: isFetching } = useWorkoutByDate(date);

    const [workoutName, setWorkoutName] = useState('');
    const [loggedSets, setLoggedSets] = useState<WorkoutPayload['loggedSets']>([]);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [availableExercises, setAvailableExercises] = useState<RegisteredExercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<RegisteredExercise | null>(null);
    const [reps, setReps] = useState(8);
    const [weight, setWeight] = useState('');

    // 2. Hydrate the local state once SQLite returns the data
    useEffect(() => {
        if (workoutData) {
            setWorkoutName(workoutData.name || '');
            
            // Map the database sets into our temporary payload structure
            const mappedSets = workoutData.sets.map(set => ({
                exerciseId: set.exerciseId,
                reps: set.reps,
                weight: set.weight
            }));
            setLoggedSets(mappedSets);
        }
    }, [workoutData]);

    useEffect(() => {
        async function fetchExercises() {
            const results = await db.select().from(exercises);
            setAvailableExercises(results);
        }
        fetchExercises();
    }, []);

    const handleAddSet = () => {
        if (!selectedExercise || weight === '') return;
        setLoggedSets((prev) => [
            ...prev,
            { exerciseId: selectedExercise.id, reps: reps, weight: parseFloat(weight) }
        ]);
        setSelectedExercise(null);
        setIsModalVisible(false);
        setWeight('');
    };

    const handleUpdate = async () => {
        const payload: WorkoutPayload = {
            date: date,
            name: workoutName || 'General Workout',
            loggedSets: loggedSets
        };
        
        console.log("Next step: Pass this to useUpdateWorkout()", payload);
        // await updateWorkout(payload);
        router.dismissTo('/'); 
    };

    if (isFetching) return <ActivityIndicator size="large" color="#4f46e5" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Edit Workout: {formatWorkoutDate(date)} </Text>
            
            <TextInput 
                style={styles.input}
                value={workoutName}
                onChangeText={setWorkoutName}
            />

            <View style={styles.buttonSpacing}>
                <Button title="Add Exercise" onPress={() => setIsModalVisible(true)} />
            </View>

            <FlatList 
                data={loggedSets}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.setRow}>
                        <Text style={styles.setText}>Set {index + 1} (Ex. ID: {item.exerciseId})</Text>
                        <Text style={styles.setText}>{item.reps} reps @ {item.weight} kg</Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                <Button title="Update Workout" color="#f59e0b" onPress={handleUpdate} />
            </View>

            {/* Use the exact same <Modal> block from new.tsx here */}
        </View>
    );
}

// Reuse the exact styles from new.tsx
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, fontSize: 16 },
    buttonSpacing: { marginTop: 20, marginBottom: 20 },
    setRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f3f4f6', marginTop: 10, borderRadius: 8 },
    setText: { fontSize: 16 },
    footer: { marginTop: 'auto', paddingBottom: 30 },
});