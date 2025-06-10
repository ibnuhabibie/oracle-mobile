import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { useRoute } from '@react-navigation/native';

import { APP_URL } from '@env';

import ScreenContainer from '../../components/layouts/ScreenContainer';
import { MainNavigatorParamList } from '../../navigators/types';
import ArrowIcon from '../../components/icons/Arrow';
import { AppText } from '../../components/ui/app-text';

type WebviewContentProps = NativeStackScreenProps<MainNavigatorParamList, 'WebviewContent'>;

const WebviewContent: FC<WebviewContentProps> = ({ navigation }) => {
    const route = useRoute();

    return (
        <ScreenContainer>
            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}>
                    <ArrowIcon />
                </Pressable>
                <AppText variant='subtitle2'>{route?.params.title}</AppText>
            </View>
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
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
});

export default WebviewContent;
