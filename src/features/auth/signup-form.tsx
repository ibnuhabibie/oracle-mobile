import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import api from "../../utils/http";
import TextField from "../../components/ui/text-field";
import EyeCrossedIcon from "../../components/icons/EyeCrossed";
import EyeIcon from "../../components/icons/Eye";
import { AppButton } from "../../components/ui/app-button";
import { AuthFormProps } from "./signin-form";

const SignUpForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            full_name: '',
            email: '',
            password: '',
            confirm_password: '',
            referral_code: '',
        },
    });

    const formRules = {
        full_name: {
            required: 'Name is required',
            minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
            }
        },
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
        },
        confirm_password: {
            required: 'Please confirm your password',
            validate: (value: string) =>
                value === getValues('password') || 'Passwords do not match'
        }
    };


    const onSubmit = async (data: any) => {
        try {
            console.log('Sign up data:', data);
            const res = await api.post('/v1/users/register', data)
            await AsyncStorage.setItem('auth_token', res.data.token);

            // navigation.navigate('Otp', { email: res.data.email });
            onSuccess(res.data.email)
        } catch (error) {
            Alert.alert('Login Failed', error.meta.message)
            console.log(error)
        }
    };

    return (
        <>
            <View style={{ flexDirection: 'column', gap: 12 }}>
                <View>
                    <Controller
                        control={control}
                        name="full_name"
                        rules={formRules.full_name}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                                placeholder="Name"
                                onBlur={onBlur}
                                onChangeText={onChange}
                                value={value}
                                style={[errors.full_name && styles.inputError]}
                            />
                        )}
                    />
                    {errors.full_name && (
                        <Text style={styles.errorText}>{errors.full_name.message}</Text>
                    )}
                </View>
                <View>
                    <Controller
                        control={control}
                        name="email"
                        rules={formRules.email}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                                placeholder="Email"
                                value={value}
                                onChangeText={onChange}
                                style={[errors.email && styles.inputError]}
                                keyboardType="email-address"
                            />
                        )}
                    />
                    {errors.email && (
                        <Text style={styles.errorText}>{errors.email.message}</Text>
                    )}
                </View>
                <View>
                    <Controller
                        control={control}
                        name="password"
                        rules={formRules.password}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                                placeholder="Password"
                                value={value}
                                onChangeText={onChange}
                                style={[errors.password && styles.inputError]}
                                secureTextEntry={!showPassword}
                                rightIcon={
                                    <Pressable onPress={() => setShowPassword(prev => !prev)}>
                                        {showPassword ? (
                                            <EyeCrossedIcon size={20} />
                                        ) : (
                                            <EyeIcon size={20} />
                                        )}
                                    </Pressable>
                                }
                            />
                        )}
                    />
                    {errors.password && (
                        <Text style={styles.errorText}>{errors.password.message}</Text>
                    )}
                </View>
                <View>
                    <Controller
                        control={control}
                        name="confirm_password"
                        rules={formRules.confirm_password}
                        render={({ field: { value, onChange, onBlur } }) => (
                            <TextField
                                placeholder="Confirm Password"
                                value={value}
                                onChangeText={onChange}
                                style={[errors.confirm_password && styles.inputError]}
                                secureTextEntry={!showConfirmPassword}
                                rightIcon={
                                    <Pressable
                                        onPress={() => setShowConfirmPassword(prev => !prev)}>
                                        {showConfirmPassword ? (
                                            <EyeCrossedIcon size={20} />
                                        ) : (
                                            <EyeIcon size={20} />
                                        )}
                                    </Pressable>
                                }
                            />
                        )}
                    />
                    {errors.confirm_password && (
                        <Text style={styles.errorText}>{errors.confirm_password.message}</Text>
                    )}
                </View>
                <View>
                    <Controller
                        control={control}
                        name="referral_code"
                        render={({ field: { value, onChange } }) => (
                            <TextField
                                placeholder="Referral Code"
                                value={value}
                                onChangeText={onChange}
                            />
                        )}
                    />
                </View>
            </View>

            <AppButton
                title="Create Account"
                onPress={handleSubmit(onSubmit)}
                style={styles.signInButton}
            />
        </>
    )
}

const styles = StyleSheet.create({
    signInButton: {
        marginTop: 12,
        width: '100%',
    },
    inputError: {
        borderColor: 'red'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        padding: 4
    }
});


export default SignUpForm;