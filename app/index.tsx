import { View, Text, StyleSheet, ActivityIndicator, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useWorkoutDates } from '../src/hooks/useWorkoutDates';
import { debouncePress } from '../src/utils/debounce';

export default function HomeScreen() {
    const router = useRouter();
    const { markedDates, isLoading } = useWorkoutDates();

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Calendar
                markedDates={markedDates}
                hideExtraDays={true} // Removes the trailing days from adjacent months
                theme={{
                    // Backgrounds matching the sleek dark theme
                    calendarBackground: '#1C1C1E',
                    
                    // Typography & Day Colors
                    dayTextColor: '#FFFFFF',
                    monthTextColor: '#FFFFFF',
                    textSectionTitleColor: '#6B7280', // Grayed-out "M T W T F S S"
                    textDisabledColor: '#374151', // Past/disabled days
                    
                    // Purplish Highlights
                    todayTextColor: '#6366f1',
                    selectedDayBackgroundColor: '#6366f1',
                    selectedDayTextColor: '#FFFFFF',
                    
                    // Accents
                    arrowColor: '#FFFFFF',
                    dotColor: '#6366f1', // Global fallback dot color
                    
                    // Font Styling
                    textDayFontWeight: '500',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '600',
                    textDayFontSize: 16,
                    textMonthFontSize: 20,
                }}
                onDayPress={debouncePress((day) => {
                    router.push(`/workout/${day.dateString}`);
                })}
            />

            <View style={styles.overviewContainer}>
                <Text style={styles.overviewTitle}>Overview</Text>
                <Text style={styles.overviewStat}>
                    Days trained: {Object.keys(markedDates).length}
                </Text>
            </View>

            <View style={{ padding: 20 }}>
                <Button 
                    title="Go to exercise list" 
                    color="#6366f1" 
                    onPress={debouncePress(() => router.push("/exercise"))}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#1C1C1E', // Matches the calendar to eliminate borders
        paddingTop: 30 
    },
    centerContainer: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#1C1C1E' 
    },
    overviewContainer: { 
        padding: 20, 
        marginTop: 20,
        backgroundColor: '#2C2C2E', // Slightly lighter gray card for contrast
        borderRadius: 12,
        marginHorizontal: 20,
    },
    overviewTitle: { 
        fontSize: 20, 
        fontWeight: 'bold', 
        marginBottom: 10,
        color: '#FFFFFF' 
    },
    overviewStat: { 
        fontSize: 16, 
        color: '#D1D5DB' // Soft gray text
    }
});