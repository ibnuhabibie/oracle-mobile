import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from "react-i18next";

import { APP_URL } from '@env';

import CoinIcon from '../../../components/icons/profile/coin-icon';
import CommentUserIcon from '../../../components/icons/profile/comment-user-icon';
import { getMbtiIconComponent } from '../../../features/mbti/mbti-profile-item';
import CopyIcon from '../../../components/icons/profile/copy-icon';
import EyeIcon from '../../../components/icons/profile/eye-icon';
import BuildingIcon from '../../../components/icons/profile/building-icon';
import CartIcon from '../../../components/icons/profile/cart-icon';
import EditIcon from '../../../components/icons/profile/edit-icon';
import FerrisWheelIcon from '../../../components/icons/profile/ferris-wheel-icon';
import LogoutIcon from '../../../components/icons/profile/logout-icon';
import ShieldIcon from '../../../components/icons/profile/shield-icon';
import StarIcon from '../../../components/icons/profile/star-icon';
import TermsIcon from '../../../components/icons/profile/terms-icon';

import ScreenContainer from '../../../components/layouts/screen-container';
import { COLORS } from '../../../constants/colors';
import { fontFamilies } from '../../../constants/fonts';
import { MainNavigatorParamList } from '../../../navigators/types';
import api from '../../../utils/http';
import ProfileItem from '../../../features/profile/profile-item';
import { useAsyncStorage } from '../../../hooks/use-storage';
import { AppText } from '../../../components/ui/app-text';
import { AppButton } from '../../../components/ui/app-button';
import { iconMap, useAffinityProfile } from './useAffinityProfile';

type ProfileProps = NativeStackScreenProps<MainNavigatorParamList, 'Profile'>;

