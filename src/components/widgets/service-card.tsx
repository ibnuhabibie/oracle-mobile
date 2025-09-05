import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
        <ShinyContainer size={350}>
          {id === 'love' && <LoveReportIcon size={100} />}
          {id === 'fortune' && <FortuneReportIcon size={100} />}
          {id === 'relation' && <RelationReportIcon size={100} />}
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
    borderRadius: 12,
    flex: 1,
    paddingTop: 32,
  },
  textContainer: {
    marginTop: 24,
    padding: 16,
  },
  cardTitle: {
    marginBottom: 6,
    marginTop: 4,
    textAlign: 'left',
  },
  cardSubtitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default ServiceCard;
