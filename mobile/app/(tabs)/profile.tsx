import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";

export default function ProfileTab() {
  const { user, profile, signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <SafeAreaView style={s.container} edges={["top"]}>
        <View style={s.authPrompt}>
          <View style={s.authIconOuter}>
            <View style={s.authIconInner}>
              <Feather name="user" size={32} color={colors.accent} />
            </View>
          </View>
          <Text style={s.authTitle}>Your Profile</Text>
          <Text style={s.authSub}>
            Create an account to build your profile, upload your resume, apply to jobs, and track applications.
          </Text>
          <Pressable
            style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
            onPress={() => router.push("/auth/sign-up")}
          >
            <Text style={s.primaryBtnText}>Create Account</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/auth/sign-in")} style={{ marginTop: 12 }}>
            <Text style={s.linkText}>Already have an account? <Text style={{ color: colors.accent }}>Sign In</Text></Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const completionSteps = [
    { done: !!profile?.full_name, label: "Add your name" },
    { done: !!profile?.headline, label: "Add a headline" },
    { done: (profile?.skills?.length ?? 0) > 0, label: "Add skills" },
    { done: !!profile?.resume_url, label: "Upload resume" },
  ];
  const completedCount = completionSteps.filter((s) => s.done).length;
  const isComplete = completedCount === completionSteps.length;
  const isEmployer = profile?.user_role === "employer";

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.screenTitle}>Profile</Text>
          <Pressable onPress={signOut} style={s.signOutBtn} accessibilityLabel="Sign out">
            <Feather name="log-out" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={s.avatarCircle}>
            <Feather name="user" size={28} color={colors.accent} />
          </View>
          <Text style={s.name}>{profile?.full_name || "Complete your profile"}</Text>
          <Text style={s.headline}>{profile?.headline || user.email}</Text>
          {profile?.location && (
            <View style={s.locRow}>
              <Feather name="map-pin" size={12} color={colors.mutedForeground} />
              <Text style={s.locText}>{profile.location}</Text>
            </View>
          )}
          {profile?.skills && profile.skills.length > 0 && (
            <View style={s.skillsRow}>
              {profile.skills.slice(0, 5).map((sk) => (
                <View key={sk} style={s.skillChip}>
                  <Text style={s.skillText}>{sk}</Text>
                </View>
              ))}
              {profile.skills.length > 5 && (
                <Text style={s.moreSkills}>+{profile.skills.length - 5}</Text>
              )}
            </View>
          )}
          <Pressable
            style={({ pressed }) => [s.editBtn, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/profile/edit")}
          >
            <Feather name="edit-2" size={14} color={colors.accent} />
            <Text style={s.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Completion progress */}
        {!isComplete && (
          <View style={s.progressCard}>
            <View style={s.progressHeader}>
              <Text style={s.progressTitle}>Complete your profile</Text>
              <Text style={s.progressCount}>{completedCount}/{completionSteps.length}</Text>
            </View>
            <View style={s.progressBar}>
              <View style={[s.progressFill, { width: `${(completedCount / completionSteps.length) * 100}%` }]} />
            </View>
            {completionSteps.filter((step) => !step.done).map((step) => (
              <View key={step.label} style={s.stepRow}>
                <Feather name="circle" size={14} color={colors.mutedForeground} />
                <Text style={s.stepText}>{step.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Menu items */}
        <View style={s.menuSection}>
          <Text style={s.menuLabel}>JOB SEEKER</Text>
          <MenuItem icon="send" label="My Applications" onPress={() => router.push("/applications")} />
          <MenuItem icon="bookmark" label="Saved Jobs" onPress={() => router.push("/(tabs)/saved")} />
          <MenuItem icon="file-text" label="Resume" badge={profile?.resume_url ? "Uploaded" : "Not set"} onPress={() => router.push("/profile/edit")} />
        </View>

        {isEmployer && (
          <View style={s.menuSection}>
            <Text style={s.menuLabel}>EMPLOYER</Text>
            <MenuItem icon="plus-circle" label="Post a Job" onPress={() => router.push("/employer/post-job")} />
            <MenuItem icon="briefcase" label="My Job Posts" onPress={() => router.push("/employer/my-jobs")} />
          </View>
        )}

        <View style={s.menuSection}>
          <Text style={s.menuLabel}>ACCOUNT</Text>
          <MenuItem icon="settings" label="Settings" onPress={() => {}} />
          <MenuItem icon="help-circle" label="Help & Support" onPress={() => {}} />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, badge, onPress }: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [s.menuItem, pressed && { backgroundColor: colors.muted }]}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={s.menuIconCircle}>
        <Feather name={icon} size={16} color={colors.accent} />
      </View>
      <Text style={s.menuItemText}>{label}</Text>
      {badge && <Text style={s.menuBadge}>{badge}</Text>}
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  screenTitle: { fontSize: 26, fontWeight: "900", color: colors.foreground },
  signOutBtn: { padding: 8 },

  profileCard: {
    backgroundColor: colors.card, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: "center",
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center",
    marginBottom: 12,
  },
  name: { fontSize: fontSize.xl, fontWeight: "800", color: colors.foreground },
  headline: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 2 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  locText: { color: colors.mutedForeground, fontSize: fontSize.sm },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 12, justifyContent: "center" },
  skillChip: { backgroundColor: `${colors.accent}12`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  skillText: { color: colors.accent, fontSize: 11, fontWeight: "500" },
  moreSkills: { color: colors.mutedForeground, fontSize: 11, alignSelf: "center" },
  editBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderColor: `${colors.accent}30`, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 10, marginTop: 16,
  },
  editBtnText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },

  progressCard: {
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16, marginTop: 12,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  progressTitle: { color: colors.foreground, fontSize: fontSize.sm, fontWeight: "600" },
  progressCount: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "700" },
  progressBar: {
    height: 4, backgroundColor: colors.muted, borderRadius: 2, marginBottom: 12, overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: colors.accent, borderRadius: 2 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  stepText: { color: colors.mutedForeground, fontSize: fontSize.sm },

  menuSection: { marginTop: 20 },
  menuLabel: {
    color: colors.mutedForeground, fontSize: 11, fontWeight: "800",
    letterSpacing: 1.5, marginBottom: 8, paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 6,
  },
  menuIconCircle: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: `${colors.accent}10`, justifyContent: "center", alignItems: "center",
  },
  menuItemText: { flex: 1, color: colors.foreground, fontSize: fontSize.base, fontWeight: "500" },
  menuBadge: { color: colors.mutedForeground, fontSize: fontSize.xs },

  // Auth prompt
  authPrompt: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  authIconOuter: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: `${colors.accent}08`, justifyContent: "center", alignItems: "center",
  },
  authIconInner: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: `${colors.accent}15`, justifyContent: "center", alignItems: "center",
  },
  authTitle: { fontSize: fontSize["2xl"], fontWeight: "900", color: colors.foreground, marginTop: 20 },
  authSub: {
    color: colors.mutedForeground, fontSize: fontSize.base,
    textAlign: "center", marginTop: 8, lineHeight: 22, maxWidth: 300,
  },
  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: 16, paddingHorizontal: 40, paddingVertical: 16, marginTop: 24,
  },
  primaryBtnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "800" },
  linkText: { color: colors.mutedForeground, fontSize: fontSize.sm },
});
