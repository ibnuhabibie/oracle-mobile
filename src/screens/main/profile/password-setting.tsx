import React, {FC, useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainNavigatorParamList} from '../../../navigators/main-navigator';
import {ScreenContainer} from 'react-native-screens';

const PasswordSetting: FC<{
  navigation: NativeStackNavigationProp<
    MainNavigatorParamList,
    'PasswordSetting'
  >;
}> = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    // Add logic for changing the password here
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.header}>Password Settings</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry={!showCurrentPassword}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TouchableOpacity
            onPress={() => setShowCurrentPassword(prev => !prev)}>
            <Text>{showCurrentPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={!showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(prev => !prev)}>
            <Text>{showNewPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(prev => !prev)}>
            <Text>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        <Button
          title="Change Password"
          onPress={handleChangePassword}
          color="#D9B99B"
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    padding: 10,
  },
});

export default PasswordSetting;
