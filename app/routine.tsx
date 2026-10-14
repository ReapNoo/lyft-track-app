// app/routines.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useRoutines } from '../src/hooks/useRoutine';
import { Routine } from '../src/db/schema';

export default function RoutinesScreen() {
    const { routineList, isLoading, addRoutine, editRoutine } = useRoutines();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputText, setInputText] = useState('');
    const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

    const openAddModal = () => {
        setEditingRoutine(null);
        setInputText('');
        setIsModalVisible(true);
    };

    const openEditModal = (routine: Routine) => {
        setEditingRoutine(routine);
        setInputText(routine.name);
        setIsModalVisible(true);
    };

    const handleSave = async () => {
        const cleanName = inputText.trim();
        if (!cleanName) return;

        let success = false;
        if (editingRoutine) {
            success = await editRoutine(editingRoutine.id, cleanName);
        } else {
            success = await addRoutine(cleanName);
        }

        if (success) {
            setIsModalVisible(false);
            setInputText('');
            setEditingRoutine(null);
        } else {
            alert("Failed to save. This routine name might already exist.");
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
            <Text style={styles.header}>Workouts Dictionary</Text>

            <Button title="Add New Routine" color="#10b981" onPress={openAddModal} />

            <FlatList
                data={routineList}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.routineRow} onPress={() => openEditModal(item)}>
                        <Text style={styles.routineText}>{item.name}</Text>
                        <Text style={styles.editText}>Edit ✎</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No routines found. Add one to get started!</Text>}
            />

            <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalHeader}>
                        {editingRoutine ? 'Edit Routine' : 'New Routine'}
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Push Day"
                        placeholderTextColor="#9CA3AF"
                        value={inputText}
                        onChangeText={setInputText}
                        autoCapitalize="words"
                    />

                    <View style={styles.buttonSpacing}>
                        <Button title="Save" color="#6366f1" onPress={handleSave} disabled={!inputText.trim()} />
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
    routineRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#2C2C2E', marginBottom: 10, borderRadius: 8 },
    routineText: { fontSize: 18, fontWeight: '500', color: '#FFFFFF' },
    editText: { fontSize: 16, color: '#6366f1' },
    emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF', fontSize: 16 },
    modalContainer: { flex: 1, padding: 30, backgroundColor: '#1C1C1E', paddingTop: 50 },
    modalHeader: { fontSize: 24, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#FFFFFF' },
    input: { borderWidth: 1, borderColor: '#374151', padding: 15, borderRadius: 8, fontSize: 18, marginBottom: 30, color: '#FFFFFF', backgroundColor: '#2C2C2E' },
    buttonSpacing: { marginTop: 10 }
});