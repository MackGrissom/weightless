import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, Pressable,
  StyleSheet, ActivityIndicator, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { CompanyAvatar } from "@/components/CompanyAvatar";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";
import type { Job } from "@/lib/types";

export default function ApplyScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { user, profile } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    if (!slug || !user) return;
    (async () => {
      const [jobRes, appRes] = await Promise.all([
        supabase.from("jobs").select("*, company:companies(*), category:categories(*)").eq("slug", slug).single(),
        supabase.from("applications").select("id").eq("user_id", user.id).eq("job_id", slug).maybeSingle(),
      ]);
      if (jobRes.data) {
        setJob(jobRes.data as Job);
        // Check if already applied with the actual job ID
        const { data: existing } = await supabase
          .from("applications")
          .select("id")
          .eq("user_id", user.id)
          .eq("job_id", jobRes.data.id)
          .maybeSingle();
        if (existing) setAlreadyApplied(true);
      }
      setLoading(false);
    })();
  }, [slug, user]);

  const handleSubmit = async () => {
    if (!user || !job) return;
    setSubmitting(true);

    const { error } = await supabase.from("applications").insert({
      user_id: user.id,
      job_id: job.id,
      cover_letter: coverLetter.trim() || null,
      resume_url: profile?.resume_url || null,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        Alert.alert("Already Applied", "You've already applied to this job.");
      } else {
        Alert.alert("Error", "Failed to submit application. Please try again.");
      }
      return;
    }

    Alert.alert(
      "Application Submitted",
      `Your application for ${job.title} has been sent.`,
      [{ text: "OK", onPress: () => router.back() }]
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={s.center}>
        <Feather name="lock" size={32} color={colors.mutedForeground} />
        <Text style={s.centerTitle}>Sign in to apply</Text>
        <Pressable style={s.primaryBtn} onPress={() => router.push("/auth/sign-in")}>
          <Text style={s.primaryBtnText}>Sign In</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={s.center}>
        <Text style={s.centerTitle}>Job not found</Text>
      </SafeAreaView>
    );
  }

  const profileComplete = profile?.full_name && profile?.headline && (profile?.skills?.length ?? 0) > 0;

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} accessibilityLabel="Go back">
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </Pressable>
        <Text style={s.headerTitle}>Apply</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Job summary */}
        <View style={s.jobCard}>
          <CompanyAvatar
            logoUrl={job.company?.logo_url}
            companyName={job.company?.name || ""}
            jobTitle={job.title}
            categorySlug={job.category?.slug}
            size={44}
          />
          <View style={{ flex: 1 }}>
            <Text style={s.jobTitle} numberOfLines={2}>{job.title}</Text>
            <Text style={s.jobCompany}>{job.company?.name}</Text>
          </View>
        </View>

        {alreadyApplied ? (
          <View style={s.appliedCard}>
            <Feather name="check-circle" size={24} color={colors.success} />
            <Text style={s.appliedTitle}>Already Applied</Text>
            <Text style={s.appliedText}>
              You've already submitted an application for this position.
            </Text>
            <Pressable
              style={s.secondaryBtn}
              onPress={() => router.push("/applications")}
            >
              <Text style={s.secondaryBtnText}>View My Applications</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Profile summary */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>YOUR PROFILE</Text>
              {!profileComplete && (
                <View style={s.warning}>
                  <Feather name="alert-circle" size={16} color="#fbbf24" />
                  <Text style={s.warningText}>
                    Complete your profile for a stronger application
                  </Text>
                  <Pressable onPress={() => router.push("/profile/edit")}>
                    <Text style={s.warningLink}>Edit</Text>
                  </Pressable>
                </View>
              )}
              <View style={s.profileCard}>
                <Text style={s.profileName}>{profile?.full_name || "No name set"}</Text>
                <Text style={s.profileHeadline}>{profile?.headline || "No headline"}</Text>
                {profile?.skills && profile.skills.length > 0 && (
                  <View style={s.skillsRow}>
                    {profile.skills.slice(0, 5).map((sk) => (
                      <View key={sk} style={s.skillChip}>
                        <Text style={s.skillText}>{sk}</Text>
                      </View>
                    ))}
                  </View>
                )}
                <View style={s.resumeRow}>
                  <Feather
                    name={profile?.resume_url ? "file-text" : "file"}
                    size={14}
                    color={profile?.resume_url ? colors.success : colors.mutedForeground}
                  />
                  <Text style={[s.resumeText, profile?.resume_url && { color: colors.success }]}>
                    {profile?.resume_url ? "Resume attached" : "No resume uploaded"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Cover letter */}
            <View style={s.section}>
              <Text style={s.sectionLabel}>COVER LETTER (OPTIONAL)</Text>
              <TextInput
                style={s.textArea}
                placeholder="Tell the employer why you're a great fit for this role..."
                placeholderTextColor={colors.mutedForeground}
                value={coverLetter}
                onChangeText={setCoverLetter}
                multiline
                numberOfLines={6}
                maxLength={2000}
                textAlignVertical="top"
              />
              <Text style={s.charCount}>{coverLetter.length}/2000</Text>
            </View>

            {/* Submit */}
            <Pressable
              style={({ pressed }) => [s.submitBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
              onPress={handleSubmit}
              disabled={submitting}
              accessibilityLabel="Submit application"
            >
              {submitting ? (
                <ActivityIndicator size="small" color={colors.accentForeground} />
              ) : (
                <>
                  <Feather name="send" size={18} color={colors.accentForeground} />
                  <Text style={s.submitText}>Submit Application</Text>
                </>
              )}
            </Pressable>
          </>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", gap: 12, padding: spacing.xl },
  centerTitle: { color: colors.foreground, fontSize: fontSize.lg, fontWeight: "600" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  scroll: { padding: spacing.md },
  jobCard: {
    flexDirection: "row", gap: 12, padding: 16,
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  jobTitle: { color: colors.foreground, fontSize: fontSize.base, fontWeight: "700", lineHeight: 20 },
  jobCompany: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 2 },

  appliedCard: {
    alignItems: "center", padding: 32,
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, marginTop: 20, gap: 8,
  },
  appliedTitle: { color: colors.success, fontSize: fontSize.lg, fontWeight: "700" },
  appliedText: { color: colors.mutedForeground, textAlign: "center", fontSize: fontSize.sm },

  section: { marginTop: 24 },
  sectionLabel: {
    color: colors.mutedForeground, fontSize: 11, fontWeight: "800",
    letterSpacing: 1.5, marginBottom: 10,
  },
  warning: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#fbbf2412", borderRadius: 12, padding: 12, marginBottom: 10,
  },
  warningText: { color: "#fbbf24", fontSize: fontSize.sm, flex: 1 },
  warningLink: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  profileCard: {
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  profileName: { color: colors.foreground, fontSize: fontSize.lg, fontWeight: "700" },
  profileHeadline: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 2 },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 10 },
  skillChip: {
    backgroundColor: `${colors.accent}12`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  skillText: { color: colors.accent, fontSize: 11, fontWeight: "500" },
  resumeRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 12 },
  resumeText: { color: colors.mutedForeground, fontSize: fontSize.sm },

  textArea: {
    backgroundColor: colors.muted, borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    padding: 16, color: colors.foreground, fontSize: fontSize.base,
    minHeight: 140, lineHeight: 22,
  },
  charCount: { color: colors.mutedForeground, fontSize: 11, textAlign: "right", marginTop: 4 },

  submitBtn: {
    backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 24,
  },
  submitText: { color: colors.accentForeground, fontSize: 17, fontWeight: "800" },

  primaryBtn: {
    backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14,
  },
  primaryBtnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
  secondaryBtn: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10, marginTop: 12,
  },
  secondaryBtnText: { color: colors.foreground, fontSize: fontSize.sm, fontWeight: "500" },
});
