import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - @env module types are handled by react-native-config
import { API_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import { Platform, Alert, Linking, PermissionsAndroid, ToastAndroid } from 'react-native';
import Base64 from 'react-native-base64';
import i18n from '../locales/i18n';
import Purchases from 'react-native-purchases';
import { navigationRef } from '../navigators/navigation-ref';
import type { UserProfile, TranslationFunction, ApiErrorResponse } from './types';
import * as Sentry from '@sentry/react-native';

// If @env import fails, fallback to a hardcoded string:
// const API_BASE_URL = 'https://your-api-base-url.com';

// Shared axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add user_id as a query parameter if available
    const user = await AsyncStorage.getItem('user_profile');
    let userData: Partial<UserProfile> | undefined;
    if (user) {
      try {
        userData = JSON.parse(user) as Partial<UserProfile>;
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
  (error) => Promise.reject(error),
);

async function handleLogoutAndRedirect(): Promise<void> {
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
    return response?.data;
  },
  async (error) => {
    console.error('[Axios Error]', error.message);
    console.error(error.config);
    console.error(error.code);
    
    Sentry.captureException(error);
    Sentry.addBreadcrumb({
      category: 'api',
      message: `API Error: ${error.config?.url}`,
      level: 'error',
      data: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
      },
    });
    
    if (error.response) {
      console.error('[Response Error Data]', error.response.data);
      const errorData = error.response.data as Partial<ApiErrorResponse>;
      if (
        error.response.status === 401 &&
        errorData?.meta?.message === 'Unauthorized'
      ) {
        await handleLogoutAndRedirect();
      }
    }
    return Promise.reject(error.response?.data);
  },
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

const showFallback = (fileName: string): void => {
  Alert.alert(
    i18n.t('fortuneReportResult.downloadComplete'),
    i18n.t('fortuneReportResult.couldNotOpenFolder', { fileName }),
  );
};

export const downloadPdf = async (
  job_id: string,
  t: TranslationFunction,
  openAfterDownload: boolean = true,
): Promise<void> => {
  const url = `${API_BASE_URL}/uploads/reports/${job_id}.pdf`;
  const { fs, config } = ReactNativeBlobUtil;

  const fileName = `Report-${Date.now()}.pdf`;
  const dir =
    Platform.OS === 'android'
      ? fs.dirs.DownloadDir
      : fs.dirs.DocumentDir;
  const path = `${dir}/${fileName}`;

  try {
    await config({
      fileCache: true,
      path,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        mime: 'application/pdf',
        title: fileName,
        description: i18n.t('fortuneReportResult.downloadingPdf'),
        path,
      },
    }).fetch('GET', url);

    Alert.alert(
      i18n.t('fortuneReportResult.downloadComplete'),
      i18n.t('fortuneReportResult.savedTo', { path }),
    );
  } catch (e) {
    console.log('Download error', e);
    const errorMessage = e instanceof Error ? e.toString() : 'Download failed';
    Alert.alert(t('relationReportResult.downloadFailed'), errorMessage);
  }
};

// Utility: Download PDF and optionally open it
export async function oldDownloadPdf(
  job_id: string,
  t: TranslationFunction,
  openAfterDownload: boolean = true,
): Promise<string> {
  try {
    const url = `${API_BASE_URL}/uploads/reports/${job_id}.pdf`;
    console.log(url);
    // Use axios.get directly for binary download to avoid interceptors
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const isIOS = Platform.OS === 'ios';
    // For Android 10+, use app's document directory to avoid permission issues
    // For older Android, still try DownloadDirectory with permission
    const fileDir = isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath;
    const filePath = `${fileDir}/${job_id}.pdf`;

    console.log('[downloadPdf] File path:', filePath);

    // Android: request storage permission before writing file
    if (!isIOS) {
      try {
        const platformVersion = parseInt(Platform.Version as string, 10);
        console.log('[downloadPdf] Platform version:', platformVersion);

        // For Android 10+ (API 29+), use DocumentDirectoryPath which doesn't require permissions
        // For Android 9 and below, request storage permission
        if (platformVersion >= 29) {
          console.log('[downloadPdf] Android 10+ detected, using scoped storage');
        } else {
          // Check if we need permission
          const hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );

          console.log('[downloadPdf] Storage permission check:', hasPermission);

          if (!hasPermission) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: t('relationReportResult.downloadPermissionTitle'),
                message: t('relationReportResult.downloadPermissionMessage'),
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );

            console.log('[downloadPdf] Permission request result:', granted);

            if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
              ToastAndroid.show(
                t('relationReportResult.downloadPermissionDenied'),
                ToastAndroid.LONG,
              );
              throw new Error('Permission permanently denied');
            } else if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              ToastAndroid.show(
                t('relationReportResult.downloadPermissionDenied'),
                ToastAndroid.LONG,
              );
              throw new Error('Permission denied');
            }
          }
        }
      } catch (err) {
        console.error('[downloadPdf] Permission error:', err);
        ToastAndroid.show(
          t('relationReportResult.downloadPermissionError'),
          ToastAndroid.LONG,
        );
        throw err;
      }
    }

    const base64Data = arrayBufferToBase64(response.data);
    await RNFS.writeFile(filePath, base64Data, 'base64');

    if (openAfterDownload) {
      const supported = await Linking.canOpenURL(`file://${filePath}`);

      if (supported) {
        await Linking.openURL(`file://${filePath}`);
      } else {
        // Fallback if opening the directory fails
        console.log(
          '[downloadPdf] Cannot open file directly, showing fallback alert',
          supported,
          filePath,
        );
        showFallback(filePath);
      }
    }

    return filePath;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.toString() : 'Download failed';
    Alert.alert(t('relationReportResult.downloadFailed'), errorMessage);
    console.log(error);
    throw error;
  }
}

export default api;
