import DateTimePicker from '@react-native-community/datetimepicker';
import React, { FC, useEffect, useState, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            phone_number: '',
            birth_date: new Date(1994, 4, 10),
            birth_time: new Date(2024, 0, 1, 10, 0),
            gender: 'female',
            birth_country: null as Country | null,
            birth_city: null as City | null,
        },
    });

    useEffect(() => {
        const init = async () => {
            const profile = await getUserProfile() as Profile | null;
            if (!profile) return;

            const [hours, minutes, seconds] = profile.birth_time.split(':').map(Number);
            const birthTime = new Date();
            birthTime.setHours(hours);
            birthTime.setMinutes(minutes);
            birthTime.setSeconds(seconds);

            setValue('full_name', profile.full_name);
            setValue('email', profile.email);
            setValue('phone_number', '');
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

    const fetchCities = async (country) => {
        try {
            console.log(watchedCountry)
            const response = await api.get(`/v1/configs/countries/${country.iso3}/cities`);
            const cities = response.data;
            if (cities.length > 0) {
                console.log(cities[0])
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

    const selectCountry = async (country) => {
        console.log('country', country)
        setValue('birth_country', country);
        await fetchCities(country);

        setShowCountryModal(false);
    };

    const selectCity = (city) => {
        console.log('city', city)
        setValue('birth_city', city);
        setShowCityModal(false);
    };

    return (
        <>
            <View style={styles.formContainer}>
                <Text style={styles.label}>{t("Full Name")}</Text>
                <AppInput
                    control={control}
                    name="full_name"
                    rules={formRules.full_name}
                    placeholder={t("Name")}
                    errors={errors}
                />

                <Text style={styles.label}>{t("Email Address")}</Text>
                <AppInput
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder={t("Email")}
                    errors={errors}
                    keyboardType="email-address"
                />

                <Text style={styles.label}>{t("Phone Number")}</Text>
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
                <Text style={styles.label}>{t("Birth Date")}</Text>
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
                <Text style={styles.label}>{t("Birth Time")}</Text>
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

                <Text style={styles.helperText}>
                    {t("Not sure about your birth time? Just go with your closest guess.")}
                </Text>

                <Text style={styles.label}>{t("Gender")}</Text>
                <View style={styles.radioContainer}>
                    <Pressable
                        style={styles.radioButton}
                        onPress={() => setValue('gender', 'Male')}>
                        <View style={styles.radioCircle}>
                            {watchedGender === 'Male' && (
                                <View style={styles.radioSelected} />
                            )}
                        </View>
                        <Text style={styles.radioText}>{t("Male")}</Text>
                    </Pressable>
                    <Pressable
                        style={styles.radioButton}
                        onPress={() => setValue('gender', 'Female')}>
                        <View style={styles.radioCircle}>
                            {watchedGender === 'Female' && (
                                <View style={styles.radioSelected} />
                            )}
                        </View>
                        <Text style={styles.radioText}>{t("Female")}</Text>
                    </Pressable>
                </View>

                <Text style={styles.label}>{t("Country of Birth")}</Text>
                <DropdownButton
                    onPress={() => setShowCountryModal(true)}
                    text={watchedCountry?.name || t("Please select one")}
                />

                <Text style={styles.label}>{t("City of Birth")}</Text>
                <DropdownButton
                    onPress={() => setShowCityModal(true)}
                    text={watchedCity?.name || t("Please select one")}
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
                    countries,
                    selectCountry,
                    watchedCountry,
                    'iso3'
                )
            }

            {/* City Modal */}
            {renderDropdownModal(
                showCityModal,
                () => setShowCityModal(false),
                'Select City',
                cities,
                selectCity,
                watchedCity,
                'name'
            )}
        </>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        width: '100%',
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 16,
        fontFamily: fontFamilies.ARCHIVO.light,
        color: '#333',
    },
    textField: {
        width: '100%',
        marginBottom: 0,
    },
    helperText: {
        fontSize: 12,
        color: '#777',
        marginTop: 4,
        fontFamily: fontFamilies.ARCHIVO.light,
    },
    radioContainer: {
        flexDirection: 'row',
        gap: 24,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#c1976b',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioSelected: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#c1976b',
    },
    radioText: {
        fontSize: 16,
        fontFamily: fontFamilies.ARCHIVO.light,
        color: '#333',
    },
});

export default ProfileForm;