const Profile: FC<ProfileProps> = ({ navigation }) => {
  // ...
  const handleCopyReferralCode = () => {
    if (user?.referral_code) {
      Clipboard.setString(user.referral_code);
      Toast.show({
        type: 'success',
        text1: 'Copied to clipboard',
      });
    }
  };
  const { t } = useTranslation();
  const { getUserProfile, getAuthToken } = useAsyncStorage();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const init = async () => {
      const profile = await getUserProfile();
      const token = await getAuthToken();

      console.log(profile)

      setToken(token)
      setUser(profile)
    };

    init();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      setToken(token || '')
    };
    getToken();
  }, []);

  const handleEditProfile = () => {
    console.log('Edit Profile pressed');
    navigation.push('EditProfile');
  };

  const handlePasswordSettings = () => {
    console.log('Password Settings pressed');
    navigation.push('PasswordSetting');
  };

  const handlePurchaseHistory = () => {
    console.log('Purchase History pressed');
    navigation.push('PurchaseHistory');
  };

  const handleContent = (content) => {
    let title = 'About Us'
    if (content === 'terms-conditions') {
      title = 'Terms & Conditions'
    } else if (content === 'privacy-policy') {
      title = 'Privacy Policy'
    }
    
    console.log(token)

    navigation.push('WebviewContent', {
      uri: `${APP_URL}/content/${content}?v=1.0.0&token=${token}`,
      title,
    });
  };

  const handleBuyCoins = () => {
    console.log('Buy Coins pressed');
    navigation.push('TopUp');
  };

  const handleCompleteQuiz = () => {
    navigation.push('MbtiQuiz');
  }

  const handleLogout = async () => {
    console.log('Logout pressed');
    try {
      await api.post(`/v1/users/auth/logout`);
      await AsyncStorage.removeItem('user_profile');
      await AsyncStorage.removeItem('auth_token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const { loading: profileLoading, error: profileError, data: affinityProfile } = useAffinityProfile();

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      {/* User Profile Card */}
      <View style={styles.userCard}>
        <View style={styles.userInfo}>
          <AppText variant='subtitle1' style={styles.userName} color='white'>{user?.full_name || t("Guest")}</AppText>
          <Pressable style={styles.userBadge} onPress={handleCopyReferralCode}>
            <Text style={styles.badgeText}>{user?.referral_code}</Text>
            <CopyIcon />
          </Pressable>
        </View>

        {/* User Stats */}
        <View style={styles.userStats}>
          <TouchableOpacity
            onPress={() => {
              navigation.push('BaziResults', { profile_bazi: affinityProfile?.profile_bazi });
            }}
            style={styles.statItem}>
            <Image
              source={iconMap[affinityProfile?.profile_bazi?.day_master?.icon]}
              resizeMode="contain"
              style={{ width: 75, height: 75 }}
            />
            <AppText variant='caption2' style={styles.statLabel} color='white'>
              {affinityProfile?.profile_bazi?.day_master?.name}
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.push('AstrologyResults', { profile_astro: affinityProfile?.profile_astro });
            }}
            style={styles.statItem}>
            <Image
              source={iconMap[affinityProfile?.profile_astro?.sun?.zodiac]}
              resizeMode="contain"
              style={{ width: 75, height: 75 }}
            />
            <AppText variant='caption2' style={styles.statLabel} color='white'>
              {affinityProfile?.profile_astro?.sun?.zodiac_name}
            </AppText>
          </TouchableOpacity>
          {user?.mbti_profile && (
            <TouchableOpacity
              onPress={() => {
                navigation.push('MbtiResults');
              }}
              style={styles.statItem}>
              {(() => {
                const MbtiIcon = getMbtiIconComponent(user?.mbti_profile);
                return MbtiIcon ? <MbtiIcon width={50} height={75} color={COLORS.neutral} /> : <CommentUserIcon size={75} />;
              })()}

              <AppText variant='caption2' style={styles.statLabel} color='white'>
                {user?.mbti_profile}
              </AppText>
            </TouchableOpacity>
          )}
        </View>

      </View>

      {
        !user?.mbti_profile &&
        (
          < View style={styles.mbtiQuizSection}>
            <CommentUserIcon />
            <View style={{ flex: 1 }}>
              <AppText variant='caption1'>What’s your MBTI?</AppText>
              <AppText variant='tiny1'>Quick test to discover your type!</AppText>
            </View>
            <AppButton style={{ width: 'auto' }} variant='primary' title='Find Out' size='small' onPress={handleCompleteQuiz} />
          </View>
        )
      }

      {/* Coins Section */}
      <View style={styles.coinsCard}>
        <View style={styles.coinsHeader}>
          <AppText variant='body2' color='white'>{t("Your Coins")}</AppText>
          <Pressable onPress={handleBuyCoins} style={styles.buyCoinsButton}>
            <AppText variant='caption4' style={styles.buyCoinsText} color='white'>{t("Buy Coins")}</AppText>
            <AppText variant='subtitle2' color='white'>›</AppText>
          </Pressable>
        </View>

        <View style={styles.coinsRow}>
          <View style={styles.coinItem}>
            <AppText color='white' style={styles.coinAmount} variant='subtitle1'>{user?.gold_credits}</AppText>
            <CoinIcon size={19} color="#E0AE1E" />
          </View>
          <View style={styles.coinItem}>
            <AppText color='white' style={styles.coinAmount} variant='subtitle1'>{user?.silver_credits}</AppText>
            <CoinIcon size={19} color="#EB4335" />
          </View>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <AppText variant='subtitle1' color='white' style={styles.sectionTitle}>{t("Profile")}</AppText>
        <ProfileItem
          title="Edit Profile"
          icon={<EditIcon size={20} />}
          onPress={handleEditProfile}
        />
        <ProfileItem
          title="Password Settings"
          icon={<EyeIcon size={20} />}
          onPress={handlePasswordSettings}
        />
        <ProfileItem
          title="Purchase History"
          icon={<CartIcon size={20} />}
          onPress={handlePurchaseHistory}
          isLast
        />
      </View>

      {/* Others Section */}
      <View style={styles.section}>
        <AppText variant='subtitle1' color='white' style={styles.sectionTitle}>{t("Others")}</AppText>
        <ProfileItem
          title="About Us"
          icon={<BuildingIcon />}
          onPress={() => handleContent('about-us')}
        />
        <ProfileItem
          title="Privacy Policy"
          icon={<ShieldIcon size={20} />}
          onPress={() => handleContent('privacy-policy')} />
        <ProfileItem
          title="Terms & Conditions"
          icon={<TermsIcon size={20} />}
          onPress={() => handleContent('terms-conditions')}
          isLast
        />
      </View>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <LogoutIcon />
        <AppText style={styles.logoutText} variant='subtitle2' color='white'>{t("Logout")}</AppText>
      </Pressable>
    </ScreenContainer >
  );
};

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS['primary-dark'],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statLabel: {
    marginTop: 12,
  },
  coinsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  coinsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buyCoinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyCoinsText: {
    marginRight: 4,
  },
  coinsRow: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    // flex: 1,
    marginHorizontal: 8,
  },
  coinAmount: {
    marginRight: 8,
  },
  coinIcon: {
    fontSize: 16,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderRadius: 16,
    padding: 20,
    paddingBottom: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  profileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileItemIcon: {
    fontSize: 16,
    marginRight: 16,
    width: 20,
  },
  profileItemTitle: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  chevron: {
    fontSize: 18,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  logoutText: {
    marginLeft: 12,
  },
  mbtiQuizSection: {
    flexDirection: 'row',
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 8
  }
});

export default Profile;
