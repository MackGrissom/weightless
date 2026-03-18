import { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  runOnJS,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { AuthProvider } from "@/lib/auth";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { colors } from "@/lib/theme";

function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const featherScale = useSharedValue(0.3);
  const featherRotate = useSharedValue(-30);
  const featherOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(20);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    featherOpacity.value = withTiming(1, { duration: 400 });
    featherScale.value = withSequence(
      withSpring(1.15, { damping: 8, stiffness: 120 }),
      withSpring(1, { damping: 12, stiffness: 100 }),
    );
    featherRotate.value = withSequence(
      withSpring(15, { damping: 6, stiffness: 80 }),
      withSpring(0, { damping: 10, stiffness: 100 }),
    );

    textOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    textY.value = withDelay(500, withSpring(0, { damping: 12, stiffness: 100 }));

    containerOpacity.value = withDelay(
      2200,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.ease) }, () => {
        runOnJS(onFinish)();
      }),
    );
  }, []);

  const featherStyle = useAnimatedStyle(() => ({
    opacity: featherOpacity.value,
    transform: [
      { scale: featherScale.value },
      { rotate: `${featherRotate.value}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[sp.container, containerStyle]}>
      <View style={sp.content}>
        <Animated.View style={featherStyle}>
          <View style={sp.iconCircle}>
            <Feather name="feather" size={44} color={colors.accent} />
          </View>
        </Animated.View>
        <Animated.View style={textStyle}>
          <Text style={sp.title}>Weightless</Text>
          <Text style={sp.subtitle}>Remote jobs for digital nomads</Text>
        </Animated.View>
      </View>
      <Text style={sp.footer}>Work from anywhere</Text>
    </Animated.View>
  );
}

const sp = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  content: { alignItems: "center", gap: 28 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 30,
    backgroundColor: `${colors.accent}10`,
    justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: `${colors.accent}20`,
  },
  title: { fontSize: 34, fontWeight: "900", color: colors.foreground, textAlign: "center", letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: colors.mutedForeground, textAlign: "center", marginTop: 6 },
  footer: {
    position: "absolute", bottom: 60,
    fontSize: 11, color: colors.mutedForeground, letterSpacing: 2,
    textTransform: "uppercase", fontWeight: "500",
  },
});

export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);
  const onFinish = useCallback(() => setSplashDone(true), []);

  return (
    <ErrorBoundary>
    <AuthProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      />
      {!splashDone && <AnimatedSplash onFinish={onFinish} />}
    </AuthProvider>
    </ErrorBoundary>
  );
}
