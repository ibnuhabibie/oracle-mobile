import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import BuildingIcon from '../../../components/icons/Building';
import CartIcon from '../../../components/icons/Cart';
import CoinIcon from '../../../components/icons/Coin';
import CommentUserIcon from '../../../components/icons/CommentUser';
import CopyIcon from '../../../components/icons/Copy';
import EditIcon from '../../../components/icons/Edit';
import EyeIcon from '../../../components/icons/Eye';
import FerrisWheelIcon from '../../../components/icons/FerrisWheel';
import LogoutIcon from '../../../components/icons/Logout';
import ShieldIcon from '../../../components/icons/Shield';
import StarIcon from '../../../components/icons/Star';
import TermsIcon from '../../../components/icons/Terms';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import { COLORS } from '../../../constants/colors';
import { fontFamilies } from '../../../constants/fonts';
import { MainNavigatorParamList } from '../../../navigators/types';

import { APP_URL, API_BASE_URL } from '@env';
import api from '../../../utils/http';
// i18n
import { useTranslation } from "react-i18next";
import ProfileItem from '../../../features/profile/profile-item';
import { useAsyncStorage } from '../../../hooks/use-storage';

type ProfileProps = NativeStackScreenProps<MainNavigatorParamList, 'Profile'>;

const Profile: FC<ProfileProps> = ({ navigation }) => {
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
    navigation.push('WebviewContent', {
      uri: `${APP_URL}/content/${content}?token=${token}`,
      title,
    });
  };

  const handleBuyCoins = () => {
    console.log('Buy Coins pressed');
    navigation.push('TopUp');
  };

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

  return (
    <ScreenContainer style={{ marginTop: 44 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.full_name || t("Guest")}</Text>
            <View style={styles.userBadge}>
              <Text style={styles.badgeText}>{user?.referral_code}</Text>
              <CopyIcon />
            </View>
          </View>

          {/* User Stats */}
          <View style={styles.userStats}>
            <TouchableOpacity
              onPress={() => {
                navigation.push('BaziResults');
              }}
              style={styles.statItem}>
              <FerrisWheelIcon />
              <Text style={styles.statLabel}>手辰</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push('AstrologyResults');
              }}
              style={styles.statItem}>
              <StarIcon />
              <Text style={styles.statLabel}>Gemini</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.push('MbtiResults');
              }}
              style={styles.statItem}>
              <CommentUserIcon />
              <Text style={styles.statLabel}>{user?.mbti_profile}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Coins Section */}
        <View style={styles.coinsCard}>
          <View style={styles.coinsHeader}>
            <Text style={styles.coinsTitle}>{t("Your Coins")}</Text>
            <Pressable onPress={handleBuyCoins} style={styles.buyCoinsButton}>
              <Text style={styles.buyCoinsText}>{t("Buy Coins")}</Text>
              <Text style={styles.chevron}>›</Text>
            </Pressable>
          </View>

          <View style={styles.coinsRow}>
            <View style={styles.coinItem}>
              <Text style={styles.coinAmount}>{user?.gold_credits}</Text>
              <CoinIcon size={19} color="#FBBC05" />
            </View>
            <View style={styles.coinItem}>
              <Text style={styles.coinAmount}>{user?.silver_credits}</Text>
              <CoinIcon size={19} color="#B9B9B9" />
            </View>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Profile")}</Text>
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
          />
        </View>

        {/* Others Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t("Others")}</Text>
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
          />
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogoutIcon />
          <Text style={styles.logoutText}>{t("Logout")}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: 'rgba(255, 200, 138, 0.14)',
    borderWidth: 1,
    borderColor: COLORS.neutral,
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
    fontWeight: '600',
    color: '#333',
    fontFamily: fontFamilies.ARCHIVO.light,
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
  badgeIcon: {
    fontSize: 12,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(208, 175, 138, 0.5)',
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
    fontSize: 14,
    color: '#333',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  coinsCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  coinsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  coinsTitle: {
    fontSize: 16,
    color: '#666',
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  buyCoinsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buyCoinsText: {
    fontSize: 14,
    color: '#333',
    marginRight: 4,
    fontFamily: fontFamilies.ARCHIVO.light,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
  coinIcon: {
    fontSize: 16,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    fontFamily: fontFamilies.ARCHIVO.light,
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
    color: '#CCC',
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
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    fontFamily: fontFamilies.ARCHIVO.light,
  },
});

export default Profile;
