/* eslint-disable react-native/no-inline-styles */
import DateTimePicker from '@react-native-community/datetimepicker';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import ArrowIcon from '../../../components/icons/Arrow';
import CalendarIcon from '../../../components/icons/Calendar';
import ClockIcon from '../../../components/icons/Clock';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import {Button} from '../../../components/ui/button';
import TextField from '../../../components/ui/text-field';
import {
  DropdownButton,
  renderDropdownModal,
} from '../../../components/widgets/Dropdown';
import {COLORS} from '../../../constants/colors';
import {CITIES, COUNTRIES} from '../../../constants/countries';
import {fontFamilies} from '../../../constants/fonts';
import {formatDate, formatTime} from '../../../utils/formatter';

interface FormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  timeOfBirth: Date;
  gender: 'male' | 'female';
  countryOfBirth: string;
  cityOfBirth: string;
}

const EditProfile: FC<{
  navigation: NativeStackNavigationProp<any, 'EditProfile'>;
}> = ({navigation}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);

  const {control, handleSubmit, watch, setValue} = useForm<FormData>({
    defaultValues: {
      fullName: 'Jessica Carl',
      email: 'jessicarl@gmail.com',
      phoneNumber: '6588841234',
      dateOfBirth: new Date(1994, 4, 10), // May 10, 1994
      timeOfBirth: new Date(2024, 0, 1, 10, 0), // 10:00 AM
      gender: 'female',
      countryOfBirth: 'Singapore',
      cityOfBirth: 'Singapore',
    },
  });

  const watchedCountry = watch('countryOfBirth');
  const watchedCity = watch('cityOfBirth');
  const watchedDate = watch('dateOfBirth');
  const watchedTime = watch('timeOfBirth');
  const watchedGender = watch('gender');

  const onSubmit = (data: FormData) => {
    console.log('Profile data:', data);
    // Handle save logic here
    navigation.goBack();
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
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <ScrollView
        style={{flex: 1, width: '100%'}}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 32}}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <Controller
            control={control}
            name="fullName"
            render={({field: {value, onChange}}) => (
              <TextField
                placeholder="Full Name"
                value={value}
                onChangeText={onChange}
                style={styles.textField}
              />
            )}
          />

          <Text style={styles.label}>Email Address</Text>
          <Controller
            control={control}
            name="email"
            render={({field: {value, onChange}}) => (
              <TextField
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                style={styles.textField}
                keyboardType="email-address"
              />
            )}
          />

          <Text style={styles.label}>Phone Number</Text>
          <Controller
            control={control}
            name="phoneNumber"
            render={({field: {value, onChange}}) => (
              <TextField
                placeholder="Phone Number"
                value={value}
                onChangeText={onChange}
                style={styles.textField}
                keyboardType="phone-pad"
              />
            )}
          />

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

          <Text style={styles.helperText}>
            (Not sure about your birth time? Just go with your closest guess.)
          </Text>

          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioContainer}>
            <Pressable
              style={styles.radioButton}
              onPress={() => setValue('gender', 'male')}>
              <View style={styles.radioCircle}>
                {watchedGender === 'male' && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>Male</Text>
            </Pressable>
            <Pressable
              style={styles.radioButton}
              onPress={() => setValue('gender', 'female')}>
              <View style={styles.radioCircle}>
                {watchedGender === 'female' && (
                  <View style={styles.radioSelected} />
                )}
              </View>
              <Text style={styles.radioText}>Female</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Country of Birth</Text>
          <DropdownButton
            onPress={() => setShowCountryModal(true)}
            text={watchedCountry || ''}
          />

          <Text style={styles.label}>City of Birth</Text>
          <DropdownButton
            onPress={() => setShowCityModal(true)}
            text={watchedCity || 'None'}
          />
        </View>

        <Button
          title="Save"
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}
        />
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 20,
    textAlign: 'center',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
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
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#f9f9f9',
  },
  dateTimeText: {
    fontSize: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: COLORS.black,
  },
  dateTimeIcon: {
    fontSize: 16,
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
  saveButton: {
    width: '100%',
    backgroundColor: '#c1976b',
    marginTop: 8,
  },
});

export default EditProfile;
