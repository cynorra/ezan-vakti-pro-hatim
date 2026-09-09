import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, Image, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onFinish: () => void;
}

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const { t } = useTranslation();
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.4)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(12)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const crescentRotate = useRef(new Animated.Value(0)).current;
  const twinkle1 = useRef(new Animated.Value(0)).current;
  const twinkle2 = useRef(new Animated.Value(0)).current;
  const twinkle3 = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(crescentRotate, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const twinkleLoop = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(value, { toValue: 1, duration: 900, delay, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(value, { toValue: 0.2, duration: 900, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ])
      );
    twinkleLoop(twinkle1, 0).start();
    twinkleLoop(twinkle2, 300).start();
    twinkleLoop(twinkle3, 600).start();

    const sequence = Animated.sequence([
      Animated.parallel([
        Animated.spring(glowScale, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(titleTranslateY, { toValue: 0, duration: 400, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
      Animated.timing(subtitleOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.delay(650),
    ]);

    sequence.start(() => {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 380,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onFinish());
    });
  }, []);

  const rotateInterpolate = crescentRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, { opacity: containerOpacity, zIndex: 999 }]} pointerEvents="none">
      <LinearGradient colors={['#0d7a3e', '#0A5C36', '#052F1C']} style={StyleSheet.absoluteFill} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} />

      <Animated.View style={[styles.star, { top: height * 0.16, left: width * 0.18, opacity: twinkle1 }]}>
        <Ionicons name="sparkles" size={14} color="#F4D03F" />
      </Animated.View>
      <Animated.View style={[styles.star, { top: height * 0.24, right: width * 0.15, opacity: twinkle2 }]}>
        <Ionicons name="sparkles" size={10} color="#F4D03F" />
      </Animated.View>
      <Animated.View style={[styles.star, { bottom: height * 0.28, left: width * 0.22, opacity: twinkle3 }]}>
        <Ionicons name="sparkles" size={12} color="#F4D03F" />
      </Animated.View>

      <Animated.View style={[styles.crescentWrap, { transform: [{ rotate: rotateInterpolate }] }]}>
        <Ionicons name="moon" size={28} color="rgba(244, 208, 63, 0.35)" style={styles.crescentTop} />
      </Animated.View>

      <Animated.View style={styles.center}>
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowOpacity,
              transform: [{ scale: glowScale }],
            },
          ]}
        />
        <Animated.View
          style={{
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <Image source={require('../assets/icon.png')} style={styles.logo} resizeMode="cover" />
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            { opacity: titleOpacity, transform: [{ translateY: titleTranslateY }] },
          ]}
        >
          Ezan Vakti
        </Animated.Text>
        <Animated.Text style={[styles.titleAccent, { opacity: titleOpacity }]}>+ Hatim</Animated.Text>

        <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
          {t('splash.subtitle')}
        </Animated.Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(212, 175, 55, 0.18)',
  },
  logo: {
    width: 108,
    height: 108,
    borderRadius: 28,
  },
  title: {
    marginTop: 22,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  titleAccent: {
    fontSize: 15,
    fontWeight: '600',
    color: '#F4D03F',
    letterSpacing: 2,
    marginTop: 2,
  },
  subtitle: {
    marginTop: 14,
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.3,
  },
  star: {
    position: 'absolute',
  },
  crescentWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crescentTop: {
    position: 'absolute',
    top: '12%',
    right: '20%',
  },
});
