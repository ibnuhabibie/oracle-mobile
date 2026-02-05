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
import { Calendar, LocaleConfig } from 'react-native-calendars';

import { AppText } from '../../../../components/ui/app-text';
import ScreenContainer from '../../../../components/layouts/screen-container';
import CalendarIcon from '../../../../components/icons/echo/calendar-icon';

import i18n from '../../../../locales/i18n';
import { scaleSize } from '../../../../utils/scale';
import { formatDateOnly } from '../../../../utils/date';
import { COLORS } from '../../../../constants/colors';

import type { MainNavigatorParamList } from '../../../../navigators/types';
import type {
    DateData,
    Diary,
    FloatingAddButtonProps,
    MarkedDates,
    MonthData,
    MonthRange,
} from './types';

type EchoProps = NativeStackScreenProps<MainNavigatorParamList, 'Echo'>;

const Echo: FC<EchoProps> = ({ navigation }) => {
    const { t } = useTranslation();

    const [diaries, setDiaries] = useState<Diary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<MonthData>(() => {
        const now = new Date();
        return { dateString: '', day: now.getDate(), month: now.getMonth() + 1, year: now.getFullYear() };
    });
    const [markedDates, setMarkedDates] = useState<MarkedDates>({});

    // Helper to get first and last day of month as YYYY-MM-DD
    const getMonthRange = (year: number, month: number): MonthRange => {
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
                    setDiaries(res.data as Diary[]);
                    // Mark all diary dates
                    const marks: MarkedDates = {};
                    res.data.forEach((d: Diary) => {
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

    const toDetail = (diary: Diary) => {
        console.log('clicked', diary.diary_id)
        navigation.push('EchoDetail', {
            id: diary.diary_id,
            date: {
                dateString: diary.diary_date,
                day: new Date(diary.diary_date).getDate(),
                month: new Date(diary.diary_date).getMonth() + 1,
                year: new Date(diary.diary_date).getFullYear(),
            }
        })
    }

    // Handler for FAB
    const newEdit = () => {
        const today = new Date();
        const pad = (n: number) => n.toString().padStart(2, '0');
        const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
        const todayDiary = diaries.find(d => d.diary_date === todayStr);
        const dateData: DateData = {
            dateString: todayStr,
            day: today.getDate(),
            month: today.getMonth() + 1,
            year: today.getFullYear(),
        };
        if (todayDiary) {
            navigation.push('EchoDetail', { id: todayDiary.diary_id, date: dateData });
        } else {
            navigation.push('EchoDetail', { date: dateData });
        }
    };

    // Set LocaleConfig for Calendar
    const calendar = i18n.getResource(i18n.language, 'translation', 'calendar');
    if (calendar) {
        LocaleConfig.locales[i18n.language] = {
            monthNames: calendar.monthNames,
            monthNamesShort: calendar.monthNamesShort,
            dayNames: calendar.dayNames,
            dayNamesShort: calendar.dayNamesShort
        };
        LocaleConfig.defaultLocale = i18n.language;
    }

    return (
        <ScreenContainer floatingButton={<FloatingAddButton onPress={newEdit} />}>
            <AppText style={styles.title} color='primary' variant='subtitle1'>
                {t("echo.title")}
            </AppText>
            <AppText style={styles.subtitle} variant='caption1' color='white'>{t('echo.subtitle')}</AppText>
            <Calendar
                style={styles.calendar}
                markedDates={markedDates}
                onDayPress={(day: DateData) => {
                    const mark = markedDates[day.dateString];
                    if (mark && mark.diaryId) {
                        navigation.push('EchoDetail', { id: mark.diaryId, date: day });
                    }
                    // else {
                    //     navigation.push('EchoDetail', { date: day });
                    // }
                }}
                onMonthChange={(monthObj: MonthData) => {
                    setSelectedMonth(monthObj);
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
                    }
                }
            />
            <View style={styles.diaryListContainer}>
                <AppText color='neutral'>{t('echo.recentDiaries')}</AppText>
                {loading && <AppText style={styles.loadingText}>{t('echo.loading')}</AppText>}
                {error && error !== 'No diary found.' && <AppText style={styles.errorText}>{error}</AppText>}
                {!loading && !error && diaries && diaries.length > 0 && (
                    diaries.map((diary: Diary) => (
                        <Pressable key={diary.diary_id} onPress={() => toDetail(diary)} style={styles.diaryItem}>
                            <View style={styles.diaryIconContainer}>
                                <CalendarIcon size={scaleSize(20)} />
                            </View>
                            <View style={styles.diaryContentContainer}>
                                <AppText variant='caption1' color='light-gray'>
                                    {formatDateOnly(diary.diary_date)}
                                </AppText>
                                <AppText variant='body1' color='neutral'>
                                    {diary.content}
                                </AppText>
                            </View>
                        </Pressable>
                    ))
                )}
                {!loading && !error && (!diaries || diaries.length === 0) && (
                    <View style={styles.emptyDiaryContainer}>
                        <AppText variant='subtitle1' color='primary' style={styles.emptyDiaryTitle}>{t('echo.noDiariesYet')}</AppText>
                        <AppText variant='caption1' style={styles.emptyDiaryDesc} color='gray'>
                            {t('echo.startDiaryDesc')}
                        </AppText>
                    </View>
                )}
            </View>
        </ScreenContainer>
    );
};

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({ onPress }) => (
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
