import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, View, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";

import api from "../../utils/http";
import { AppButton } from "../../components/ui/app-button";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";
import { useAsyncStorage } from "../../hooks/use-storage";
import { COLORS } from "../../constants/colors";

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
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { setAuthToken, sync } = useAsyncStorage();

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
        setLoading(true);
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

            await setAuthToken(res.data.token);
            await sync();

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
        } finally {
            setLoading(false);
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
                    inputStyle={styles.appInput}
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
                    inputStyle={styles.appInput}

                />
            </View>

            <AppButton
                title={t('SIGN IN')}
                onPress={handleSubmit(onSubmit)}
                style={styles.signInButton}
                loading={loading}
                disabled={loading}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    signInButton: {
        marginTop: 12,
        width: '100%',
    },
    appInput: {
        borderColor: COLORS['light-gray'],
        color: COLORS.red
    }
});

export default SignInForm;
