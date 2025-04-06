import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
} from 'react-native-reanimated';

const Cube = ({ animatedStyle }) => {
    return (
        <Animated.View style={[styles.cubeContainer, animatedStyle]}>
            <View style={[styles.face, styles.front]} />
            <View style={[styles.face, styles.back]} />
            <View style={[styles.face, styles.left]} />
            <View style={[styles.face, styles.right]} />
            <View style={[styles.face, styles.top]} />
            <View style={[styles.face, styles.bottom]} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    cubeContainer: {
        width: 100,
        height: 100,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -50,
        marginTop: -50,
        transform: [{ perspective: 1000 }],
    },
    face: {
        position: 'absolute',
        width: 100,
        height: 100,
        backgroundColor: 'rgba(0, 150, 255, 0.6)',
        borderWidth: 1,
        borderColor: '#000',
    },
    front: {
        transform: [{ rotateY: '0deg' }],
    },
    back: {
        transform: [{ rotateY: '180deg' }],
    },
    left: {
        transform: [{ rotateY: '-90deg' }, { translateX: -50 }],
    },
    right: {
        transform: [{ rotateY: '90deg' }, { translateX: 50 }],
    },
    top: {
        transform: [{ rotateX: '90deg' }, { translateY: -50 }],
    },
    bottom: {
        transform: [{ rotateX: '-90deg' }, { translateY: 50 }],
    },
});

const App = () => {
    const device = useCameraDevice('back');
    const rotation = useSharedValue(0);

    useEffect(() => {
        const requestCameraPermission = async () => {
            const permission = await Camera.requestCameraPermission();
            if (permission === 'denied') console.warn('Camera permission denied');
        };
        requestCameraPermission();
        rotation.value = withRepeat(
            withTiming(360, { duration: 6000, easing: Easing.linear }),
            -1,
            false
        );
    }, []);

    // Apply rotation to cube
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { rotateX: `${rotation.value}deg` },
                { rotateY: `${rotation.value}deg` },
            ],
        };
    });

    if (!device) {
        return (
            <View style={styles.container}>
                <Text>No camera available</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera style={StyleSheet.absoluteFill} device={device} isActive={true} />
            <Cube animatedStyle={animatedStyle} />
        </View>
    );
};

export default App;
