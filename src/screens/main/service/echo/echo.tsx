import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    Pressable,
    StyleSheet,
    View,
    TouchableOpacity,
} from 'react-native';
import { useTranslation } from "react-i18next";
import { scaleSize } from '../../../../utils/scale';

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

    // Fetch all diaries for selected month and mark dates
    const { start_date, end_date } = getMonthRange(selectedMonth.year, selectedMonth.month);

    const fetchDiaries = useCallback(() => {
        setLoading(true);
        setError(null);
        setMarkedDates({});
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
                    setDiaries([]);
                    setError('No diary found.');
                    setMarkedDates({});
                }
            })
            .catch((err: any) => {
                setDiaries([]);
                setError(err?.message || 'Failed to fetch diary');
                setMarkedDates({});
            })
            .finally(() => setLoading(false));
    }, [start_date, end_date]);

    useFocusEffect(
        useCallback(() => {
            fetchDiaries();
        }, [fetchDiaries])
    );


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
                    // else {
                    //     navigation.push('EchoDetail', { date: day });
                    // }
                }}
                onMonthChange={monthObj => {
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
            <View style={styles.diaryListContainer}>
                <AppText color='neutral'>{t('Recent Diaries')}</AppText>
                {
                    loading ? (
                        <AppText style={styles.loadingText}>{t('Loading...')}</AppText>
                    ) : error && error !== 'No diary found.' ? (
                        <AppText style={styles.errorText}>{error}</AppText>
                    ) : diaries && diaries.length > 0 ? (
                        diaries.map((diary) => (
                            <Pressable key={diary.diary_id} onPress={() => toDetail(diary)} style={styles.diaryItem}>
                                <View style={styles.diaryIconContainer}>
                                    <CalendarIcon size={scaleSize(20)} />
                                </View>
                                <View style={styles.diaryContentContainer}>
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
                            <AppText variant='subtitle1' color='primary' style={styles.emptyDiaryTitle}>{t('No Diaries Yet')}</AppText>
                            <AppText variant='caption1' style={styles.emptyDiaryDesc} color='gray'>
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
        <AppText variant="largeTitle1" style={styles.fabIcon} color='black'>+</AppText>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        letterSpacing: scaleSize(5),
        lineHeight: scaleSize(24),
        marginTop: scaleSize(40),
        textTransform: 'uppercase'
    },
    subtitle: {
        textAlign: 'center',
        marginTop: scaleSize(10),
        maxWidth: '80%',
        marginHorizontal: 'auto'
    },
    calendar: {
        borderColor: 'rgba(255,255,255,0.14)',
        borderWidth: 1,
        borderRadius: scaleSize(12),
        marginTop: scaleSize(24),
        backgroundColor: '#FFFFFF22',
    },
    diaryListContainer: {
        marginTop: scaleSize(14),
    },
    loadingText: {
        marginTop: scaleSize(8),
    },
    errorText: {
        color: 'red',
        marginTop: scaleSize(8),
    },
    diaryItem: {
        padding: scaleSize(14),
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: scaleSize(12),
        marginTop: scaleSize(8),
        flexDirection: 'row',
        gap: scaleSize(14),
        backgroundColor: 'rgba(255,255,255,0.13)'
        // alignItems: 'center',
    },
    diaryIconContainer: {
        width: scaleSize(38),
        height: scaleSize(38),
        backgroundColor: COLORS.primary,
        borderRadius: scaleSize(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    diaryContentContainer: {
        flex: 1,
    },
    emptyDiaryContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scaleSize(32),
        paddingHorizontal: scaleSize(24),
    },
    emptyDiaryImage: {
        width: scaleSize(90),
        height: scaleSize(90),
        marginBottom: scaleSize(16),
        opacity: 0.7,
    },
    emptyDiaryTitle: {
        fontWeight: '600',
        marginBottom: scaleSize(6),
        textAlign: 'center',
    },
    emptyDiaryDesc: {
        textAlign: 'center',
        lineHeight: scaleSize(20),
    },
    fabContainer: {
        position: 'absolute',
        right: scaleSize(24),
        top: '80%',
        zIndex: 200,
    },
    fab: {
        backgroundColor: COLORS.primary,
        width: scaleSize(56),
        height: scaleSize(56),
        borderRadius: scaleSize(28),
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: scaleSize(2) },
        shadowOpacity: 0.3,
        shadowRadius: scaleSize(4),
    },
    fabIcon: {
        fontWeight: 'bold',
    },
});

export default Echo;
