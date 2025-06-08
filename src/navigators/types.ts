import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type MainNavigatorParamList = {
    Welcome: undefined;
    LanguageSelection: undefined;
    SignIn: undefined;
    SignUp: undefined;
    Otp: {
        email: string
    };
    OtpSuccess: undefined;
    Introduction: undefined;
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
};

declare global {
    namespace ReactNavigation {
        interface RootParamList extends MainNavigatorParamList { }
    }
}