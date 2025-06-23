import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

// i18n
import { useTranslation } from "react-i18next";

import { APP_URL } from '@env';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { MainNavigatorParamList } from '../../navigators/types';
import ArrowIcon from '../../components/icons/Arrow';
import { AppText } from '../../components/ui/app-text';
import { fontFamilies } from '../../constants/fonts';
import { COLORS } from '../../constants/colors';

type WebviewContentProps = NativeStackScreenProps<MainNavigatorParamList, 'WebviewContent'>;

const WebviewContent: FC<WebviewContentProps> = ({ navigation }) => {
    const route = useRoute();
    const { t } = useTranslation();

    return (
        <ScreenContainer
            header={
                <View style={styles.header}>
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}>
                        <ArrowIcon />
                    </Pressable>
                    <AppText variant='subtitle2' style={styles.headerTitle}>{t(route?.params?.title)}</AppText>
                </View>
            }
        >
            <WebView
                source={{ uri: route.params?.uri || APP_URL }}
                style={styles.container}
                javaScriptEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator
                        color="#000000"
                        size="large"
                        style={StyleSheet.absoluteFill}
                    />
                )}
            />
        </ScreenContainer>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        paddingLeft: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        backgroundColor: COLORS.white,
        paddingTop: 8,
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
});

export default WebviewContent;
