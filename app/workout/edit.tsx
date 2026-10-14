// app/workout/edit.tsx
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    FlatList,
    Modal,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { asc } from 'drizzle-orm';
import { useWorkoutByDate } from '../../src/hooks/useWorkoutByDate';
import { WorkoutPayload } from '../../src/hooks/useSaveWorkout';
import { useUpdateWorkout } from '../../src/hooks/useUpdateWorkout';
import { formatWorkoutDate } from '../../src/utils/date';
import { db } from '../../src/db/database';
import { exercises, routines, Routine, Exercise } from '../../src/db/schema';

export default function EditWorkoutScreen() {
    const { date } = useLocalSearchParams<{ date: string }>();
    const router = useRouter();

    const { workoutData, isLoading: isFetching } = useWorkoutByDate(date);
    const { updateWorkout, isUpdating } = useUpdateWorkout();

    // Routine Selection State
    const [availableRoutines, setAvailableRoutines] = useState<Routine[]>([]);
    const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
    const [isRoutineModalVisible, setIsRoutineModalVisible] = useState(false);

    // Exercise & Sets State
    const [loggedSets, setLoggedSets] = useState<WorkoutPayload['loggedSets']>([]);
    const [isExerciseModalVisible, setIsExerciseModalVisible] = useState(false);
    const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
    const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
    
    const [reps, setReps] = useState(8);
    const [weight, setWeight] = useState('');

    // Hydrate local state with the existing routine and sets
    useEffect(() => {
        if (workoutData) {
            setSelectedRoutine(workoutData.routine);

            const mappedSets = workoutData.sets.map((set) => ({
                exerciseId: set.exerciseId,
                reps: set.reps,
                weight: set.weight,
            }));
            setLoggedSets(mappedSets);
        }
    }, [workoutData]);

    // Fetch registered routines and exercises alphabetically
    useEffect(() => {
        async function fetchDictionaries() {
            try {
                const [loadedRoutines, loadedExercises] = await Promise.all([
                    db.select().from(routines).orderBy(asc(routines.name)),
                    db.select().from(exercises).orderBy(asc(exercises.name)),
                ]);
                setAvailableRoutines(loadedRoutines);
                setAvailableExercises(loadedExercises);
            } catch (error) {
                console.error("Failed to load dictionaries:", error);
            }
        }
        fetchDictionaries();
    }, []);

    const handleAddSet = () => {
        if (!selectedExercise || weight === '') return;
        setLoggedSets((prev) => [
            ...prev,
            {
                exerciseId: selectedExercise.id,
                reps: reps,
                weight: parseFloat(weight),
            },
        ]);
        setSelectedExercise(null);
        setIsExerciseModalVisible(false);
        setWeight('');
    };

    const handleUpdate = async () => {
        if (!workoutData || !selectedRoutine) return;

        const payload: WorkoutPayload = {
            date: date,
            routineId: selectedRoutine.id,
            loggedSets: loggedSets,
        };

        const success = await updateWorkout(workoutData.id, payload);

        if (success) {
            if (router.canDismiss()) {
                router.dismissAll();
            } else {
                router.replace('/');
            }
        } else {
            alert('Failed to update workout');
        }
    };

    const hasChanges = (() => {
        if (!workoutData || !selectedRoutine) return false;

        // 1. Did the selected routine change?
        const routineChanged = selectedRoutine.id !== workoutData.routine.id;

        // 2. Did the sets change? (Compare mapped database sets to current UI sets)
        const originalSets = workoutData.sets.map((set) => ({
            exerciseId: set.exerciseId,
            reps: set.reps,
            weight: set.weight,
        }));
        const setsChanged = JSON.stringify(loggedSets) !== JSON.stringify(originalSets);

        return routineChanged || setsChanged;
    })();

    if (isFetching) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                {date ? formatWorkoutDate(date) : ''}
            </Text>

            {/* Routine Picker Button (Replaces TextInput) */}
            <TouchableOpacity 
                style={styles.selectorButton} 
                onPress={() => setIsRoutineModalVisible(true)}
            >
                <Text style={selectedRoutine ? styles.selectorTextSelected : styles.selectorTextPlaceholder}>
                    {selectedRoutine ? selectedRoutine.name : 'Select a Workout'}
                </Text>
                <Text style={styles.selectorChevron}>▼</Text>
            </TouchableOpacity>

            <View style={styles.buttonSpacing}>
                <Button title="Add Exercise" color="#6366f1" onPress={() => setIsExerciseModalVisible(true)} />
            </View>

            <FlatList
                data={loggedSets}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => {
                    const exercise = availableExercises.find(ex => ex.id === item.exerciseId);
                    const exerciseName = exercise ? exercise.name : 'Unknown Exercise';

                    return (
                        <View style={styles.setRow}>
                            <Text style={styles.setText}>{exerciseName}</Text>
                            <Text style={styles.setText}>
                                Set {index + 1}: {item.reps} reps @ {item.weight} kg
                            </Text>
                        </View>
                    );
                }}
            />

            <View style={styles.footer}>
                {isUpdating ? (
                    <ActivityIndicator size="large" color="#6366f1" />
                ) : (
                    <Button 
                        title="Update Workout" 
                        color="#10b981" 
                        onPress={handleUpdate} 
                        disabled={loggedSets.length === 0 || !selectedRoutine || !hasChanges}
                    />
                )}
            </View>

            {/* MODAL 1: Select Routine */}
            <Modal visible={isRoutineModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>Select a Routine</Text>
                    {availableRoutines.length === 0 ? (
                        <Text style={styles.emptyText}>No routines registered yet.</Text>
                    ) : (
                        <FlatList
                            data={availableRoutines}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.listItem} 
                                    onPress={() => {
                                        setSelectedRoutine(item);
                                        setIsRoutineModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.listText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    <Button title="Cancel" color="#ef4444" onPress={() => setIsRoutineModalVisible(false)} />
                </View>
            </Modal>

            {/* MODAL 2: Select Exercise & Log Set */}
            <Modal visible={isExerciseModalVisible} animationType="slide" presentationStyle="pageSheet">
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
                                            style={styles.listItem} 
                                            onPress={() => setSelectedExercise(item)}
                                        >
                                            <Text style={styles.listText}>{item.name}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                            )}
                            <Button title="Cancel" color="#ef4444" onPress={() => setIsExerciseModalVisible(false)} />
                        </>
                    ) : (
                        <>
                            <Text style={styles.modalHeader}>{selectedExercise.name}</Text>
                            
                            <Text style={styles.label}>Reps</Text>
                            <View style={styles.repControl}>
                                <Button title=" - " color="#6366f1" onPress={() => setReps(Math.max(1, reps - 1))} />
                                <Text style={styles.repText}>{reps}</Text>
                                <Button title=" + " color="#6366f1" onPress={() => setReps(reps + 1)} />
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

                            <View style={styles.modalActionButtons}>
                                <Button title="Add Set" color="#6366f1" onPress={handleAddSet} disabled={weight === ''} />
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
    container: { flex: 1, padding: 20, backgroundColor: '#1C1C1E' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1E' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFFFFF' },
    selectorButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#374151',
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#2C2C2E',
    },
    selectorTextSelected: { fontSize: 16, color: '#FFFFFF', fontWeight: '500' },
    selectorTextPlaceholder: { fontSize: 16, color: '#9CA3AF' },
    selectorChevron: { fontSize: 14, color: '#6366f1' },
    buttonSpacing: { marginTop: 20, marginBottom: 20 },
    setRow: { padding: 15, backgroundColor: '#2C2C2E', marginTop: 10, borderRadius: 8 },
    setText: { fontSize: 16, color: '#D1D5DB' },
    footer: { marginTop: 'auto', paddingBottom: 30 },
    modalContainer: { flex: 1, padding: 30, backgroundColor: '#1C1C1E', paddingTop: 50 },
    modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#FFFFFF' },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginBottom: 20, fontSize: 16 },
    listItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#374151' },
    listText: { fontSize: 18, color: '#FFFFFF' },
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