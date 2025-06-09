import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert, StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import api from "../../utils/http";
import EyeCrossedIcon from "../../components/icons/EyeCrossed";
import EyeIcon from "../../components/icons/Eye";
import TextField from "../../components/ui/text-field";
import { AppText } from "../../components/ui/app-text";
import { AppButton } from "../../components/ui/app-button";
import AppInput from "../../components/ui/app-input";
import PasswordToggle from "../../components/ui/password-toggle";

interface LoginDTO {
    email: string;
    password: string
}

export interface AuthFormProps {
    onSuccess: (email: string) => void;
}

const SignInForm: React.FC<AuthFormProps> = ({ onSuccess }) => {

    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            email: 'john@example.com',
            password: 'password123',
        },
    });

    const formRules = {
        email: {
            required: 'Email is required',
            pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email format'
            }
        },
        password: {
            required: 'Password is required',
            minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
            }
        }
    }

    const onSubmit = async (data: LoginDTO) => {
        try {
            console.log('Sign in data:', data);
            const res = await api.post('/v1/users/auth/login', data)

            console.log(res)
            await AsyncStorage.setItem('auth_token', res.data.token);

            onSuccess(res.data.email)
        } catch (error) {
            Alert.alert('Login Failed', error.meta.message)
            console.log(error)
        }
    };

    return (
        <View>
            <View style={{ flexDirection: 'column', gap: 12 }}>
                <AppInput<LoginDTO>
                    control={control}
                    name="email"
                    rules={formRules.email}
                    placeholder="Email"
                    keyboardType="email-address"
                    errors={errors}
                />
                <AppInput<LoginDTO>
                    control={control}
                    name="password"
                    rules={formRules.password}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    errors={errors} // Pass the errors object
                    rightIcon={
                        <PasswordToggle
                            onToggle={() => setShowPassword(prev => !prev)}
                            showPassword={showPassword} />
                    }
                />
            </View>

            <AppButton
                title="Sign In"
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