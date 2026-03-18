import { Component, type ReactNode } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.iconCircle}>
            <Feather name="alert-triangle" size={32} color={colors.accent} />
          </View>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            The app ran into an unexpected error. Try restarting.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Feather name="refresh-cw" size={16} color={colors.accentForeground} />
            <Text style={styles.btnText}>Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: colors.background,
    justifyContent: "center", alignItems: "center", padding: spacing.xl,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: { fontSize: fontSize.xl, fontWeight: "800", color: colors.foreground },
  message: {
    fontSize: fontSize.base, color: colors.mutedForeground,
    textAlign: "center", marginTop: spacing.sm, lineHeight: 22, maxWidth: 280,
  },
  btn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.accent, borderRadius: borderRadius.lg,
    paddingHorizontal: 24, paddingVertical: 14, marginTop: spacing.lg,
  },
  btnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
});
