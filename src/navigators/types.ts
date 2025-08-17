import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainNavigatorParamList = {
    Welcome: undefined;
    LanguageSelection: undefined;
    SignIn: undefined;
    SignUp: undefined;
    OtpVerification: {
        email: string
    };
    OtpSuccess: undefined;
    Onboarding: undefined;
    MbtiQuiz: undefined;

    // dev
    ComponentGallery: undefined;

    Tabs: undefined;
    Home: undefined;
    AskAffinity: undefined;

    Echo: undefined;
    EchoDetail: {
        id?: string,
        date: Date
    };

    LoveForecast: undefined;
    LoveReportResult: {
        result: any
        job_id: string
    };

    FortuneReport: undefined;
    FortuneReportResult: {
        result: any
        job_id: string
    };

    RelationReport: undefined;
    RelationReportResult: {
        result: any
        love_profile: any
        job_id: string
    };

    TopUp: undefined;

    Profile: undefined;
    EditProfile: undefined;
    PasswordSetting: undefined;
    PrivacyPolicy: undefined;
    PurchaseHistory: undefined;
    MbtiResults: undefined;
    AstrologyResults: { profile_astro?: Record<string, any> };
    AffinityResults: { affinityResult: any; question: string };
    BaziResults: { profile_bazi: any };
    WebviewContent: {
        uri: string
        title: string
    };
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainNavigatorParamList { }
    }
}
