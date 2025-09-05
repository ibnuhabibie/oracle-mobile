import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Pressable, StyleSheet, View, Alert } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';

import CalendarIcon from '../../components/icons/auth/calendar-icon';
import ClockIcon from '../../components/icons/auth/clock-icon';

import ScreenContainer from '../../components/layouts/screen-container';
import { AppButton } from '../../components/ui/app-button';
import TextField from '../../components/ui/text-field';
import {
  DropdownButton,
  renderDropdownModal,
} from '../../components/widgets/dropdown';
import { fontFamilies } from '../../constants/fonts';
import { formatDate, formatTime } from '../../utils/formatter';
import { MainNavigatorParamList } from '../../navigators/types';
import api from '../../utils/http';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppText } from '../../components/ui/app-text';
import { COLORS } from '../../constants/colors';
import { useTranslation } from 'react-i18next';

interface Country {
  name: string;
  iso3: string;
}

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

interface FormData {
  birth_date: Date;
  birth_time: Date;
  birth_country: Country | null;
  birth_city: City | null;
}

const Onboarding: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'Onboarding'>;
}> = ({ navigation }) => {

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const { t } = useTranslation();

  const { handleSubmit, setValue, watch, formState, setError } = useForm<FormData>({
    defaultValues: {
      birth_date: new Date,
      birth_time: new Date,
      birth_country: null,
      birth_city: null,
    },
    mode: 'onSubmit',
  });

  const watchedCountry = watch('birth_country');
  const watchedCity = watch('birth_city');
  const watchedDate = watch('birth_date');
  const watchedTime = watch('birth_time');

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
      console.log(watchedCountry)
      const response = await api.get(`/v1/configs/countries/${country.iso3}/cities`);
      setCities(response.data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };


  useEffect(() => {
    fetchCountries();
  }, []);


  const onSubmit: SubmitHandler<FormData> = async (data) => {
    // Validation: all fields required
    if (
      !data.birth_date ||
      !data.birth_time ||
      !data.birth_country ||
      !data.birth_city
    ) {
      Alert.alert(t('Register Failed'), t('All fields are required.'));
      return;
    }

    setLoading(true);
    try {
      let birth_date = data.birth_date.toISOString().split('T')[0];
      let birth_time = data.birth_time.toISOString().split('T')[1].split('.')[0];

      const res = await api.put('/v1/users', {
        birth_date,
        birth_time,
        birth_country: data.birth_country.name,
        birth_city: data.birth_city.name,
        birth_lat: data.birth_city.latitude,
        birth_lng: data.birth_city.longitude
      })

      await AsyncStorage.setItem('user_profile', JSON.stringify(res.data));

      if (!res.data.mbti_profile) {
        navigation.replace('MbtiQuiz');
      } else {
        navigation.replace('Tabs');
      }
    } catch (error) {
      Alert.alert(t('Register Failed'), t('An error occurred. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

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
    console.log('country', country)
    setValue('birth_country', country);
    await fetchCities(country);
    if (cities.length > 0) {
      setValue('birth_city', cities[0]);
    }
    setShowCountryModal(false);
  };

  const selectCity = (city: City) => {
    console.log('city', city)
    setValue('birth_city', city);
    setShowCityModal(false);
  };

  return (
    <ScreenContainer style={styles.container}>
      <AppText variant='title3' style={styles.title} color='white'>{t('Introduce yourself')}</AppText>
      <AppText style={styles.subtitle} variant="caption1" color='neutral'>
        {t('Introduce yourself and let the universe guide you!')}
      </AppText>

      <View style={styles.formContainer}>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextField
              placeholder={t('Birth Date:')}
              value={formatDate(watchedDate)}
              style={styles.textField}
              editable={false}
              rightIcon={<CalendarIcon size={scaleSize(15)} />}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            setShowTimePicker(true);
          }}>
          <View pointerEvents="none">
            <TextField
              placeholder={t('Birth Time:')}
              value={formatTime(watchedTime)}
              style={styles.textField}
              editable={false}
              rightIcon={<ClockIcon size={scaleSize(15)} />}
            />
          </View>
        </Pressable>

        <AppText variant='caption4' style={styles.helpText}>
          {t('Not sure about your birth time? Just go with your closest guess.')}
        </AppText>

        <DropdownButton
          onPress={() => setShowCountryModal(true)}
          text={watchedCountry && typeof watchedCountry === 'object' ? watchedCountry.name : t('Please select one')}
        />

        <DropdownButton
          onPress={() => setShowCityModal(true)}
          text={watchedCity && typeof watchedCity === 'object' ? watchedCity.name : t('Please select one')}
        />
      </View>

      <AppButton
        title={t('Save')}
        onPress={handleSubmit(onSubmit)}
        style={styles.saveButton}
        disabled={loading}
        loading={loading}
      />

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={watchedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
          style={{ backgroundColor: COLORS.red }}
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
      {renderDropdownModal(
        showCountryModal,
        () => setShowCountryModal(false),
        t('Select Country'),
        countries,
        selectCountry,
        watchedCountry?.iso3 ?? '',
        'iso3'
      )}

      {/* City Modal */}
      {renderDropdownModal(
        showCityModal,
        () => setShowCityModal(false),
        t('Select City'),
        cities,
        selectCity,
        watchedCity?.name ?? '',
        'name'
      )}

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: scaleSize(44),
  },
  title: {
    textAlign: 'center',
    marginBottom: scaleSize(8),
    fontSize: scaleFont(22), // assuming title3
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: scaleSize(32),
    fontSize: scaleFont(12), // assuming caption1
  },
  formContainer: {
    width: '100%',
    marginBottom: scaleSize(32),
    gap: scaleSize(12)
  },
  textField: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.13)'
  },
  marginedTextField: {
    width: '100%',
    marginBottom: scaleSize(16),
  },
  helpText: {
    color: COLORS['light-gray'],
    marginTop: scaleSize(8),
    fontSize: scaleFont(10), // assuming caption4/tiny
  },
  saveButton: {
    width: '100%',
  },
  calendarIcon: {
    padding: scaleSize(4),
  },
  timeIcon: {
    padding: scaleSize(4),
  },
});

export default Onboarding;
