// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - @env module types are handled by react-native-config
import { API_BASE_URL } from '@env';

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { Platform, Alert, ToastAndroid } from 'react-native';
import Purchases from 'react-native-purchases';
import * as Sentry from '@sentry/react-native';

import i18n from '../locales/i18n';
import { navigationRef } from '../navigators/navigation-ref';
import type { UserProfile, TranslationFunction, ApiErrorResponse } from './types';

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

export default api;
