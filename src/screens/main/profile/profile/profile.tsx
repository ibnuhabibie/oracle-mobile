import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import React, { FC, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Alert, Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-toast-message';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import Purchases from 'react-native-purchases';

import CoinIcon from '../../../../components/icons/profile/coin-icon';
import CommentUserIcon from '../../../../components/icons/profile/comment-user-icon';
import CopyIcon from '../../../../components/icons/profile/copy-icon';
import EyeIcon from '../../../../components/icons/profile/eye-icon';
import BuildingIcon from '../../../../components/icons/profile/building-icon';
import CartIcon from '../../../../components/icons/profile/cart-icon';
import EditIcon from '../../../../components/icons/profile/edit-icon';
import LogoutIcon from '../../../../components/icons/profile/logout-icon';
import ShieldIcon from '../../../../components/icons/profile/shield-icon';
import TermsIcon from '../../../../components/icons/profile/terms-icon';
import ScreenContainer from '../../../../components/layouts/screen-container';
import ProfileItem from '../../../../components/report/profile-item';
import { AppText } from '../../../../components/ui/app-text';
import { AppButton } from '../../../../components/ui/app-button';
import { getMbtiIconComponent } from '../mbti/mbti-profile-item';

import { APP_URL } from '@env';
import { COLORS } from '../../../../constants/colors';
import { scaleFont, scaleSize } from '../../../../utils/scale';
import api from '../../../../utils/http';
import { useAsyncStorage } from '../../../../hooks/use-storage';
import { ProfileIcon, useAffinityProfile } from '../../../../hooks/use-affinity-profile';

import type { MainNavigatorParamList } from '../../../../navigators/types';
import type { UserProfile } from './types';

type ProfileProps = BottomTabScreenProps<MainNavigatorParamList, 'Profile'>;

const Profile: FC<ProfileProps> = ({ navigation }) => {
  // ...
  const handleCopyReferralCode = () => {
    if (user?.referral_code) {
      Clipboard.setString(user.referral_code);
      if (Platform.OS === 'ios') {
        Toast.show({
          type: 'success',
          text1: t('profile.copiedToClipboard'),
        });
      }
    }
  };
  const { t } = useTranslation();
  const { getUserProfile, getAuthToken } = useAsyncStorage();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { sync } = useAsyncStorage();

  const init = async () => {
    console.log('init');
    await sync?.();
    const profile = await getUserProfile();
    const token = await getAuthToken();

    setToken(token);
    setUser(profile);
  };

  useFocusEffect(
    React.useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        init();
      });
      return () => task.cancel();
    }, []),
  );

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      setToken(token || '');
    };
    getToken();
  }, []);

  const handleEditProfile = () => {
    console.log('Edit Profile pressed');
    navigation.navigate('EditProfile');
  };

  const handlePasswordSettings = () => {
    console.log('Password Settings pressed');
    navigation.navigate('PasswordSetting');
  };

  const handlePurchaseHistory = () => {
    console.log('Purchase History pressed');
    navigation.navigate('PurchaseHistory');
  };

  const handleContent = async (content: string) => {
    let title = t('profilePage.aboutUs');
    if (content === 'terms-conditions') {
      title = t('profilePage.termsAndConditions');
    } else if (content === 'privacy-policy') {
      title = t('profilePage.privacyPolicy');
    }

    const language = await AsyncStorage.getItem('language');
    console.log(token, language);

    navigation.navigate('WebviewContent', {
      uri: `${APP_URL}/content/${content}?v=${Date.now()}&token=${token}&locale=${language}`,
      title,
    });
  };

  const handleBuyCoins = () => {
    console.log('Buy Coins pressed');
    navigation.navigate('TopUp');
  };

  const handleCompleteQuiz = () => {
    navigation.navigate('MbtiQuiz');
  };

  const handleLogout = async () => {
    console.log('Logout pressed', user);
    try {
      await api.post(`/v1/users/auth/logout`);
      await Purchases.logOut();
      await AsyncStorage.removeItem('user_profile');
      await AsyncStorage.removeItem('auth_token');
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDeleteAccount = async () => {
    console.log('Delete Account pressed', user);

    // Check if user has active subscription
    if (user?.subscription_id) {
      // Show alert to cancel subscription first
      Alert.alert(
        t('profilePage.dangerZone'),
        t('profilePage.hasActiveSubscription'),
        [
          {
            text: t('profilePage.cancel'),
            style: 'cancel',
          },
        ]
      );
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      t('profilePage.deleteAccount'),
      t('profilePage.deleteAccountConfirm'),
      [
        {
          text: t('profilePage.cancel'),
          style: 'cancel',
        },
        {
          text: t('profilePage.delete'),
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await api.delete('/v1/users');

              // Clear all local data
              await Purchases.logOut();
              await AsyncStorage.removeItem('user_profile');
              await AsyncStorage.removeItem('auth_token');

              // Show success message
              if (Platform.OS === 'android') {
                ToastAndroid.show(t('profilePage.deleteAccountSuccess'), ToastAndroid.LONG);
              } else {
                Toast.show({
                  type: 'success',
                  text1: t('profilePage.deleteAccountSuccess'),
                });
              }

              // Navigate to Welcome screen
              navigation.navigate('Welcome');
            } catch (error) {
              console.error('Delete account failed:', error);

              // Show error message
              if (Platform.OS === 'android') {
                ToastAndroid.show(t('profilePage.deleteFailed'), ToastAndroid.LONG);
              } else {
                Toast.show({
                  type: 'error',
                  text1: t('profilePage.deleteFailed'),
                });
              }
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  const {
    loading: profileLoading,
    error: profileError,
    data: affinityProfile,
  } = useAffinityProfile();

  return (
    <ScreenContainer>
      {/* User Profile Card */}
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <AppText
            variant="subtitle1"
            color="white"
            style={{ fontSize: scaleFont(16, 12, 20) }}>
            {user?.full_name || t('profilePage.guest')}
          </AppText>
          <Pressable style={styles.userBadge} onPress={handleCopyReferralCode}>
            <AppText variant="caption2" color="white" style={styles.badgeText}>
              {user?.referral_code}
            </AppText>
            <CopyIcon />
          </Pressable>
        </View>

        {/* User Stats */}
        <View style={styles.userStats}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('BaziResults', {
                profile_bazi: affinityProfile?.profile_bazi,
              });
            }}
            style={styles.statItem}>
            <ProfileIcon
              name={affinityProfile?.profile_bazi?.day_master?.icon}
            />
            <AppText variant="caption2" style={styles.statLabel} color="white">
              {affinityProfile?.profile_bazi?.day_master?.name}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AstrologyResults', {
                profile_astro: affinityProfile?.profile_astro,
              });
            }}
            style={styles.statItem}>
            <ProfileIcon name={affinityProfile?.profile_astro?.sun?.zodiac} />
            <AppText variant="caption2" style={styles.statLabel} color="white">
              {affinityProfile?.profile_astro?.sun?.zodiac_name}
            </AppText>
          </TouchableOpacity>
          {user?.mbti_profile && (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MbtiResults');
              }}
              style={styles.statItem}>
              {(() => {
                const MbtiIcon = getMbtiIconComponent(user?.mbti_profile);
                return MbtiIcon ? (
                  <MbtiIcon size={75} color={COLORS.neutral} />
                ) : (
                  <CommentUserIcon size={75} />
                );
              })()}

              <AppText
                variant="caption2"
                style={styles.statLabel}
                color="white">
                {user?.mbti_profile}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {user && !user.mbti_profile && (
        <View style={styles.mbtiQuizSection}>
          <CommentUserIcon size={scaleSize(20, 16, 26)} />
          <View style={styles.mbtiQuizTextContainer}>
            <AppText
              variant="caption1"
              color="neutral"
              style={{ fontSize: scaleFont(12, 10, 16), }}>
              {t('profilePage.mbtiTitle')}
            </AppText>
            <AppText
              variant="tiny1"
              color="neutral"
              style={{ fontSize: scaleFont(10, 8, 14) }}>
              {t('profilePage.mbtiSubtitle')}
            </AppText>
          </View>
          <AppButton
            style={styles.mbtiQuizButton}
            variant="primary"
            title={t('mbtiQuiz.button')}
            size="small"
            onPress={handleCompleteQuiz}
          />
        </View>
      )}

      {/* Coins Section */}
      <View style={styles.coinsCard}>
        <View style={styles.coinsHeader}>
          <AppText variant="body2" color="white">
            {t('profilePage.yourCoins')}
          </AppText>
          <Pressable onPress={handleBuyCoins} style={styles.buyCoinsButton}>
            <AppText
              variant="caption4"
              style={styles.buyCoinsText}
              color="white">
              {t('profilePage.buyCoins')}
            </AppText>
            <AppText variant="subtitle2" color="white">
              ›
            </AppText>
          </Pressable>
        </View>

        <View style={styles.coinsRow}>
          <View style={styles.coinItem}>
            <AppText
              color="white"
              style={styles.coinAmount}
              variant="subtitle1">
              {user?.gold_credits}
            </AppText>
            <CoinIcon size={scaleSize(16, 14, 19)} type="gold" />
          </View>
          <View style={[styles.coinItem, { display: 'none' }]}>
            <AppText
              color="white"
              style={styles.coinAmount}
              variant="subtitle1">
              {user?.silver_credits}
            </AppText>
            <CoinIcon size={scaleSize(16, 14, 19)} type="silver" />
          </View>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <AppText variant="subtitle1" color="white" style={styles.sectionTitle}>
          {t('profilePage.profileSectionTitle')}
        </AppText>
        <ProfileItem
          title={t('profilePage.editProfile')}
          icon={<EditIcon size={scaleSize(16, 14, 20)} />}
          onPress={handleEditProfile}
        />
        <ProfileItem
          title={t('profilePage.passwordSettings')}
          icon={<EyeIcon size={scaleSize(16, 14, 20)} />}
          onPress={handlePasswordSettings}
        />
        <ProfileItem
          title={t('profilePage.purchaseHistory')}
          icon={<CartIcon size={scaleSize(16, 14, 20)} />}
          onPress={handlePurchaseHistory}
          isLast
        />
      </View>

      {/* Others Section */}
      <View style={styles.section}>
        <AppText variant="subtitle1" color="white" style={styles.sectionTitle}>
          {t('profilePage.othersSectionTitle')}
        </AppText>
        <ProfileItem
          title={t('profilePage.aboutUs')}
          icon={<BuildingIcon size={scaleSize(16, 14, 20)} />}
          onPress={() => handleContent('about-us')}
        />
        <ProfileItem
          title={t('profilePage.privacyPolicy')}
          icon={<ShieldIcon size={scaleSize(16, 14, 20)} />}
          onPress={() => handleContent('privacy-policy')}
        />
        <ProfileItem
          title={t('profilePage.termsAndConditions')}
          icon={<TermsIcon size={scaleSize(16, 14, 20)} />}
          onPress={() => handleContent('terms-conditions')}
          isLast
        />
      </View>

      {/* Danger Zone Section */}
      <View style={styles.section}>
        <AppText variant="subtitle1" color="white" style={styles.dangerZoneTitle}>
          {t('profilePage.dangerZone')}
        </AppText>
        <AppText variant="caption2" color="neutral" style={styles.dangerZoneSubtitle}>
          {t('profilePage.dangerZoneSubtitle')}
        </AppText>
        <AppButton
          style={styles.deleteButton}
          variant="secondary"
          title={isDeleting ? t('profilePage.deleting') : t('profilePage.deleteAccount')}
          onPress={handleDeleteAccount}
          disabled={isDeleting}
        />
      </View>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <LogoutIcon />
        <AppText style={styles.logoutText} variant="subtitle2" color="white">
          {t('profilePage.logout')}
        </AppText>
      </Pressable>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({

  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    padding: scaleSize(16, 14, 20),
    marginBottom: scaleSize(12, 12, 16),
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(14, 14, 20),
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS['primary-dark'],
    paddingHorizontal: scaleSize(8, 8, 12),
    paddingVertical: scaleSize(4, 4, 6),
    borderRadius: scaleSize(6, 6, 8),
  },
  badgeText: {
    fontWeight: '600',
    marginRight: scaleSize(2, 2, 4),
    fontSize: scaleFont(12, 10, 16),
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: scaleSize(8, 8, 12),
    padding: scaleSize(12, 12, 16),
    alignItems: 'center',
    flex: 1,
    marginHorizontal: scaleSize(2, 2, 4),
  },
  statLabel: {
    marginTop: scaleSize(8, 8, 12),
    fontSize: scaleFont(12, 10, 16),
  },
  coinsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: scaleSize(16),
    padding: scaleSize(16, 14, 20),
    marginBottom: scaleSize(12, 12, 16),
  },
  coinsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scaleSize(12, 12, 16),
  },
  buyCoinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyCoinsText: {
    marginRight: scaleSize(2, 2, 4),
    fontSize: scaleFont(10, 8, 14),
  },
  coinsRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    marginHorizontal: scaleSize(4, 4, 8),
  },
  coinAmount: {
    marginRight: scaleSize(4, 4, 8),
    fontSize: scaleFont(16, 12, 20),
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: scaleSize(12, 12, 16),
    padding: scaleSize(16, 14, 20),
    paddingBottom: scaleSize(8, 8, 10),
    marginBottom: scaleSize(12, 12, 16),
  },
  sectionTitle: {
    marginBottom: scaleSize(12, 12, 16),
    fontSize: scaleFont(16, 12, 20),
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scaleSize(12, 12, 16),
    borderBottomWidth: scaleSize(1),
    borderBottomColor: '#F0F0F0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scaleSize(12, 12, 16),
    paddingHorizontal: scaleSize(16, 14, 20),
    marginBottom: scaleSize(24, 24, 32),
  },
  logoutText: {
    marginLeft: scaleSize(8, 8, 12),
    fontSize: scaleFont(16, 12, 20),
  },
  mbtiQuizTextContainer: {
    marginLeft: scaleSize(4),
    flexGrow: 1,
  },
  mbtiQuizSection: {
    flexDirection: 'row',
    padding: scaleSize(14, 8, 14),
    borderWidth: scaleSize(1),
    borderColor: COLORS.black,
    borderRadius: scaleSize(8, 8, 12),
    marginBottom: scaleSize(8, 8, 12),
    alignItems: 'center',
    gap: scaleSize(4, 4, 8),
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  mbtiQuizButton: {
    width: scaleSize(100, 80, 120),
  },
  dangerZoneTitle: {
    fontSize: scaleFont(16, 12, 20),
    color: COLORS.red,
  },
  dangerZoneSubtitle: {
    marginBottom: scaleSize(16, 16, 20),
    fontSize: scaleFont(12, 10, 14),
  },
  deleteButton: {
    backgroundColor: 'rgba(235, 67, 53, 0.1)',
    borderColor: COLORS.red,
    borderWidth: 1,
    marginBottom: scaleSize(8),
  },
});

export default Profile;
