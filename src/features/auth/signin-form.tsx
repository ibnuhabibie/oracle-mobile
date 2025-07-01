import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, View, Platform } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from 'react-native';
import notifee from "@notifee/react-native";

import api from "../../utils/http";
import EyeCrossedIcon from "../../components/icons/auth/eye-crossed-icon";
import EyeIcon from "../../components/icons/profile/eye-icon";
import TextField from "../../components/ui/text-field";
import { AppText } from "../../components/ui/app-text";
import { AppButton } from "../../components/ui/app-button";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";

interface LoginDTO {
    email: string;
    password: string;
    fcm_token?: string;
    locale?: string;
    additional_info?: any;
}

export interface AuthFormProps {
    onSuccess: (email: string) => void;
}

const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {

    const [showPassword, setShowPassword] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const init = async () => {
            const status = await notifee.requestPermission();
            console.log(status)
        }
        init()
    }, [])

    const formRules = {
        email: {
            required: t('EMAIL IS REQUIRED'),
            pattern: {
                value: /^\S+@\S+$/i,
                message: t('INVALID EMAIL FORMAT')
            }
        },
        password: {
            required: t('PASSWORD IS REQUIRED'),
            minLength: {
                value: 6,
                message: t('PASSWORD MIN LENGTH')
            }
        }
    }

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginDTO>({
        defaultValues: {
            email: 'john@example.com',
            password: 'password123',
        },
    });

    const onSubmit = async (data: LoginDTO) => {
        try {
            const locale = await AsyncStorage.getItem('language') || 'en';
            console.log(locale)

            // Gather device info
            const deviceBrand = DeviceInfo.getBrand();
            const deviceModel = DeviceInfo.getModel();
            const systemVersion = DeviceInfo.getSystemVersion();
            const uniqueId = DeviceInfo.getUniqueId();
            const appVersion = DeviceInfo.getVersion();

            // Get FCM token
            let fcmToken = '';
            try {
                await messaging().registerDeviceForRemoteMessages();
                fcmToken = await messaging().getToken();
                console.log(fcmToken)
            } catch (e) {
                console.log('Failed to get FCM token:', e);
            }

            const res = await api.post('/v1/users/auth/login', {
                ...data,
                locale,
                fcm_token: fcmToken,
                additional_info: {
                    os: Platform.OS,
                    brand: deviceBrand,
                    model: deviceModel,
                    system_version: systemVersion,
                    unique_id: uniqueId,
                    app_version: appVersion,
                }
            });

            await AsyncStorage.setItem('auth_token', res.data.token);
            await AsyncStorage.setItem('user_profile', JSON.stringify(res.data));

            onSuccess(res.data);
        } catch (error) {
            let message = '';
            if (typeof error === 'object' && error && 'meta' in error && typeof (error as any).meta?.message === 'string') {
                message = (error as any).meta.message;
            } else {
                message = t('LOGIN FAILED');
            }
            Alert.alert(t('LOGIN FAILED'), message);
            console.log(error);
        }
    };

    return (
        <View>
            <View style={{ flexDirection: 'column', gap: 12 }}>
                <AppInput<LoginDTO>
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder={t('EMAIL')}
                    keyboardType="email-address"
                    errors={errors}
                />
                <AppInput<LoginDTO>
                    control={control}
                    name="password"
                    rules={formRules.password}
                    placeholder={t('PASSWORD')}
                    secureTextEntry={!showPassword}
                    errors={errors}
                    rightIcon={
                        <PasswordToggle
                            onToggle={() => setShowPassword(prev => !prev)}
                            showPassword={showPassword} />
                    }
                />
            </View>

            <AppButton
                title={t('SIGN IN')}
                onPress={handleSubmit(onSubmit)}
                style={styles.signInButton}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    signInButton: {
        marginTop: 12,
        width: '100%',
    },
});

export default SignInForm;
