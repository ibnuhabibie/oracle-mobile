import React, { Component } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { AppText } from '../ui/app-text';
import WealthIcon from '../icons/daily-dashboard/wealth-icon';
import RelationIcon from '../icons/daily-dashboard/relation-icon';
import CareerIcon from '../icons/daily-dashboard/career-icon';
// i18n
import { useTranslation } from 'react-i18next';
import LearningIcon from '../icons/daily-dashboard/learning-icon';

export interface CircularScoreProps {
    value?: number;
    size?: number;
    strokeWidth?: number;
    type?: 'wealth' | 'learning' | 'relation' | 'career';
}

class CircularScore extends Component<CircularScoreProps> {
    render() {
        const {
            value = 50,
            size = 60,
            strokeWidth = 2,
            type = 'wealth'
        } = this.props;

        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference * (1 - value / 100);

        // i18n
        // Use hook in a functional wrapper
        function TranslatedType() {
            const { t } = useTranslation();
            return (
                <AppText color='primary' variant='body1' style={styles.iconText}>
                    {t(type)}
                </AppText>
            );
        }

        // Dynamic styles for image container and image
        const imageContainerStyle = {
            ...styles.imageContainer,
            width: size,
            height: size,
        };
        const imageStyle = {
            ...styles.image,
            width: size / 2,
            height: size / 2,
        };

        // Dynamic icon rendering
        let iconElement = null;
        if (type === 'wealth') {
            iconElement = <WealthIcon width={size / 2} height={size / 2} />;
        } else if (type === 'learning') {
            iconElement = <LearningIcon width={size / 2} height={size / 2} />;
        } else if (type === 'relation') {
            iconElement = <RelationIcon width={size / 2} height={size / 2} />;
        } else if (type === 'career') {
            iconElement = <CareerIcon width={size / 2} height={size / 2} />;
        }

        return (
            <View style={{ gap: 6 }}>
                <Svg
                    width={size}
                    height={size}
                    style={[
                        styles.svg,
                        { transform: [{ rotateZ: '90deg' }, { scaleX: -1 }] } // 12 o’clock start & CCW direction
                    ]}
                >
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="transparent"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={COLORS.primary}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </Svg>
                <View style={imageContainerStyle}>
                    {iconElement}
                </View>
                <TranslatedType />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: [{ rotateZ: '230deg' }]
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
    },
    iconText: {
        marginTop: 12,
        textAlign: 'center',
        textTransform: 'capitalize',
    }
});

export default CircularScore;
