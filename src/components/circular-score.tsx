import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '../constants/colors';
import { AppText } from './ui/app-text';

class CircularScore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageSrc: null,
        };
    }

    componentDidMount(): void {
        if (this.props.type === 'wealth') {
            this.setState({
                imageSrc: require('../assets/icons/wealth-daily.png')
            });
        } else if (this.props.type === 'learning') {
            this.setState({
                imageSrc: require('../assets/icons/learning-daily.png')
            });
        } else if (this.props.type === 'relation') {
            this.setState({
                imageSrc: require('../assets/icons/relation-daily.png')
            });
        } else if (this.props.type === 'career') {
            this.setState({
                imageSrc: require('../assets/icons/career-daily.png')
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

        const { imageSrc } = this.state

        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference * (1 - value / 100);

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
                <View style={styles.imageContainer(size)}>
                    <Image
                        source={imageSrc}
                        style={styles.image(size / 2)}
                        resizeMode="cover"
                    />
                </View>
                <AppText color='primary' variant='body1' style={styles.iconText}>
                    {type}
                </AppText>
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
    imageContainer: (size) => ({
        width: size,
        height: size,
        justifyContent: 'center',
        alignItems: 'center',
    }),
    image: (size) => ({
        width: size,
        height: size,
    }),
    iconText: {
        textAlign: 'center',
        textTransform: 'capitalize',
    }
});

export default CircularScore;
