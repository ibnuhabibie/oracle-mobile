import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scaleFont, scaleSize } from '../../utils/scale';
import { AppText } from '../ui/app-text';
import ShinyContainer from './shiny-container';
import LoveReportIcon from '../icons/services/love-report/love-report-icon';
import FortuneReportIcon from '../icons/services/fortune-report/fortune-report-icon';
import RelationReportIcon from '../icons/services/relation-report/relation-report-icon';

type ServiceCardData = {
  id: 'love' | 'fortune' | 'relation';
  title: string;
  subtitle: string;
  path: string;
};

type ServiceCardProps = {
  data: ServiceCardData;
  navigation: any;
};

const ServiceCard: React.FC<ServiceCardProps> = ({ data, navigation }) => {
  const { id, title, subtitle, path } = data;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => navigation.navigate(path as any)}
      style={styles.cardContainer}
    >
      <View>
        <ShinyContainer size={scaleSize(350)}>
          {id === 'love' && <LoveReportIcon size={scaleSize(100)} />}
          {id === 'fortune' && <FortuneReportIcon size={scaleSize(100)} />}
          {id === 'relation' && <RelationReportIcon size={scaleSize(100)} />}
        </ShinyContainer>
        <View style={styles.textContainer}>
          <AppText variant='largeTitle1' style={styles.cardTitle} color='white'>
            {title}
          </AppText>
          <AppText variant='title3' style={styles.cardSubtitle} color='primary'>
            {subtitle}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: scaleSize(12),
    flex: 1,
    paddingTop: scaleSize(32),
  },
  textContainer: {
    marginTop: scaleSize(24),
    padding: scaleSize(16),
  },
  cardTitle: {
    marginBottom: scaleSize(6),
    marginTop: scaleSize(4),
    textAlign: 'left',
    fontSize: scaleFont(34), // largeTitle1
  },
  cardSubtitle: {
    textTransform: 'uppercase',
    letterSpacing: scaleSize(1),
    fontSize: scaleFont(22), // title3
  },
});

export default ServiceCard;
