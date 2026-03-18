import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";

export default function SignUp() {
  const { signUp } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) return;
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    setError("");
    const { error } = await signUp(email, password);
    setLoading(false);
    if (error) setError(error);
    else setSuccess(true);
  };

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successView}>
          <View style={styles.checkCircle}>
            <Feather name="check" size={36} color={colors.accent} />
          </View>
          <Text style={styles.title}>Check your email</Text>
          <Text style={styles.subtitle}>
            We sent a confirmation link to {email}. Tap it to activate your account, then sign in.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
            onPress={() => router.replace("/auth/sign-in")}
          >
            <Text style={styles.btnText}>Go to Sign In</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.content}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={colors.foreground} />
        </Pressable>

        <View style={styles.header}>
          <Feather name="feather" size={32} color={colors.accent} />
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>Join Weightless and start applying to remote jobs</Text>
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
            placeholder="Password (6+ characters)"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="new-password"
          />
          <Pressable
            style={({ pressed }) => [styles.btn, pressed && { opacity: 0.8 }]}
            onPress={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.accentForeground} />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </Pressable>
        </View>

        <Pressable onPress={() => router.replace("/auth/sign-in")} style={styles.switchBtn}>
          <Text style={styles.switchText}>Already have an account? <Text style={{ color: colors.accent }}>Sign In</Text></Text>
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
  subtitle: { color: colors.mutedForeground, fontSize: fontSize.base, marginTop: spacing.xs, textAlign: "center", maxWidth: 280 },
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
  successView: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  checkCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: `${colors.accent}15`, justifyContent: "center", alignItems: "center",
    marginBottom: spacing.lg,
  },
});
