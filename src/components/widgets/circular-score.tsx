import React, { Component } from 'react';
import { View, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../../constants/colors';
import { AppText } from '../ui/app-text';
// i18n
import { useTranslation } from 'react-i18next';

export interface CircularScoreProps {
    value?: number;
    size?: number;
    strokeWidth?: number;
    type?: 'wealth' | 'learning' | 'relation' | 'career';
}

interface CircularScoreState {
    imageSrc: ImageSourcePropType | null;
}

class CircularScore extends Component<CircularScoreProps, CircularScoreState> {
    constructor(props: CircularScoreProps) {
        super(props);
        this.state = {
            imageSrc: null,
        };
    }

    componentDidMount(): void {
        if (this.props.type === 'wealth') {
            this.setState({
                imageSrc: require('../../assets/icons/daily-dashboard/wealth-daily.png')
            });
        } else if (this.props.type === 'learning') {
            this.setState({
                imageSrc: require('../../assets/icons/daily-dashboard/learning-daily.png')
            });
        } else if (this.props.type === 'relation') {
            this.setState({
                imageSrc: require('../../assets/icons/daily-dashboard/relation-daily.png')
            });
        } else if (this.props.type === 'career') {
            this.setState({
                imageSrc: require('../../assets/icons/daily-dashboard/career-daily.png')
            });
        }
    }

    render() {
        const {
            value = 50,
            size = 60,
            strokeWidth = 2,
            type = 'wealth'
        } = this.props;

        const { imageSrc } = this.state;

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
                        stroke="#e6e6e6"
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
                    <Image
                        source={imageSrc as ImageSourcePropType}
                        style={imageStyle}
                        resizeMode="cover"
                    />
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
        textAlign: 'center',
        textTransform: 'capitalize',
    }
});

export default CircularScore;
