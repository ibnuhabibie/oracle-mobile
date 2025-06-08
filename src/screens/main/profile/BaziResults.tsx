/* eslint-disable react-native/no-inline-styles */
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FC} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import ArrowIcon from '../../../components/icons/Arrow';
import ScreenContainer from '../../../components/layouts/ScreenContainer';
import ShinyContainer from '../../../components/widgets/ShinyContainer';
import {fontFamilies} from '../../../constants/fonts';
import {MainNavigatorParamList} from '../../../navigators/MainNavigator';

interface BaziResultsProps {
  navigation: NativeStackNavigationProp<
    MainNavigatorParamList,
    'AstrologyResults'
  >;
}

const BaziResults: FC<BaziResultsProps> = ({navigation}) => {
  return (
    <ScreenContainer>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowIcon />
        </Pressable>
        <Text style={styles.headerTitle}>BaZi Profile</Text>
      </View>

      {/* Main Profile Card */}
      <View style={styles.profileCard}>
        <ShinyContainer dark={false} size={158}>
          <Text style={styles.zodiacIcon}>♊</Text>
        </ShinyContainer>

        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>Jessica Carl</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>29 May 1999</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time of Birth</Text>
            <Text style={styles.infoValue}>10:00 AM</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Country of Birth</Text>
            <Text style={styles.infoValue}>Singapore</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>City of Birth</Text>
            <Text style={styles.infoValue}>Singapore</Text>
          </View>
        </View>
      </View>

      {/* Sun Sign Card */}
      <View style={styles.card}>
        <ShinyContainer dark={false} size={240}>
          <Text style={styles.celestialIcon}>☀️</Text>
        </ShinyContainer>
        <Text style={styles.sectionTitle}>Sun: Gemini in House 10</Text>
        <Text style={styles.sectionSubtitle}>
          Represents your life force, purpose, and how you shine in the world.
        </Text>
        <Text style={styles.sectionDescription}>
          Your life force shines through your deep emotional intelligence and
          nurturing nature. You thrive when you feel secure and connected,
          valuing meaningful relationships over surface-level bonds. Sensitivity
          can sometimes lead to overprotection or moodiness, but by setting
          healthy boundaries, you create safe spaces without feeling drained.
        </Text>
        <Text style={styles.sectionDescription}>
          Your purpose is tied to your career and public image, making you
          naturally driven to leave a lasting impact. Others see you as
          responsible and capable, though the pressure to succeed can feel
          overwhelming at times. Balancing personal needs with ambition ensures
          you don't lose yourself in expectations—embrace both success and
          self-care.
        </Text>
      </View>

      {/* Moon Sign Card */}
      <View style={[styles.card, {marginBottom: 32}]}>
        <ShinyContainer dark={false} size={240}>
          <Text style={styles.celestialIcon}>🌙</Text>
        </ShinyContainer>
        <Text style={styles.sectionTitle}>Moon: Libra in House 2</Text>
        <Text style={styles.sectionSubtitle}>
          Symbolizes emotions, subconscious patterns, and how you nurture and
          seek comfort.
        </Text>
        <Text style={styles.sectionDescription}>
          Your emotions thrive in harmony, and you feel most at ease in
          balanced, loving relationships. You naturally seek fairness and
          connection, often acting as the peacemaker. However, indecisiveness or
          a fear of conflict can arise. Trusting your own emotional needs first
          will help you create relationships that are both fulfilling and
          stable.
        </Text>
        <Text style={styles.sectionDescription}>
          Your sense of security is deeply tied to financial stability and the
          comforts of life. You nurture yourself through beauty, art, and
          emotional investments in what feels valuable. At times, emotions may
          fluctuate with your financial situation, but learning to cultivate
          inner security ensures your confidence isn't dependent on material
          circumstances.
        </Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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
  profileCard: {
    backgroundColor: 'rgba(255, 200, 138, 0.22)',
    borderRadius: 10,
    padding: 20,
    marginTop: 32,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D0C0',
  },
  zodiacIcon: {
    fontSize: 32,
    color: '#333',
  },
  profileInfo: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#D0C0B0',
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#333',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  celestialIcon: {
    fontSize: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#D4A574',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#999',
    textAlign: 'center',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: fontFamilies.ARCHIVO.light,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 12,
  },
});

export default BaziResults;
