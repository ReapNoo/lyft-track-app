// app/workout/new.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSaveWorkout, WorkoutPayload } from '../../src/hooks/useSaveWorkout';
import { db } from '../../src/db/database';
import { exercises } from '../../src/db/schema';
import { formatWorkoutDate } from '../../src/utils/date';

type RegisteredExercise = { id: number; name: string };

export default function NewWorkoutScreen() {
    // Grabs the passed date parameter from [date].tsx
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { saveWorkout, isSaving } = useSaveWorkout();

    const [workoutName, setWorkoutName] = useState('');
    const [loggedSets, setLoggedSets] = useState<WorkoutPayload['loggedSets']>([]);
    
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [availableExercises, setAvailableExercises] = useState<RegisteredExercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<RegisteredExercise | null>(null);
    
    const [reps, setReps] = useState(8);
    const [weight, setWeight] = useState('');

    useEffect(() => {
        async function fetchExercises() {
            try {
                const results = await db.select().from(exercises);
                setAvailableExercises(results);
            } catch (error) {
                console.error("Failed to load exercises:", error);
            }
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

    const handleSave = async () => {
        const payload: WorkoutPayload = {
            date: date,
            name: workoutName || 'General Workout',
            loggedSets: loggedSets
        };
        const success = await saveWorkout(payload);
        // Throw user back to the home calendar on success
        if (success) router.dismissTo('/'); 
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>New Workout: {formatWorkoutDate(date)} </Text>
            
            <TextInput 
                style={styles.input}
                placeholder="Place your workout name"
                placeholderTextColor="#9CA3AF"
                value={workoutName}
                onChangeText={setWorkoutName}
            />

            <View style={styles.buttonSpacing}>
                <Button title="Add Exercise" onPress={() => setIsModalVisible(true)} />
            </View>

            <FlatList 
                data={loggedSets}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {

                    const exercise = availableExercises.find(ex => ex.id === item.exerciseId);
                    const exerciseName = exercise ? exercise.name : 'Unknown Exercise';

                    return (
                    <View style={styles.setRow}>
                        <Text style={styles.setText}>{exerciseName} </Text>
                        <Text style={styles.setText}>Set {index + 1}: {item.reps} reps @ {item.weight} kg</Text>
                    </View>
                    );
                }}
            />

            <View style={styles.footer}>
                {isSaving ? (
                    <ActivityIndicator size="large" color="#6366f1" />
                ) : (
                    <Button title="Save Workout" color="#10b981" onPress={handleSave} disabled={loggedSets.length === 0 || !workoutName.trim()} />
                )}
            </View>

            <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    {!selectedExercise ? (
                        <>
                            <Text style={styles.modalHeader}>Select an Exercise</Text>
                            <FlatList
                                data={availableExercises}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={styles.exerciseListItem} onPress={() => setSelectedExercise(item)}>
                                        <Text style={styles.exerciseListText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                            <Button title="Cancel" color="#ef4444" onPress={() => setIsModalVisible(false)} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.modalHeader}>{selectedExercise.name}</Text>
                            <Text style={styles.label}>Reps</Text>
                            <View style={styles.repControl}>
                                <Button title=" - " onPress={() => setReps(Math.max(1, reps - 1))} />
                                <Text style={styles.repText}>{reps}</Text>
                                <Button title=" + " onPress={() => setReps(reps + 1)} />
                            </View>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput 
                                style={styles.weightInput}
                                keyboardType="numeric"
                                placeholder="Insert weight used"
                                placeholderTextColor="#9CA3AF"
                                value={weight}
                                onChangeText={setWeight}
                            />
                            <Button title="Add Set" onPress={handleAddSet} disabled={weight === ''} />
                            <Button title="Back" color="#ef4444" onPress={() => setSelectedExercise(null)} />
                        </>
                    )}
                </View>
            </Modal>
        </View>
    );
}

// Reuse the exact styles from the previous file here
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#1C1C1E' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFFFFF' },
    input: { 
        borderWidth: 1, 
        borderColor: '#374151', 
        padding: 12, 
        borderRadius: 8, 
        fontSize: 16, 
        color: '#FFFFFF', 
        backgroundColor: '#2C2C2E' 
    },
    buttonSpacing: { marginTop: 20, marginBottom: 20 },
    setRow: { 
        padding: 15, 
        backgroundColor: '#2C2C2E', 
        marginTop: 10, 
        borderRadius: 8 
    },
    setText: { fontSize: 16, color: '#D1D5DB' },
    footer: { marginTop: 'auto', paddingBottom: 30 },
    
    // Modal Styles
    modalContainer: { flex: 1, padding: 30, backgroundColor: '#1C1C1E', paddingTop: 50 },
    modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#FFFFFF' },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginBottom: 20 },
    exerciseListItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#374151' },
    exerciseListText: { fontSize: 18, color: '#FFFFFF' },
    label: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, textAlign: 'center', color: '#FFFFFF' },
    repControl: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    repText: { fontSize: 24, marginHorizontal: 30, color: '#FFFFFF' },
    weightInput: { 
        borderWidth: 1, 
        borderColor: '#374151', 
        padding: 15, 
        borderRadius: 8, 
        fontSize: 20, 
        textAlign: 'center', 
        marginBottom: 40, 
        color: '#FFFFFF',
        backgroundColor: '#2C2C2E'
    },
    modalActionButtons: { gap: 15 }
});