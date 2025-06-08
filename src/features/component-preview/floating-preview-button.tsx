import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const FloatingPreviewButton = () => {
    const PREVIEW_MODE = true;
    
    const navigation = useNavigation();

    if (!PREVIEW_MODE) return null;

    return (
        <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => navigation.navigate('ComponentGallery' as never)}
        >
            <Text style={styles.text}>🔍 UI</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30,
        zIndex: 9999,
        opacity: 0.7,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
