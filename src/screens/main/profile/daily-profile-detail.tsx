import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { scaleFont, scaleSize } from "../../../utils/scale";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../../constants/colors";
import { AppText } from "../../../components/ui/app-text";
import { fontFamilies } from "../../../constants/fonts";
import CloseIcon from "../../../components/icons/close-icon";
import CircularScore from "../../../components/widgets/circular-score";
import ScreenContainer from "../../../components/layouts/screen-container";
import Header from "../../../components/ui/header";
import { useTranslation } from "react-i18next";
import WealthIcon from "../../../components/icons/daily-dashboard/wealth-icon";
import LearningIcon from "../../../components/icons/daily-dashboard/learning-icon";
import RelationIcon from "../../../components/icons/daily-dashboard/relation-icon";
import CareerIcon from "../../../components/icons/daily-dashboard/career-icon";

function StarReview({ value }: { value?: number }) {
  // value: 0-100, 4 stars, each 25 points
  const filled = Math.round((value ?? 0) / 25);
  return (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(4)].map((_, i) => (
        <AppText
          key={i}
          variant="title3"
          style={{
            color: i < filled ? COLORS.primary : COLORS.neutral,
            marginHorizontal: scaleSize(2),
            fontSize: scaleFont(22), // title3
          }}
        >
          {i < filled ? '★' : '☆'}
        </AppText>
      ))}
    </View>
  );
}

export default function DailyProfileDetail() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params as {
    data: {
      today_points: number;
      today_description: string;
      today_wealth_points: number;
      today_study_points: number;
      today_relationship_points: number;
      today_career_points: number;
    };
  };

  return (
    <ScreenContainer
      header={
        <Header
          title=''
          onBack={() => navigation.goBack()}
        />
      }
      style={styles.container}>
      {/* Score */}
      <AppText variant='subtitle1' style={styles.date} color="white">
        {new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })}, {new Date().toLocaleDateString('en-GB', { weekday: 'long' })}
      </AppText>
      <AppText variant='display1' style={styles.score} color="white">{data?.today_points}%</AppText>
      <AppText style={styles.subtitle} color="neutral">{t('dailyProfileDetail.todayScore')}</AppText>

      {/* Cards */}
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <WealthIcon size={scaleSize(40, 36, 60)} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>{t('dailyProfileDetail.wealth')}</AppText>
          <StarReview value={data.today_wealth_points} />
        </View>
        <View style={styles.card}>
          <LearningIcon size={scaleSize(40, 36, 60)} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>{t('dailyProfileDetail.learning')}</AppText>
          <StarReview value={data.today_study_points} />
        </View>
      </View>
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <RelationIcon size={scaleSize(40, 36, 60)} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>{t('dailyProfileDetail.relation')}</AppText>
          <StarReview value={data.today_relationship_points} />
        </View>
        <View style={styles.card}>
          <CareerIcon size={scaleSize(40, 36, 60)} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>{t('dailyProfileDetail.career')}</AppText>
          <StarReview value={data.today_career_points} />
        </View>
      </View>

      {/* Description */}
      <AppText variant='caption1' color="neutral" style={styles.description}>
        {data.today_description}
      </AppText>
    </ScreenContainer >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scaleSize(18, 12, 24),
    paddingTop: 0
  },
  date: {
    textAlign: 'center',
    fontSize: scaleFont(16, 12, 20),
  },
  score: {
    marginBottom: scaleSize(8),
    textAlign: 'center',
    fontSize: scaleFont(45, 32, 60), // display1
  },
  subtitle: {
    textAlign: "center",
    letterSpacing: scaleSize(2, 2, 4),
    marginBottom: scaleSize(24, 24, 32),
    fontSize: scaleFont(16, 12, 20),
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scaleSize(18, 18, 24),
    marginBottom: scaleSize(18, 18, 24),
  },
  cardTitle: {
    marginTop: scaleSize(8, 8, 12),
    fontSize: scaleFont(16, 12, 20),
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: scaleSize(12, 12, 18),
    padding: scaleSize(12, 12, 18),
    alignItems: "center",
    width: "45%",
  },
  description: {
    marginTop: scaleSize(12, 12, 16),
    textAlign: "center",
    lineHeight: scaleSize(20, 16, 24),
    fontSize: scaleFont(14, 12, 18),
  },
});
