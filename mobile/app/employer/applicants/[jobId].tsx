import { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, Pressable, RefreshControl,
  StyleSheet, ActivityIndicator, Alert, Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { getResumeUrl } from "@/lib/storage";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";
import type { Application, ApplicationStatus } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  submitted: { label: "New", color: "#60a5fa" },
  viewed: { label: "Viewed", color: colors.mutedForeground },
  shortlisted: { label: "Shortlisted", color: colors.success },
  rejected: { label: "Rejected", color: "#ef4444" },
  withdrawn: { label: "Withdrawn", color: colors.mutedForeground },
};

export default function ApplicantsScreen() {
  useRequireAuth();
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    if (!jobId) return;
    const [appsRes, jobRes] = await Promise.all([
      supabase
        .from("applications")
        .select("*, profile:profiles(*)")
        .eq("job_id", jobId)
        .order("created_at", { ascending: false }),
      supabase.from("jobs").select("title").eq("id", jobId).single(),
    ]);
    if (appsRes.data) setApplications(appsRes.data as Application[]);
    if (jobRes.data) setJobTitle(jobRes.data.title);
  }, [jobId]);

  useEffect(() => { fetch().finally(() => setLoading(false)); }, [fetch]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  }, [fetch]);

  const updateStatus = async (appId: string, status: ApplicationStatus) => {
    await supabase.from("applications").update({ status, updated_at: new Date().toISOString() }).eq("id", appId);
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
  };

  const openResume = async (resumeUrl: string | null) => {
    if (!resumeUrl) { Alert.alert("No Resume", "This applicant hasn't uploaded a resume."); return; }
    const url = await getResumeUrl(resumeUrl);
    if (url) Linking.openURL(url);
    else Alert.alert("Error", "Could not load resume.");
  };

  if (loading) {
    return (
      <SafeAreaView style={s.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={s.headerTitle}>Applicants</Text>
          <Text style={s.headerSub} numberOfLines={1}>{jobTitle}</Text>
        </View>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        renderItem={({ item }) => {
          const p = item.profile;
          const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.submitted;

          return (
            <View style={s.card}>
              {/* Applicant info */}
              <View style={s.cardTop}>
                <View style={s.avatarCircle}>
                  <Feather name="user" size={18} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.name}>{p?.full_name || "Anonymous"}</Text>
                  <Text style={s.headline}>{p?.headline || p?.email || ""}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: `${status.color}15` }]}>
                  <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
              </View>

              {/* Skills */}
              {p?.skills && p.skills.length > 0 && (
                <View style={s.skillsRow}>
                  {p.skills.slice(0, 5).map((sk) => (
                    <View key={sk} style={s.skillChip}>
                      <Text style={s.skillText}>{sk}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Cover letter preview */}
              {item.cover_letter && (
                <Text style={s.coverPreview} numberOfLines={2}>
                  {item.cover_letter}
                </Text>
              )}

              {/* Actions */}
              <View style={s.actions}>
                <Pressable style={s.actionBtn} onPress={() => openResume(item.resume_url)}>
                  <Feather name="file-text" size={14} color={colors.accent} />
                  <Text style={s.actionText}>Resume</Text>
                </Pressable>

                {item.status !== "shortlisted" && (
                  <Pressable
                    style={[s.actionBtn, { backgroundColor: `${colors.success}12` }]}
                    onPress={() => updateStatus(item.id, "shortlisted")}
                  >
                    <Feather name="star" size={14} color={colors.success} />
                    <Text style={[s.actionText, { color: colors.success }]}>Shortlist</Text>
                  </Pressable>
                )}

                {item.status !== "rejected" && (
                  <Pressable
                    style={[s.actionBtn, { backgroundColor: "#ef444412" }]}
                    onPress={() => {
                      Alert.alert("Reject", "Mark this applicant as not selected?", [
                        { text: "Cancel" },
                        { text: "Reject", style: "destructive", onPress: () => updateStatus(item.id, "rejected") },
                      ]);
                    }}
                  >
                    <Feather name="x" size={14} color="#ef4444" />
                    <Text style={[s.actionText, { color: "#ef4444" }]}>Reject</Text>
                  </Pressable>
                )}
              </View>

              <Text style={s.dateText}>
                Applied {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="users" size={36} color={colors.mutedForeground} />
            <Text style={s.emptyTitle}>No applicants yet</Text>
            <Text style={s.emptyText}>Applications will appear here as candidates apply.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  headerSub: { fontSize: fontSize.xs, color: colors.mutedForeground, marginTop: 1 },
  list: { padding: spacing.md },
  card: {
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 10,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center",
  },
  name: { color: colors.foreground, fontSize: 15, fontWeight: "600" },
  headline: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: "600" },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 10 },
  skillChip: { backgroundColor: `${colors.accent}10`, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  skillText: { color: colors.accent, fontSize: 10, fontWeight: "500" },
  coverPreview: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 10, fontStyle: "italic", lineHeight: 18 },
  actions: { flexDirection: "row", gap: 6, marginTop: 12 },
  actionBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: `${colors.accent}10`, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8,
  },
  actionText: { color: colors.accent, fontSize: 12, fontWeight: "600" },
  dateText: { color: colors.mutedForeground, fontSize: 11, marginTop: 10 },
  empty: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyTitle: { color: colors.foreground, fontSize: fontSize.lg, fontWeight: "600" },
  emptyText: { color: colors.mutedForeground, fontSize: fontSize.sm, textAlign: "center", maxWidth: 260 },
});
