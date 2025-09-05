import DateTimePicker from '@react-native-community/datetimepicker';
import React, { FC, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AppText } from '../../components/ui/app-text';
import { useTranslation } from "react-i18next";

import AppInput from '../../components/ui/app-input';
import CalendarIcon from '../../components/icons/auth/calendar-icon';
import ClockIcon from '../../components/icons/auth/clock-icon';
import TextField from '../../components/ui/text-field';
import { DropdownButton, renderDropdownModal } from '../../components/widgets/dropdown';
import { AppButton } from '../../components/ui/app-button';
import { fontFamilies } from '../../constants/fonts';
import { formatDate, formatTime } from '../../utils/formatter';
import api from '../../utils/http';
import { COLORS } from '../../constants/colors';
import { useAsyncStorage } from '../../hooks/use-storage';
import { LANGUAGES } from '../../constants/app';
import { scaleFont, scaleSize } from '../../utils/scale';

export interface City {
    name: string;
    latitude: number;
    longitude: number;
}

export interface Country {
    name: string;
    iso3: string;
}

interface Profile {
    full_name: string;
    email: string;
    phone_number: string;
    birth_date: string;
    birth_time: string;
    gender: 'male' | 'female';
    birth_country: string;
    birth_city: string;
    birth_lat: string | number;
    birth_lng: string | number;
}

export interface ProfileFormData {
    full_name: string;
    email: string;
    phone_number: string;
    birth_date: Date;
    birth_time: Date;
    gender: 'male' | 'female';
    birth_country: Country | null;
    birth_city: City | null;
    language: string;
}

