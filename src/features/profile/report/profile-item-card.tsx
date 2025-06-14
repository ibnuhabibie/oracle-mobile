import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ShinyContainer from '../../../components/widgets/ShinyContainer';

type ProfileItemCardData = {
    icon?: React.ReactNode;
    title: string;
    subtitle?: string;
    description: string | string[];
};

type ProfileItemCardProps = {
    data: ProfileItemCardData;
};

const ProfileItemCard: React.FC<ProfileItemCardProps> = ({ data }) => {
    // Ensure description is always an array for mapping
    const descArray = Array.isArray(data.description) ? data.description : [data.description];

    return (
        <View style={styles.card}>
            <ShinyContainer dark={false} size={240}>
                {data.icon}
            </ShinyContainer>
            <Text style={styles.sectionTitle}>{data.title}</Text>
            {data.subtitle ? <Text style={styles.sectionSubtitle}>{data.subtitle}</Text> : null}
            {descArray.map((desc, idx) => (
                <Text style={styles.sectionDescription} key={idx}>
                    {desc}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        marginBottom: 16,
        marginTop: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Archivo-Light',
        color: '#D4A574',
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    sectionSubtitle: {
        fontSize: 14,
        fontFamily: 'Archivo-Light',
        color: '#999',
        textAlign: 'center',
        marginBottom: 16,
        fontStyle: 'italic',
    },
    sectionDescription: {
        fontSize: 14,
        fontFamily: 'Archivo-Light',
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 12,
    },
});

export default ProfileItemCard;
