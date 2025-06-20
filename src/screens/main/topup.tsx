import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, ActivityIndicator } from 'react-native';

import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/ScreenContainer';
import ArrowIcon from '../../components/icons/Arrow';
import { AppText } from '../../components/ui/app-text';
import api from '../../utils/http';

type TopupProps = NativeStackScreenProps<MainNavigatorParamList, 'Topup'>;

interface PackageItem {
    package_id: number;
    name: string;
    description: string;
    price: string;
    credits: number;
    is_active: boolean;
}

interface SubscriptionItem {
    subscription_id: number;
    name: string;
    description: string;
    price: string;
    duration_months: number;
    credits: number;
    is_active: boolean;
}

const CoinIcon = () => (
    <View style={{
        width: 16, height: 16, borderRadius: 8, backgroundColor: '#FFD700',
        alignItems: 'center', justifyContent: 'center', marginRight: 2
    }}>
        <AppText style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>🪙</AppText>
    </View>
);

const RadioIndicator = ({ selected }: { selected: boolean }) => (
    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
        {selected ? <View style={styles.radioInner} /> : null}
    </View>
);

const Topup: FC<TopupProps> = ({ navigation }) => {
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
    const [selectedSubscription, setSelectedSubscription] = useState<number | null>(null);
    const [packages, setPackages] = useState<PackageItem[]>([]);
    const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
    const [loadingPackages, setLoadingPackages] = useState<boolean>(true);
    const [loadingSubscriptions, setLoadingSubscriptions] = useState<boolean>(true);
    const [errorPackages, setErrorPackages] = useState<string | null>(null);
    const [errorSubscriptions, setErrorSubscriptions] = useState<string | null>(null);

    useEffect(() => {
        const fetchPackages = async () => {
            setLoadingPackages(true);
            setErrorPackages(null);
            try {
                const response = await api.get('/v1/packages');
                setPackages(response.data.rows || []);
            } catch (err) {
                setErrorPackages('Failed to load packages. Please try again later.');
            } finally {
                setLoadingPackages(false);
            }
        };
        fetchPackages();
    }, []);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            setLoadingSubscriptions(true);
            setErrorSubscriptions(null);
            try {
                const response = await api.get('/v1/subscriptions');
                setSubscriptions(response.data.rows || []);
            } catch (err) {
                setErrorSubscriptions('Failed to load subscriptions. Please try again later.');
            } finally {
                setLoadingSubscriptions(false);
            }
        };
        fetchSubscriptions();
    }, []);

    return (
        <ScreenContainer scrollable={true}>
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <ArrowIcon />
                </Pressable>
                <AppText variant='subtitle2'>Top Up</AppText>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                {/* Packages */}
                <View style={{ marginBottom: 24 }}>
                    <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>Our Packages</AppText>
                    <AppText style={styles.sectionDesc}>Can be used to purchase Reports and Ask Oracle AI</AppText>
                    <View style={{ marginTop: 12 }}>
                        {loadingPackages ? (
                            <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: 16 }} />
                        ) : errorPackages ? (
                            <AppText style={{ color: 'red', marginVertical: 16 }}>{errorPackages}</AppText>
                        ) : (
                            packages.map(pkg => (
                                <Pressable
                                    key={pkg.package_id}
                                    style={[
                                        styles.card,
                                        selectedPackage === pkg.package_id && styles.cardSelected
                                    ]}
                                    onPress={() => setSelectedPackage(pkg.package_id)}
                                >
                                    <RadioIndicator selected={selectedPackage === pkg.package_id} />
                                    <View style={{ flex: 1 }}>
                                        <AppText style={styles.cardTitle}>{pkg.name}</AppText>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <AppText style={styles.cardSubtitle}>Get {pkg.credits} </AppText>
                                            <CoinIcon />
                                        </View>
                                        {pkg.description ? (
                                            <AppText style={[styles.cardSubtitle, { marginTop: 2 }]}>{pkg.description}</AppText>
                                        ) : null}
                                    </View>
                                    <AppText style={styles.cardPrice}>${parseFloat(pkg.price)}</AppText>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
                {/* Subscriptions */}
                <View>
                    <AppText variant='subtitle1' color='primary' style={styles.sectionTitle}>Our Subscriptions</AppText>
                    <AppText style={styles.sectionDesc}>
                        Can be used in Ask Oracle AI and reset at the beginning of each month. You'll receive 3 silver coins free every month.
                    </AppText>
                    <View style={{ marginTop: 12 }}>
                        {loadingSubscriptions ? (
                            <ActivityIndicator size="small" color="#D4A574" style={{ marginVertical: 16 }} />
                        ) : errorSubscriptions ? (
                            <AppText style={{ color: 'red', marginVertical: 16 }}>{errorSubscriptions}</AppText>
                        ) : (
                            subscriptions.map(sub => (
                                <Pressable
                                    key={sub.subscription_id}
                                    style={[
                                        styles.card,
                                        selectedSubscription === sub.subscription_id && styles.cardSelected
                                    ]}
                                    onPress={() => setSelectedSubscription(sub.subscription_id)}
                                >
                                    <RadioIndicator selected={selectedSubscription === sub.subscription_id} />
                                    <View style={{ flex: 1 }}>
                                        <AppText style={styles.cardTitle}>{sub.name}</AppText>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                                            <AppText style={styles.cardSubtitle}>Get {sub.credits} </AppText>
                                            <CoinIcon />
                                        </View>
                                        {sub.description ? (
                                            <AppText style={[styles.cardSubtitle, { marginTop: 2 }]}>{sub.description}</AppText>
                                        ) : null}
                                    </View>
                                    <AppText style={styles.cardPrice}>${parseFloat(sub.price)}</AppText>
                                </Pressable>
                            ))
                        )}
                    </View>
                </View>
            </ScrollView>
        </ScreenContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    sectionTitle: {
        marginBottom: 2,
    },
    sectionDesc: {
        color: '#888',
        fontSize: 13,
        marginBottom: 2,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        padding: 16,
        marginBottom: 12,
    },
    cardSelected: {
        borderColor: '#D4A574',
        backgroundColor: '#FDF7F0',
    },
    cardBestValue: {
        borderColor: '#D4A574',
        backgroundColor: '#FDF7F0',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#222',
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#888',
    },
    cardPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D4A574',
        marginLeft: 12,
    },
    cardOriginalPrice: {
        fontSize: 13,
        color: '#B0B0B0',
        textDecorationLine: 'line-through',
        marginRight: 6,
    },
    cardNote: {
        fontSize: 11,
        color: '#B0B0B0',
        marginTop: 2,
        textAlign: 'right',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E5E5E5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        backgroundColor: '#fff',
    },
    radioOuterSelected: {
        borderColor: '#D4A574',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#D4A574',
    },
    bestValueBadge: {
        backgroundColor: '#F5E1C6',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    bestValueText: {
        color: '#D4A574',
        fontSize: 11,
        fontWeight: 'bold',
    },
});

export default Topup;
