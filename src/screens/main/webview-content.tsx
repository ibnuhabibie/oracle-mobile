import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import { useTranslation } from "react-i18next";

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { MainNavigatorParamList } from '../../navigators/types';
import Header from '../../components/ui/header';

type WebviewContentProps = NativeStackScreenProps<MainNavigatorParamList, 'WebviewContent'>;

const WebviewContent: FC<WebviewContentProps> = ({ navigation }) => {
    const route = useRoute();
    const { t } = useTranslation();

    return (
        <ScreenContainer
            fluid={true}
            header={
                <Header
                    title={t(route?.params?.title)}
                    onBack={() => navigation.goBack()}
                />
            }
        >
            <WebView
                source={{ uri: route.params?.uri }}
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
    container: {
        flex: 1,
    },
});

export default WebviewContent;
