import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";

export default function SignIn() {
  const { signIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else router.replace("/(tabs)/profile");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={colors.foreground} />
        </Pressable>

        <View style={styles.header}>
          <Feather name="feather" size={32} color={colors.accent} />
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your Weightless account</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.accentForeground} />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => router.replace("/auth/sign-up")} style={styles.switchBtn}>
          <Text style={styles.switchText}>Don&apos;t have an account? <Text style={{ color: colors.accent }}>Sign Up</Text></Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { flex: 1, padding: spacing.md, justifyContent: "center" },
  backBtn: { position: "absolute", top: spacing.md, left: spacing.md, zIndex: 1, padding: spacing.sm },
  header: { alignItems: "center", marginBottom: spacing.xl },
  title: { fontSize: fontSize["2xl"], fontWeight: "800", color: colors.foreground, marginTop: spacing.md },
  subtitle: { color: colors.mutedForeground, fontSize: fontSize.base, marginTop: spacing.xs },
  error: {
    color: colors.destructive, fontSize: fontSize.sm, textAlign: "center",
    backgroundColor: `${colors.destructive}15`, padding: spacing.sm, borderRadius: borderRadius.md,
    marginBottom: spacing.md, overflow: "hidden",
  },
  form: { gap: spacing.sm },
  input: {
    backgroundColor: colors.muted, borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md, paddingVertical: 16,
    color: colors.foreground, fontSize: fontSize.base,
    borderWidth: 1, borderColor: colors.border,
  },
  btn: {
    backgroundColor: colors.accent, borderRadius: borderRadius.lg,
    paddingVertical: 16, alignItems: "center", marginTop: spacing.sm,
  },
  btnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
  switchBtn: { alignItems: "center", marginTop: spacing.lg },
  switchText: { color: colors.mutedForeground, fontSize: fontSize.sm },
});
