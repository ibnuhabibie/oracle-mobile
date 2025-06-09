import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import CalendarIcon from '../../components/icons/Calendar';
import ClockIcon from '../../components/icons/Clock';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { AppButton } from '../../components/ui/app-button';
import TextField from '../../components/ui/text-field';
import {
  DropdownButton,
  renderDropdownModal,
} from '../../components/widgets/Dropdown';
import { fontFamilies } from '../../constants/fonts';
import { formatDate, formatTime } from '../../utils/formatter';
import { MainNavigatorParamList } from '../../navigators/types';
import api from '../../utils/http';

interface FormData {
  birth_date: Date;
  birth_time: Date;
  birth_country: string;
  birth_city: string;
}

const Onboarding: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'Onboarding'>;
}> = ({ navigation }) => {

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const { handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      birth_date: new Date,
      birth_time: new Date,
      birth_country: null,
      birth_city: null,
    },
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

  const fetchCities = async (country) => {
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


  const onSubmit = async (data: FormData) => {
    await api.put('/v1/users', {
      birth_date: data.birth_date,
      birth_time: data.birth_time,
      birth_country: data.birth_country.iso3,
      birth_city: data.birth_city.id
    })
    navigation.replace('MbtiQuiz');
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

  const selectCountry = async (country) => {
    console.log('country', country)
    setValue('birth_country', country);
    await fetchCities(country);
    if (cities.length > 0) {
      setValue('birth_city', cities[0]);
    }
    setShowCountryModal(false);
  };

  const selectCity = (city) => {
    console.log('city', city)
    setValue('birth_city', city);
    setShowCityModal(false);
  };

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <Text style={styles.title}>Introduce yourself</Text>
      <Text style={styles.subtitle}>
        Introduce yourself and let the universe guide you!
      </Text>

      <View style={styles.formContainer}>
        <Pressable onPress={() => setShowDatePicker(true)}>
          <View pointerEvents="none">
            <TextField
              placeholder="Birth Date:"
              value={formatDate(watchedDate)}
              style={styles.textField}
              editable={false}
              rightIcon={<CalendarIcon size={15} />}
            />
          </View>
        </Pressable>

        <Pressable
          onPress={() => {
            setShowTimePicker(true);
          }}>
          <View pointerEvents="none">
            <TextField
              placeholder="Birth Time:"
              value={formatTime(watchedTime)}
              style={styles.textField}
              editable={false}
              rightIcon={<ClockIcon />}
            />
          </View>
        </Pressable>

        <Text style={styles.helpText}>
          (Not sure about your birth time? Just go with your closest guess.)
        </Text>

        <DropdownButton
          onPress={() => setShowCountryModal(true)}
          text={watchedCountry?.name || 'Please select one'}
        />

        <DropdownButton
          onPress={() => setShowCityModal(true)}
          text={watchedCity?.name || 'Please select one'}
        />
      </View>

      <AppButton
        title="Save"
        onPress={handleSubmit(onSubmit)}
        style={styles.saveButton}
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
      {renderDropdownModal(
        showCountryModal,
        () => setShowCountryModal(false),
        'Select Country',
        countries,
        selectCountry,
        watchedCountry,
        'iso3'
      )}

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

    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#777',
    marginBottom: 32,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  formContainer: {
    width: '100%',
    marginBottom: 32,
    gap: 12
  },
  textField: {
    width: '100%',
  },
  marginedTextField: {
    width: '100%',
    marginBottom: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  saveButton: {
    width: '100%',
  },
  calendarIcon: {
    padding: 4,
  },
  calendarText: {
    fontSize: 18,
  },
  timeIcon: {
    padding: 4,
  },
  timeText: {
    fontSize: 18,
  },
});

export default Onboarding;
