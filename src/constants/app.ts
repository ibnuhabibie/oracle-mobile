export const LANGUAGES = [
  { key: 'en', label: 'English' },
  { key: 'zh', label: '中文简体' },
  { key: 'id', label: 'Bahasa Indonesia' },
  { key: 'ja', label: '日本語' },
  { key: 'ko', label: '한국어' },
  { key: 'th', label: 'ภาษาไทย' },
];

export const serviceTypeTranslationKeys: Record<string, string> = {
  ask_affinity: "usageReceiptModal.serviceType.ask_any_question",
  ask_any_question: "usageReceiptModal.serviceType.ask_any_question",
  personalized_love_forecast_12mth: "usageReceiptModal.serviceType.personalized_love_forecast_12mth",
  love_report: "usageReceiptModal.serviceType.personalized_love_forecast_12mth",
  transit_report: "usageReceiptModal.serviceType.transit_report",
  relationship_report: "usageReceiptModal.serviceType.relationship_compatibility",
  relationship_compatibility: "usageReceiptModal.serviceType.relationship_compatibility",
  ask_secret_diary: "usageReceiptModal.serviceType.ask_secret_diary",
  secret_diary: "usageReceiptModal.serviceType.ask_secret_diary",
};
