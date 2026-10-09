// app/index.tsx
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useWorkoutDates } from '../src/hooks/useWorkoutDates';

export default function HomeScreen() {
    const router = useRouter();
    const { markedDates, isLoading } = useWorkoutDates();

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4f46e5" />
                <Text style={styles.loadingText}>Loading calendar...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Calendar
                markedDates={markedDates}
                theme={{
                    todayTextColor: '#4f46e5',
                    selectedDayBackgroundColor: '#4f46e5',
                    dotColor: '#4f46e5',
                }}
                onDayPress={(day) => {
                    router.push(`/workout/${day.dateString}`);
                }}
            />

            <View style={styles.overviewContainer}>
                <Text style={styles.overviewTitle}>Overview</Text>
                <Text style={styles.overviewStat}>Days trained: {Object.keys(markedDates).length}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#ffffff', paddingTop: 10 },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
    loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
    overviewContainer: { padding: 20, marginTop: 20 },
    overviewTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    overviewStat: { fontSize: 16, color: '#444' }
});