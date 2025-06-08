import React from 'react';
import { View, StyleSheet, KeyboardTypeOptions, ViewStyle, TextStyle } from 'react-native';
import { Control, Controller, FieldValues, Path, RegisterOptions, FieldErrors } from 'react-hook-form';

import { AppText } from './app-text';
import TextField from './text-field';


interface AppInputProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>; // Path ensures 'name' is a valid key from your form data
    rules?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    placeholder?: string;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    rightIcon?: React.ReactNode; // Or the specific type of your icon component
    label?: string;
    inputStyle?: ViewStyle | TextStyle | (ViewStyle | TextStyle)[]; // For internal TextField styling
    errors: FieldErrors<TFieldValues>; // Pass the whole errors object to read specific errors
}

// Re-export Text and TextField, assuming they are in the same directory, or import them directly.
// You might remove this if they are already imported from a different global component path.
// export { TextField, AppText }; // Only if you want to export them FROM this file.

function AppInput<TFieldValues extends FieldValues>({
    control,
    name,
    rules,
    placeholder,
    keyboardType,
    secureTextEntry,
    rightIcon,
    label,
    inputStyle,
    errors, // Receive the errors object
    ...restProps // Capture any other props you might want to pass to TextField
}: AppInputProps<TFieldValues>) {
    // Determine if there's an error for this specific field
    const fieldError = errors[name];

    return (
        <View style={styles.container}>
            {label && <AppText style={styles.label}>{label}</AppText>}
            <Controller
                control={control}
                name={name}
                rules={rules}
                render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                        placeholder={placeholder}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value as string} // Ensure value is a string for TextInput/TextField
                        style={[inputStyle, fieldError && styles.inputError]} // Apply error style
                        keyboardType={keyboardType}
                        secureTextEntry={secureTextEntry}
                        rightIcon={rightIcon}
                        {...restProps} // Pass any other props through to TextField
                    />
                )}
            />
            {fieldError && (
                <AppText style={styles.errorText}>{fieldError.message as string}</AppText> // Cast message to string
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12, // Add some vertical spacing between fields
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 5, // Indent error message slightly
    },
});

export default AppInput;