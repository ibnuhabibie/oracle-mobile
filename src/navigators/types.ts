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
    Profile: undefined;
    EditProfile: undefined;
    PasswordSetting: undefined;
    PrivacyPolicy: undefined;
    PurchaseHistory: undefined;
    MbtiResults: undefined;
    AstrologyResults: undefined;
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