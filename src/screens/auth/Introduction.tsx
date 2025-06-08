/* eslint-disable react-native/no-inline-styles */
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {useForm} from 'react-hook-form';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import CalendarIcon from '../../components/icons/Calendar';
import ClockIcon from '../../components/icons/Clock';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import {Button} from '../../components/ui/button';
import TextField from '../../components/ui/text-field';
import {
  DropdownButton,
  renderDropdownModal,
} from '../../components/widgets/Dropdown';
import {CITIES, COUNTRIES} from '../../constants/countries';
import {fontFamilies} from '../../constants/fonts';
import {MainNavigatorParamList} from '../../navigators/MainNavigator';
import {formatDate, formatTime} from '../../utils/formatter';

interface FormData {
  dateOfBirth: Date;
  timeOfBirth: Date;
  countryOfBirth: string;
  cityOfBirth: string;
}

const Introduction: FC<{
  navigation: NativeStackNavigationProp<MainNavigatorParamList, 'Introduction'>;
}> = ({navigation}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const {handleSubmit, setValue, watch} = useForm<FormData>({
    defaultValues: {
      dateOfBirth: new Date(),
      timeOfBirth: new Date(),
      countryOfBirth: '',
      cityOfBirth: '',
    },
  });

  const watchedCountry = watch('countryOfBirth');
  const watchedCity = watch('cityOfBirth');
  const watchedDate = watch('dateOfBirth');
  const watchedTime = watch('timeOfBirth');

  const onSubmit = (data: FormData) => {
    console.log('Introduce yourself data:', data);
    // Handle form submission logic
    navigation.push('MbtiQuiz');
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('dateOfBirth', selectedDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setValue('timeOfBirth', selectedTime);
    }
  };

  const selectCountry = (country: string) => {
    setValue('countryOfBirth', country);
    // Reset city when country changes
    const cities = CITIES[country as keyof typeof CITIES] || [];
    if (cities.length > 0) {
      setValue('cityOfBirth', cities[0]);
    } else {
      setValue('cityOfBirth', '');
    }
    setShowCountryModal(false);
  };

  const selectCity = (city: string) => {
    setValue('cityOfBirth', city);
    setShowCityModal(false);
  };

  return (
    <ScreenContainer style={{marginTop: 44}}>
      <Text style={styles.title}>Introduce yourself</Text>
      <Text style={styles.subtitle}>
        Introduce yourself and let the universe guide you!
      </Text>

      <View style={styles.formContainer}>
        {/* Birth Date Field */}
        <Text style={styles.label}>Birth Date</Text>
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

        {/* Birth Time Field */}
        <Text style={styles.label}>Birth Time</Text>
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

        <Text style={styles.label}>Country of Birth</Text>
        <DropdownButton
          onPress={() => setShowCountryModal(true)}
          text={watchedCountry || 'Please select one'}
        />

        <Text style={styles.label}>City of Birth</Text>
        <DropdownButton
          onPress={() => setShowCityModal(true)}
          text={watchedCity || 'Please select one'}
        />
      </View>

      <Button
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
        COUNTRIES,
        selectCountry,
        watchedCountry,
      )}

      {/* City Modal */}
      {renderDropdownModal(
        showCityModal,
        () => setShowCityModal(false),
        'Select City',
        CITIES[watchedCountry as keyof typeof CITIES] || [],
        selectCity,
        watchedCity,
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

export default Introduction;
