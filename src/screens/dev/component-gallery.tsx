import React, { Component } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { AppButton } from '../../components/ui/app-button';
import { MainNavigatorParamList } from '../../navigators/types';
import ScreenContainer from '../../components/layouts/screen-container';

type Props = {
    navigation: NativeStackNavigationProp<MainNavigatorParamList, 'ComponentGalery'>;
};

class ComponentGallery extends Component<Props> {
    render() {
        return (
            <ScreenContainer>
                <View style={{ flex: 1, gap: 8 }}>
                    <Text style={{ fontSize: 24 }}>Component Gallery</Text>

                    <Text style={{}}>Primary Button</Text>
                    <AppButton title="Primary" variant="primary" />

                    <Text>Secondary Button</Text>
                    <AppButton title="Secondary" variant="secondary" />

                    <Text>Outline Button</Text>
                    <AppButton title="Outline" variant="outline" />

                    <Text>Text Button</Text>
                    <AppButton title="Text" variant="text" />
                </View>
            </ScreenContainer>
        );
    }
}

export default ComponentGallery;
