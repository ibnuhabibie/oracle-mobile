import axios from 'axios';

import { API_BASE_URL } from '@env';
// If @env import fails, fallback to a hardcoded string:
// const API_BASE_URL = 'https://your-api-base-url.com';

import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import { Platform, Alert, Linking, PermissionsAndroid, ToastAndroid } from 'react-native';
import Base64 from 'react-native-base64';
import i18n from '../locales/i18n';

// Shared axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
    }
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // Add user_id as a query parameter if available
        const user = await AsyncStorage.getItem('user_profile');
        let userData;
        if (user) {
            try {
                userData = JSON.parse(user);
            } catch (e) {
                userData = undefined;
            }
        }

        if (userData?.user_id) {
            if (!config.params) config.params = {};
            config.params.user_id = userData.user_id;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

import { navigationRef } from '../navigators/navigation-ref';
import Purchases from 'react-native-purchases';

async function handleLogoutAndRedirect() {
    try {
        await Purchases.logOut();
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('user_profile');
        // Add any other cleanup if needed
    } catch (e) {
        console.error('Error clearing AsyncStorage during logout', e);
    }
    // Inform user why redirected
    const sessionExpiredTitle = i18n.t('session.expiredTitle');
    const sessionExpiredMessage = i18n.t('session.expired');
    if (Platform.OS === 'android') {
        ToastAndroid.show(sessionExpiredMessage, ToastAndroid.LONG);
    } else {
        Alert.alert(sessionExpiredTitle, sessionExpiredMessage);
    }
    // Redirect to Welcome page and reset navigation stack
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    }
}

api.interceptors.response.use(
    (response) => {
        // console.log('[Axios Response]', response);
        return response?.data
    },
    async (error) => {
        console.error('[Axios Error]', error.message);
        console.error(error.config);
        console.error(error.code);
        if (error.response) {
            console.error('[Response Error Data]', error.response.data);
            if (
                error.response.status === 401 &&
                error.response.data?.meta?.message === "Unauthorized"
            ) {
                await handleLogoutAndRedirect();
            }
        }
        return Promise.reject(error.response?.data);
    }
);

// Utility: arrayBuffer to base64
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return Base64.encode(binary);
}

// Utility: Download PDF and optionally open it
export async function downloadPdf(job_id: string, t: Function, openAfterDownload: boolean = true) {
    try {
        const url = `${API_BASE_URL}/uploads/reports/${job_id}.pdf`;
        console.log(url)
        // Use axios.get directly for binary download to avoid interceptors
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const isIOS = Platform.OS === 'ios';
        const fileDir = isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
        const filePath = `${fileDir}/${job_id}.pdf`;

        // Android: request storage permission before writing file
        if (!isIOS) {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: t('relationReportResult.downloadPermissionTitle') || 'Storage Permission',
                        message: t('relationReportResult.downloadPermissionMessage') || 'App needs access to your storage to download the PDF.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    ToastAndroid.show(t('relationReportResult.downloadPermissionDenied') || 'Permission denied', ToastAndroid.LONG);
                    throw new Error('Permission denied');
                }
            } catch (err) {
                ToastAndroid.show(t('relationReportResult.downloadPermissionError') || 'Permission error', ToastAndroid.LONG);
                throw err;
            }
        }

        const base64Data = arrayBufferToBase64(response.data);
        await RNFS.writeFile(filePath, base64Data, 'base64');

        Alert.alert(
            t('relationReportResult.downloadSuccess'),
            t('relationReportResult.downloadedTo', { path: filePath })
        );

        if (openAfterDownload) {
            if (isIOS) {
                // For iOS, Linking.openURL should work for PDFs
                Linking.openURL(`file://${filePath}`);
                // If you want to use a dedicated viewer, consider RNDocumentViewer
            } else {
                // For Android, use react-native-open-file for best compatibility
                // Uncomment the following lines after installing react-native-open-file:
                // import OpenFile from 'react-native-open-file';
                // OpenFile.openDoc([{ url: filePath, fileName: `relation-report-${job_id}.pdf`, fileType: 'pdf', cache: false }], (error, url) => {});
                // If not installed, fallback to Linking.openURL (may not work on all devices)
                Linking.openURL(`file://${filePath}`);
            }
        }

        return filePath;
    } catch (error) {
        Alert.alert(
            t('relationReportResult.downloadFailed'),
            error?.toString() || 'Download failed'
        );
        console.log(error)
        throw error;
    }
}

export default api;