interface ProfileFormProps {
    onSubmit: (data: ProfileFormData) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
    onSubmit,
}) => {
    const { t } = useTranslation();

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [showCountryModal, setShowCountryModal] = useState(false);
    const [showCityModal, setShowCityModal] = useState(false);

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    const { getUserProfile } = useAsyncStorage();

    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        watch,
        formState: { errors }
    } = useForm<ProfileFormData>({
        defaultValues: {
            full_name: '',
            email: '',
            phone_number: '',
            birth_date: new Date(1994, 4, 10),
            birth_time: new Date(2024, 0, 1, 10, 0),
            gender: 'Female',
            birth_country: null as Country | null,
            birth_city: null as City | null,
            language: LANGUAGES[0]?.key || 'en',
        },
    });

    useEffect(() => {
        const init = async () => {
            const profile = await getUserProfile() as Profile | null;
            console.log('profile', profile)
            if (!profile) return;

            const [hours, minutes, seconds] = profile.birth_time.split(':').map(Number);
            const birthTime = new Date();
            birthTime.setHours(hours);
            birthTime.setMinutes(minutes);
            birthTime.setSeconds(seconds);

            setValue('full_name', profile.full_name);
            setValue('email', profile.email);
            setValue('phone_number', profile.mobile_phone);
            setValue('birth_date', new Date(profile.birth_date));
            setValue('birth_time', birthTime);
            setValue('gender', profile.gender);
            setValue('birth_city', {
                name: profile.birth_city,
                latitude: profile.birth_lat !== undefined && profile.birth_lat !== null ? parseFloat(profile.birth_lat as string) : 0,
                longitude: profile.birth_lng !== undefined && profile.birth_lng !== null ? parseFloat(profile.birth_lng as string) : 0,
            });
            setValue('birth_country', {
                name: profile.birth_country,
                iso3: profile.birth_country,
            });
        };

        init();
    }, []);

    const watchedCountry = watch('birth_country') as Country | null;
    const watchedCity = watch('birth_city') as City | null;
    const watchedDate = watch('birth_date');
    const watchedTime = watch('birth_time');
    const watchedGender = watch('gender');
    const watchedLanguage = watch('language');

    // Language dropdown modal state
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    const formRules = {
        full_name: {
            required: t('NAME IS REQUIRED'),
            minLength: {
                value: 2,
                message: t('NAME MIN LENGTH')
            }
        },
        email: {
            required: t('EMAIL IS REQUIRED'),
            pattern: {
                value: /^\S+@\S+$/i,
                message: t('INVALID EMAIL FORMAT')
            }
        },
    };

    const fetchCountries = async () => {
        try {
            const response = await api.get('/v1/configs/countries');
            setCountries(response.data);
        } catch (error) {
            console.error('Failed to fetch countries:', error);
        }
    };

    const fetchCities = async (country: Country) => {
        try {
            const response = await api.get(`/v1/configs/countries/${country.iso3}/cities`);
            const cities = response.data;
            if (cities.length > 0) {
                setValue('birth_city', cities[0]);
            }
            setCities(response.data);
        } catch (error) {
            console.error('Failed to fetch countries:', error);
        }
    };


    useEffect(() => {
        fetchCountries();
    }, []);

    const onDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setValue('birth_date', selectedDate);
        }
    };

    const onTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            setValue('birth_time', selectedTime);
        }
    };

    const selectCountry = async (country: Country) => {
        setValue('birth_country', country);
        await fetchCities(country);
        setShowCountryModal(false);
    };

    const selectCity = (city: City) => {
        setValue('birth_city', city);
        setShowCityModal(false);
    };

    const selectLanguage = (lang: { key: string; label: string }) => {
        setValue('language', lang.key);
        setShowLanguageModal(false);
    };

    return (
        <>
            <View style={styles.formContainer}>
                <AppText variant="body2" style={styles.label} color='neutral'>{t("Full Name")}</AppText>
                <AppInput
                    control={control}
                    name="full_name"
                    rules={formRules.full_name}
                    placeholder={t("Name")}
                    errors={errors}
                />

                <AppText variant="body2" style={styles.label} color='neutral'>{t("Email Address")}</AppText>
                <AppInput
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder={t("Email")}
                    errors={errors}
                    keyboardType="email-address"
                />

                <AppText variant="body2" style={styles.label} color='neutral'>{t("Phone Number")}</AppText>
                <Controller
                    control={control}
                    name="phone_number"
                    render={({ field: { value, onChange } }) => (
                        <TextField
                            placeholder={t("Phone Number")}
                            value={value}
                            onChangeText={onChange}
                            style={styles.textField}
                            keyboardType="phone-pad"
                        />
                    )}
                />

                {/* Birth Date Field */}
                <AppText variant="body2" style={styles.label} color='neutral'>{t("Birth Date")}</AppText>
                <Pressable onPress={() => setShowDatePicker(true)}>
                    <View pointerEvents="none">
                        <TextField
                            placeholder={t("Birth Date:")}
                            value={formatDate(watchedDate)}
                            style={styles.textField}
                            editable={false}
                            rightIcon={<CalendarIcon size={15} />}
                        />
                    </View>
                </Pressable>

                {/* Birth Time Field */}
                <AppText variant="body2" style={styles.label} color='neutral'>{t("Birth Time")}</AppText>
                <Pressable
                    onPress={() => {
                        setShowTimePicker(true);
                    }}>
                    <View pointerEvents="none">
                        <TextField
                            placeholder={t("Birth Time:")}
                            value={formatTime(watchedTime)}
                            style={styles.textField}
                            editable={false}
                            rightIcon={<ClockIcon />}
                        />
                    </View>
                </Pressable>

                <AppText variant="caption4" style={styles.helperText} color='neutral'>
                    {t("Not sure about your birth time? Just go with your closest guess.")}
                </AppText>

                <AppText variant="body2" style={styles.label} color='neutral'>{t("Gender")}</AppText>
                <View style={styles.radioContainer}>
                    <Pressable
                        style={styles.radioButton}
                        onPress={() => setValue('gender', 'Male')}>
                        <View style={styles.radioCircle}>
                            {watchedGender === 'Male' && (
                                <View style={styles.radioSelected} />
                            )}
                        </View>
                        <AppText variant="body2" color='neutral'>{t("Male")}</AppText>
                    </Pressable>
                    <Pressable
                        style={styles.radioButton}
                        onPress={() => setValue('gender', 'Female')}>
                        <View style={styles.radioCircle}>
                            {watchedGender === 'Female' && (
                                <View style={styles.radioSelected} />
                            )}
                        </View>
                        <AppText variant="body2" color='neutral'>{t("Female")}</AppText>
                    </Pressable>
                </View>

                <AppText variant="body2" style={styles.label} color='neutral'>{t("Country of Birth")}</AppText>
                <DropdownButton
                    onPress={() => setShowCountryModal(true)}
                    text={watchedCountry?.name || t("Please select one")}
                />

                <AppText variant="body2" style={styles.label} color='neutral'>{t("City of Birth")}</AppText>
                <DropdownButton
                    onPress={() => setShowCityModal(true)}
                    text={watchedCity?.name || t("Please select one")}
                />

                <AppText variant="body2" style={styles.label} color='neutral'>{t("Language")}</AppText>
                <DropdownButton
                    onPress={() => setShowLanguageModal(true)}
                    text={LANGUAGES.find(l => l.key === watchedLanguage)?.label || t("Please select one")}
                />
            </View>

            <AppButton
                title={t("Save")}
                onPress={handleSubmit(onSubmit)}
            />

            {/* Date Picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={watchedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}

            {/* Time Picker */}
            {showTimePicker && (
                <DateTimePicker
                    value={watchedTime}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            {/* Country Modal */}
            {
                renderDropdownModal(
                    showCountryModal,
                    () => setShowCountryModal(false),
                    'Select Country',
                    countries as any,
                    selectCountry as any,
                    watchedCountry as any,
                    'iso3'
                )
            }

            {/* City Modal */}
            {renderDropdownModal(
                showCityModal,
                () => setShowCityModal(false),
                'Select City',
                cities as any,
                selectCity as any,
                watchedCity as any,
                'name'
            )}

            {/* Language Modal */}
            {renderDropdownModal(
                showLanguageModal,
                () => setShowLanguageModal(false),
                'Select Language',
                LANGUAGES as any,
                selectLanguage as any,
                LANGUAGES.find(l => l.key === watchedLanguage) as any,
                'key',
            )}
        </>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        marginBottom: scaleSize(18, 18, 24),
    },
    label: {
        marginBottom: scaleSize(6, 6, 8),
        marginTop: scaleSize(12, 12, 16),
        fontSize: scaleFont(14, 12, 18),
    },
    textField: {
        width: '100%',
        marginBottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.13)'
    },
    helperText: {
        marginTop: scaleSize(2, 2, 4),
        fontSize: scaleFont(10, 8, 14),
    },
    radioContainer: {
        flexDirection: 'row',
        gap: scaleSize(16, 16, 24),
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: scaleSize(6, 6, 8),
    },
    radioCircle: {
        width: scaleSize(14, 14, 20),
        height: scaleSize(14, 14, 20),
        borderRadius: scaleSize(7, 7, 10),
        borderWidth: scaleSize(2),
        borderColor: COLORS['radio-brown'],
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        width: scaleSize(6, 6, 10),
        height: scaleSize(6, 6, 10),
        borderRadius: scaleSize(3, 3, 5),
        backgroundColor: COLORS['radio-brown'],
    },
});

export default ProfileForm;
