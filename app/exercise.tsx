// app/exercises.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useExercises, Exercise } from '../src/hooks/useExercise';

export default function ExercisesScreen() {
    const { exerciseList, isLoading, addExercise, editExercise } = useExercises();

    // Modal State
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);

    const openAddModal = () => {
        setEditingExercise(null);
        setInputText('');
        setIsModalVisible(true);
    };

    const openEditModal = (exercise: Exercise) => {
        setEditingExercise(exercise);
        setInputText(exercise.name);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        const cleanName = inputText.trim();
        if (!cleanName) return;

        let success = false;
        if (editingExercise) {
            success = await editExercise(editingExercise.id, cleanName);
        } else {
            success = await addExercise(cleanName);
        }

        if (success) {
            setIsModalVisible(false);
            setInputText('');
            setEditingExercise(null);
        } else {
            alert("Failed to save. This exercise name might already exist.");
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Exercise Dictionary</Text>

            <Button title="Add New Exercise" color="#10b981" onPress={openAddModal} />

            <FlatList
                data={exerciseList}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.exerciseRow} onPress={() => openEditModal(item)}>
                        <Text style={styles.exerciseText}>{item.name}</Text>
                        <Text style={styles.editText}>Edit ✎</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No exercises found. Add one to get started!</Text>}
            />

            {/* Reusable Create/Update Modal */}
            <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>
                        {editingExercise ? 'Edit Exercise' : 'New Exercise'}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Incline Dumbbell Press"
                        placeholderTextColor="#9CA3AF"
                        value={inputText}
                        onChangeText={setInputText}
                        autoCapitalize="words" // Automatically capitalizes each word for cleaner data
                    />

                    <View style={styles.buttonSpacing}>
                        <Button title="Save" color="#4f46e5" onPress={handleSave} disabled={!inputText.trim()} />
                        <View style={{ height: 15 }} />
                        <Button title="Cancel" color="#ef4444" onPress={() => setIsModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#1C1C1E' },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1C1C1E' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#FFFFFF' },
    listContainer: { marginTop: 20, paddingBottom: 40 },
    exerciseRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        padding: 15, 
        backgroundColor: '#2C2C2E', 
        marginBottom: 10, 
        borderRadius: 8 
    },
    exerciseText: { fontSize: 18, fontWeight: '500', color: '#FFFFFF' },
    editText: { fontSize: 16, color: '#6366f1' }, // Matches the purple accent
    emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF', fontSize: 16 },
    
    // Modal Styles
    modalContainer: { flex: 1, padding: 30, backgroundColor: '#1C1C1E', paddingTop: 50 },
    modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#FFFFFF' },
    input: { 
        borderWidth: 1, 
        borderColor: '#374151', 
        padding: 15, 
        borderRadius: 8, 
        fontSize: 18, 
        marginBottom: 30, 
        color: '#FFFFFF',
        backgroundColor: '#2C2C2E'
    },
    buttonSpacing: { marginTop: 10 }
});