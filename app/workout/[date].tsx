// app/workout/[date].tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, FlatList, Modal, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSaveWorkout, WorkoutPayload } from '../../src/hooks/useSaveWorkout';
import { db } from '../../src/db/database';
import { exercises } from '../../src/db/schema';

// Defines the shape of the exercises we pull from SQLite
type RegisteredExercise = { id: number; name: string };

export default function WorkoutScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();
    const { saveWorkout, isSaving } = useSaveWorkout();

    // UI & Payload State
    const [workoutName, setWorkoutName] = useState('');
    const [loggedSets, setLoggedSets] = useState<WorkoutPayload['loggedSets']>([]);
    
    // Modal & Database State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [availableExercises, setAvailableExercises] = useState<RegisteredExercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<RegisteredExercise | null>(null);
    
    // Active Set State
    const [reps, setReps] = useState(8);
    const [weight, setWeight] = useState('');

    // Fetch the user's custom exercises from SQLite when the screen loads
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

    // Handles pushing the set to the temporary payload array
    const handleAddSet = () => {
        if (!selectedExercise || weight === '') return;
        
        setLoggedSets((prev) => [
            ...prev,
            { exerciseId: selectedExercise.id, reps: reps, weight: parseFloat(weight) }
        ]);
        
        // Reset modal state for the next set
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
        if (success) router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Date: {date}</Text>
            
            <TextInput 
                style={styles.input}
                placeholder="Workout Name (e.g., Push day)"
                value={workoutName}
                onChangeText={setWorkoutName}
            />

            <View style={styles.buttonSpacing}>
                <Button title="Add Exercise" onPress={() => setIsModalVisible(true)} />
            </View>

            <Text style={styles.subHeader}>Logged Sets: {loggedSets.length}</Text>
            <FlatList 
                data={loggedSets}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                    <View style={styles.setRow}>
                        <Text style={styles.setText}>Set {index + 1} (Exercise ID: {item.exerciseId})</Text>
                        <Text style={styles.setText}>{item.reps} reps @ {item.weight} kg</Text>
                    </View>
                )}
            />

            <View style={styles.footer}>
                {isSaving ? (
                    <ActivityIndicator size="large" color="#4f46e5" />
                ) : (
                    <Button 
                        title="Save Workout" 
                        color="#10b981" 
                        onPress={handleSave} 
                        disabled={loggedSets.length === 0} 
                    />
                )}
            </View>

            {/* The Slide-Up Modal */}
            <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    {!selectedExercise ? (
                        <>
                            <Text style={styles.modalHeader}>Select an Exercise</Text>
                            {availableExercises.length === 0 ? (
                                <Text style={styles.emptyText}>No exercises registered yet.</Text>
                            ) : (
                                <FlatList
                                    data={availableExercises}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity 
                                            style={styles.exerciseListItem} 
                                            onPress={() => setSelectedExercise(item)}
                                        >
                                            <Text style={styles.exerciseListText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                            <Button title="Cancel" color="#ef4444" onPress={() => setIsModalVisible(false)} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.modalHeader}>{selectedExercise.name}</Text>
                            
                            {/* Reps Increment/Decrement */}
                            <Text style={styles.label}>Reps</Text>
                            <View style={styles.repControl}>
                                <Button title=" - " onPress={() => setReps(Math.max(1, reps - 1))} />
                                <Text style={styles.repText}>{reps}</Text>
                                <Button title=" + " onPress={() => setReps(reps + 1)} />
                            </View>

                            {/* Weight Text Input */}
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput 
                                style={styles.weightInput}
                                keyboardType="numeric"
                                placeholder="e.g., 60.5"
                                value={weight}
                                onChangeText={setWeight}
                            />

                            <View style={styles.modalActionButtons}>
                                <Button title="Add Set" onPress={handleAddSet} disabled={weight === ''} />
                                <Button title="Back" color="#ef4444" onPress={() => setSelectedExercise(null)} />
                            </View>
                        </>
                    )}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, fontSize: 16 },
    buttonSpacing: { marginTop: 20 },
    setRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f3f4f6', marginTop: 10, borderRadius: 8 },
    setText: { fontSize: 16 },
    footer: { marginTop: 'auto', paddingBottom: 30 },
    
    // Modal Styles
    modalContainer: { flex: 1, padding: 30, backgroundColor: '#fff', paddingTop: 50 },
    modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    emptyText: { textAlign: 'center', color: '#666', marginBottom: 20 },
    exerciseListItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    exerciseListText: { fontSize: 18 },
    label: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10, textAlign: 'center' },
    repControl: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    repText: { fontSize: 24, marginHorizontal: 30 },
    weightInput: { borderWidth: 1, borderColor: '#ccc', padding: 15, borderRadius: 8, fontSize: 20, textAlign: 'center', marginBottom: 40 },
    modalActionButtons: { gap: 15 }
});