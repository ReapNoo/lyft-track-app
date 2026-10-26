import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { YStack, XStack, Text, H2, H3, Paragraph, Card, Spinner, View } from 'tamagui';
import { 
    Dumbbell, 
    CalendarDays, 
    Flame, 
    Trophy, 
    ChevronRight, 
    ClipboardList, 
    Sparkles 
} from 'lucide-react-native';

import { useWorkoutDates } from '../src/hooks/useWorkoutDates';
import { debouncePress } from '../src/utils/debounce';

export default function HomeScreen() {
    const router = useRouter();
    const { markedDates, isLoading } = useWorkoutDates();

    const totalDays = Object.keys(markedDates).length;

    if (isLoading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <YStack flex={1} justifyContent="center" alignItems="center" gap={16}>
                    <View
                        width={56}
                        height={56}
                        borderRadius={16}
                        backgroundColor="rgba(6, 182, 212, 0.12)"
                        borderWidth={1}
                        borderColor="rgba(6, 182, 212, 0.3)"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Dumbbell size={28} color="#06b6d4" />
                    </View>
                    <Spinner size="large" color="#06b6d4" />
                    <Paragraph fontSize={13} color="#94A3B8" fontWeight="500">
                        Loading your workouts...
                    </Paragraph>
                </YStack>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Branding */}
                <XStack 
                    justifyContent="space-between" 
                    alignItems="center" 
                    paddingHorizontal={16} 
                    paddingTop={8} 
                    paddingBottom={12}
                >
                    <XStack alignItems="center" gap={12}>
                        <View 
                            width={42} 
                            height={42} 
                            borderRadius={12} 
                            backgroundColor="rgba(6, 182, 212, 0.12)" 
                            borderWidth={1} 
                            borderColor="rgba(6, 182, 212, 0.28)" 
                            justifyContent="center" 
                            alignItems="center"
                        >
                            <Dumbbell size={22} color="#06b6d4" />
                        </View>
                        <YStack>
                            <H2 fontSize={20} fontWeight="800" color="#FFFFFF" letterSpacing={-0.5}>
                                Lyft Track
                            </H2>
                            <Paragraph fontSize={12} color="#94A3B8" fontWeight="500">
                                Offline Workout Tracker
                            </Paragraph>
                        </YStack>
                    </XStack>

                    {/* Local DB Pill */}
                    <XStack 
                        backgroundColor="#1E1E22" 
                        borderWidth={1} 
                        borderColor="rgba(255, 255, 255, 0.08)" 
                        paddingHorizontal={10} 
                        paddingVertical={6} 
                        borderRadius={20} 
                        alignItems="center" 
                        gap={6}
                    >
                        <View 
                            width={6} 
                            height={6} 
                            borderRadius={3} 
                            backgroundColor="#06b6d4" 
                        />
                        <Text fontSize={11} fontWeight="700" color="#22d3ee" letterSpacing={0.5}>
                            LOCAL DB
                        </Text>
                    </XStack>
                </XStack>

                {/* Calendar Card Container */}
                <Card 
                    marginHorizontal={16} 
                    marginTop={8} 
                    backgroundColor="#18181C" 
                    borderWidth={1} 
                    borderColor="rgba(255, 255, 255, 0.08)" 
                    borderRadius={20} 
                    overflow="hidden" 
                    padding={12}
                >
                    <XStack 
                        justifyContent="space-between" 
                        alignItems="center" 
                        paddingHorizontal={8} 
                        paddingTop={4} 
                        paddingBottom={12}
                    >
                        <XStack alignItems="center" gap={8}>
                            <CalendarDays size={18} color="#06b6d4" />
                            <Text fontSize={15} fontWeight="700" color="#F1F5F9">
                                Activity Calendar
                            </Text>
                        </XStack>
                        <Text fontSize={12} color="#64748B" fontWeight="500">
                            Tap date to log
                        </Text>
                    </XStack>

                    <Calendar
                        markedDates={markedDates}
                        hideExtraDays={true}
                        theme={{
                            calendarBackground: '#18181C',
                            dayTextColor: '#FFFFFF',
                            monthTextColor: '#FFFFFF',
                            textSectionTitleColor: '#64748B',
                            textDisabledColor: '#334155',
                            todayTextColor: '#22d3ee',
                            selectedDayBackgroundColor: '#06b6d4',
                            selectedDayTextColor: '#000000',
                            arrowColor: '#06b6d4',
                            dotColor: '#06b6d4',
                            textDayFontWeight: '600',
                            textMonthFontWeight: '800',
                            textDayHeaderFontWeight: '700',
                            textDayFontSize: 15,
                            textMonthFontSize: 17,
                        }}
                        onDayPress={debouncePress((day) => {
                            router.push(`/workout/${day.dateString}`);
                        })}
                    />
                </Card>

                {/* Statistics Overview Grid */}
                <XStack marginHorizontal={16} marginTop={12} gap={12}>
                    {/* Days Trained Card */}
                    <Card 
                        flex={1} 
                        backgroundColor="#18181C" 
                        borderRadius={16} 
                        padding={14} 
                        borderWidth={1} 
                        borderColor="rgba(255, 255, 255, 0.08)"
                    >
                        <XStack justifyContent="space-between" alignItems="center" marginBottom={8}>
                            <Flame size={18} color="#06b6d4" />
                            <View 
                                backgroundColor="rgba(6, 182, 212, 0.12)" 
                                paddingHorizontal={8} 
                                paddingVertical={3} 
                                borderRadius={10}
                            >
                                <Text fontSize={10} fontWeight="700" color="#22d3ee">
                                    SESSIONS
                                </Text>
                            </View>
                        </XStack>
                        <H3 fontSize={26} fontWeight="900" color="#FFFFFF">
                            {totalDays}
                        </H3>
                        <Paragraph fontSize={12} color="#94A3B8" marginTop={2}>
                            Days trained
                        </Paragraph>
                    </Card>

                    {/* Status Goal Card */}
                    <Card 
                        flex={1} 
                        backgroundColor="#18181C" 
                        borderRadius={16} 
                        padding={14} 
                        borderWidth={1} 
                        borderColor="rgba(255, 255, 255, 0.08)"
                    >
                        <XStack justifyContent="space-between" alignItems="center" marginBottom={8}>
                            <Trophy size={18} color="#22d3ee" />
                            <View 
                                backgroundColor="rgba(34, 211, 238, 0.12)" 
                                paddingHorizontal={8} 
                                paddingVertical={3} 
                                borderRadius={10}
                            >
                                <Text fontSize={10} fontWeight="700" color="#22d3ee">
                                    STATUS
                                </Text>
                            </View>
                        </XStack>
                        <H3 fontSize={18} fontWeight="800" color="#22d3ee" numberOfLines={1}>
                            {totalDays > 0 ? 'Active' : 'Ready'}
                        </H3>
                        <Paragraph fontSize={12} color="#94A3B8" marginTop={2}>
                            {totalDays > 0 ? 'Consistent habit' : 'Tap date to start'}
                        </Paragraph>
                    </Card>
                </XStack>

                {/* Management Section Header */}
                <XStack alignItems="center" gap={8} marginHorizontal={20} marginTop={18} marginBottom={8}>
                    <Sparkles size={14} color="#06b6d4" />
                    <Text fontSize={12} fontWeight="700" color="#64748B" letterSpacing={1} textTransform="uppercase">
                        Quick Management
                    </Text>
                </XStack>

                {/* Navigation Action Cards */}
                <YStack gap={10} marginHorizontal={16} marginBottom={24}>
                    {/* Exercise Library Card */}
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={debouncePress(() => router.push("/exercise"))}
                    >
                        <Card
                            backgroundColor="#18181C"
                            borderRadius={16}
                            borderWidth={1}
                            borderColor="rgba(255, 255, 255, 0.08)"
                            padding={14}
                        >
                            <XStack alignItems="center">
                                <View 
                                    width={44} 
                                    height={44} 
                                    borderRadius={12} 
                                    backgroundColor="rgba(6, 182, 212, 0.12)" 
                                    borderWidth={1}
                                    borderColor="rgba(6, 182, 212, 0.25)"
                                    justifyContent="center" 
                                    alignItems="center"
                                >
                                    <Dumbbell size={22} color="#06b6d4" />
                                </View>

                                <YStack flex={1} marginLeft={14}>
                                    <Text fontSize={16} fontWeight="700" color="#FFFFFF">
                                        Exercise Library
                                    </Text>
                                    <Paragraph fontSize={12} color="#94A3B8" marginTop={2}>
                                        Browse movements & manage exercise catalog
                                    </Paragraph>
                                </YStack>

                                <ChevronRight size={18} color="#64748B" />
                            </XStack>
                        </Card>
                    </TouchableOpacity>

                    {/* Workout Routines Card */}
                    <TouchableOpacity
                        activeOpacity={0.75}
                        onPress={debouncePress(() => router.push("/routine"))}
                    >
                        <Card
                            backgroundColor="#18181C"
                            borderRadius={16}
                            borderWidth={1}
                            borderColor="rgba(255, 255, 255, 0.08)"
                            padding={14}
                        >
                            <XStack alignItems="center">
                                <View 
                                    width={44} 
                                    height={44} 
                                    borderRadius={12} 
                                    backgroundColor="rgba(6, 182, 212, 0.12)" 
                                    borderWidth={1}
                                    borderColor="rgba(6, 182, 212, 0.25)"
                                    justifyContent="center" 
                                    alignItems="center"
                                >
                                    <ClipboardList size={22} color="#06b6d4" />
                                </View>

                                <YStack flex={1} marginLeft={14}>
                                    <Text fontSize={16} fontWeight="700" color="#FFFFFF">
                                        Workout Routines
                                    </Text>
                                    <Paragraph fontSize={12} color="#94A3B8" marginTop={2}>
                                        Manage routine templates & split days
                                    </Paragraph>
                                </YStack>

                                <ChevronRight size={18} color="#64748B" />
                            </XStack>
                        </Card>
                    </TouchableOpacity>
                </YStack>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: '#121214' 
    },
    scrollContent: { 
        paddingBottom: 24 
    }
});