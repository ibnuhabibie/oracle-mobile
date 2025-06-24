import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import {
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import { useTranslation } from "react-i18next";

import { MainNavigatorParamList } from '../../../../navigators/types';
import { AppText } from '../../../../components/ui/app-text';
import { COLORS } from '../../../../constants/colors';
import { Calendar } from 'react-native-calendars';
import ScreenContainer from '../../../../components/layouts/ScreenContainer';
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

    return (
        <ScreenContainer>
            <AppText style={styles.title} color='primary' variant='subtitle1'>
                {t("DIARY")}
            </AppText>
            <AppText style={styles.subtitle} variant='caption1'>{t('A safe space to express your thoughts and emotions.')}</AppText>
            <Calendar
                style={styles.calendar}
                markedDates={markedDates}
                onDayPress={day => {
                    const mark = markedDates[day.dateString];
                    if (mark && mark.diaryId) {
                        navigation.push('EchoDetail', { id: mark.diaryId, date: day });
                    } else {
                        navigation.push('EchoDetail', { date: day });
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
                        todayTextColor: 'white',
                        dotStyle: {
                            width: 5,
                            height: 5
                        },
                        arrowColor: COLORS.primary
                    }
                }
            />
            <View style={{ marginTop: 14 }}>
                <AppText>Recent Diaries</AppText>
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
                                <AppText variant='caption1'>
                                    {diary.diary_date}
                                </AppText>
                                <AppText variant='body1'>
                                    {diary.content}
                                </AppText>
                            </View>
                        </Pressable>
                    ))
                ) : (
                    <View style={styles.emptyDiaryContainer}>
                        <AppText style={styles.emptyDiaryTitle}>No Diaries Yet</AppText>
                        <AppText style={styles.emptyDiaryDesc}>
                            Start your first diary entry to express your thoughts and feelings. Your journey begins here!
                        </AppText>
                    </View>
                )}
            </View>
        </ScreenContainer>
    );
};

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
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 24
    },
    diaryItem: {
        padding: 14,
        borderWidth: 1,
        borderColor: COLORS.black,
        borderRadius: 12,
        marginTop: 8,
        flexDirection: 'row',
        gap: 14,
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
});

export default Echo;
