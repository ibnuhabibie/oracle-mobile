import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    View,
    TouchableOpacity,
    Text
} from 'react-native';
import { useTranslation } from "react-i18next";

import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { Calendar } from 'react-native-calendars';
import ScreenContainer from '../../../../components/layouts/screen-container';
import CalendarIcon from '../../../../components/icons/echo/calendar-icon';


type EchoProps = NativeStackScreenProps<MainNavigatorParamList, 'Echo'>;

const Echo: FC<EchoProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const [diaries, setDiaries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number }>(() => {
        const now = new Date();
        return { year: now.getFullYear(), month: now.getMonth() + 1 };
    });
    const [markedDates, setMarkedDates] = useState<any>({});

    // Helper to get first and last day of month as YYYY-MM-DD
    const getMonthRange = (year: number, month: number) => {
        const start = new Date(year, month - 1, 1);
        const end = new Date(year, month, 0);
        const pad = (n: number) => n.toString().padStart(2, '0');
        return {
            start_date: `${start.getFullYear()}-${pad(start.getMonth() + 1)}-01`,
            end_date: `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}`,
        };
    };

    // Fetch all diaries for selected month and mark dates (using useState only, so fetch in body)
    const { start_date, end_date } = getMonthRange(selectedMonth.year, selectedMonth.month);
    if ((!diaries || diaries.length === 0) && !loading && !error) {
        setLoading(true);
        const api = require('../../../../utils/http').default;
        api.get(`/v1/secret-diaries?limit=1000&offset=0&start_date=${start_date}&end_date=${end_date}`)
            .then((res: any) => {
                if (res && Array.isArray(res.data) && res.data.length > 0) {
                    setDiaries(res.data);
                    // Mark all diary dates
                    const marks: any = {};
                    res.data.forEach((d: any) => {
                        marks[d.diary_date] = {
                            marked: true,
                            dotColor: COLORS.primary,
                            diaryId: d.diary_id,
                        };
                    });
                    setMarkedDates(marks);
                } else {
                    setError('No diary found.');
                    setMarkedDates({});
                }
            })
            .catch((err: any) => {
                setError(err?.message || 'Failed to fetch diary');
                setMarkedDates({});
            })
            .finally(() => setLoading(false));
    }


    const toDetail = (diary) => {
        console.log('clicked', diary.diary_id)
        navigation.push('EchoDetail', {
            id: diary.diary_id,
            date: {
                dateString: diary.diary_date
            }
        })
    }

    // Handler for FAB
    const newEdit = () => {
        const today = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        const todayDiary = diaries.find(d => d.diary_date === todayStr);
        if (todayDiary) {
            navigation.push('EchoDetail', { id: todayDiary.diary_id, date: { dateString: todayStr } });
        } else {
            navigation.push('EchoDetail', { date: { dateString: todayStr } });
        }
    };

    return (
        <ScreenContainer floatingButton={<FloatingAddButton onPress={newEdit} />}>
            <AppText style={styles.title} color='primary' variant='subtitle1'>
                {t("DIARY")}
            </AppText>
            <AppText style={styles.subtitle} variant='caption1' color='white'>{t('A safe space to express your thoughts and emotions.')}</AppText>
            <Calendar
                style={styles.calendar}
                markedDates={markedDates}
                onDayPress={day => {
                    const mark = markedDates[day.dateString];
                    if (mark && mark.diaryId) {
                        navigation.push('EchoDetail', { id: mark.diaryId, date: day });
                    }
                }}
                onMonthChange={monthObj => {
                    setDiaries([]);
                    setError(null);
                    setMarkedDates({});
                    setSelectedMonth({ year: monthObj.year, month: monthObj.month });
                }}
                theme={
                    {
                        todayBackgroundColor: COLORS.primary,
                        todayTextColor: COLORS.white,
                        dotStyle: {
                            width: 5,
                            height: 5
                        },
                        arrowColor: COLORS.white,
                        calendarBackground: 'transparent',
                        monthTextColor: COLORS.white,
                        dayTextColor: COLORS.white
                        // backgroundColor: 'rgba(255,255,255,0.14)',
                    }
                }
            />
            <View style={{ marginTop: 14 }}>
                <AppText color='neutral'>{t('Recent Diaries')}</AppText>
                {loading ? (
                    <AppText style={{ marginTop: 8 }}>{t('Loading...')}</AppText>
                ) : error && error !== 'No diary found.' ? (
                    <AppText style={{ color: 'red', marginTop: 8 }}>{error}</AppText>
                ) : diaries && diaries.length > 0 ? (
                    diaries.map((diary) => (
                        <Pressable key={diary.diary_id} onPress={() => toDetail(diary)} style={styles.diaryItem}>
                            <View style={styles.diaryIconContainer}>
                                <CalendarIcon />
                            </View>
                            <View style={{ flex: 1 }}>
                                <AppText variant='caption1' color='light-gray'>
                                    {diary.diary_date}
                                </AppText>
                                <AppText variant='body1' color='neutral'>
                                    {diary.content}
                                </AppText>
                            </View>
                        </Pressable>
                    ))
                ) : (
                    <View style={styles.emptyDiaryContainer}>
                        <AppText style={styles.emptyDiaryTitle}>{t('No Diaries Yet')}</AppText>
                        <AppText style={styles.emptyDiaryDesc}>
                            {t('Start your first diary entry to express your thoughts and feelings. Your journey begins here!')}
                        </AppText>
                    </View>
                )}
            </View>
        </ScreenContainer>
    );
};

const FloatingAddButton = ({ onPress }) => (
    <TouchableOpacity style={styles.fab} onPress={onPress}>
        <Text style={styles.fabIcon}>+</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        letterSpacing: 5,
        lineHeight: 24,
        marginTop: 40,
        textTransform: 'uppercase'
    },
    subtitle: {
        textAlign: 'center',
        marginTop: 10,
        maxWidth: '80%',
        marginHorizontal: 'auto'
    },
    calendar: {
        borderColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 24,
        backgroundColor: '#FFFFFF22',
    },
    diaryItem: {
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: 12,
        marginTop: 8,
        flexDirection: 'row',
        gap: 14,
        backgroundColor: 'rgba(255,255,255,0.13)'
        // alignItems: 'center',
    },
    diaryIconContainer: {
        width: 38,
        height: 38,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyDiaryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 32,
        paddingHorizontal: 24,
    },
    emptyDiaryImage: {
        width: 90,
        height: 90,
        marginBottom: 16,
        opacity: 0.7,
    },
    emptyDiaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.primary,
        marginBottom: 6,
        textAlign: 'center',
    },
    emptyDiaryDesc: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        lineHeight: 20,
    },
    fabContainer: {
        position: 'absolute',
        right: 24,
        top: '80%',
        zIndex: 200,
    },
    fab: {
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    fabIcon: {
        fontSize: 32,
        color: '#222',
        fontWeight: 'bold',
        marginTop: -2,
    },
});

export default Echo;
