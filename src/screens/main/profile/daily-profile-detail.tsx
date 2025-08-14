import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
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
        <Text
          key={i}
          style={{
            fontSize: 20,
            color: i < filled ? COLORS.primary : COLORS.neutral,
            marginHorizontal: 2,
          }}
        >
          {i < filled ? '★' : '☆'}
        </Text>
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
      <AppText style={styles.score} color="white">{data?.today_points}%</AppText>
      <AppText style={styles.subtitle} color="neutral">TODAY SCORE</AppText>

      {/* Cards */}
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <WealthIcon size={60} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>Wealth</AppText>
          <StarReview value={data.today_wealth_points} />
        </View>
        <View style={styles.card}>
          <LearningIcon size={60} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>Learning</AppText>
          <StarReview value={data.today_study_points} />
        </View>
      </View>
      <View style={styles.cardsRow}>
        <View style={styles.card}>
          <RelationIcon size={60} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>Relation</AppText>
          <StarReview value={data.today_relationship_points} />
        </View>
        <View style={styles.card}>
          <CareerIcon size={60} />
          <AppText variant='body1' color="neutral" style={styles.cardTitle}>Career</AppText>
          <StarReview value={data.today_career_points} />
        </View>
      </View>

      {/* Description */}
      <AppText variant='caption1' color="neutral" style={styles.description}>
        {data.today_description}
      </AppText>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  score: {
    marginBottom: 8,
    fontSize: 40,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: "center",
    letterSpacing: 4,
    marginBottom: 32,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  cardTitle: {
    marginTop: 12,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    width: "45%",
  },
  description: {
    marginTop: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
