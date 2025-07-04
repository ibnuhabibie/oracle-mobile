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
    };

    FortuneReport: undefined;
    FortuneReportResult: {
        result: any
    };

    RelationReport: undefined;
    RelationReportResult: {
        result: any
        love_profile: any
    };

    TopUp: undefined;

    Profile: undefined;
    EditProfile: undefined;
    PasswordSetting: undefined;
    PrivacyPolicy: undefined;
    PurchaseHistory: undefined;
    MbtiResults: undefined;
    AstrologyResults: undefined;
    AffinityResults: { affinityResult: any; question: string };
    BaziResults: undefined;
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
