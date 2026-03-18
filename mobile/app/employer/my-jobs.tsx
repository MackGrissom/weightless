import { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, Pressable, RefreshControl,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { CompanyAvatar } from "@/components/CompanyAvatar";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";
import type { Job } from "@/lib/types";

export default function MyJobsScreen() {
  useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<(Job & { application_count: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("jobs")
      .select("*, company:companies(*), category:categories(*)")
      .eq("posted_by", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch application counts
      const jobsWithCounts = await Promise.all(
        (data as Job[]).map(async (job) => {
          const { count } = await supabase
            .from("applications")
            .select("id", { count: "exact", head: true })
            .eq("job_id", job.id);
          return { ...job, application_count: count || 0 };
        })
      );
      setJobs(jobsWithCounts);
    }
  }, [user]);

  useEffect(() => { fetchJobs().finally(() => setLoading(false)); }, [fetchJobs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  }, [fetchJobs]);

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
        <Text style={s.headerTitle}>My Job Posts</Text>
        <Pressable onPress={() => router.push("/employer/post-job")} hitSlop={10}>
          <Feather name="plus" size={24} color={colors.accent} />
        </Pressable>
      </View>

      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
            onPress={() => router.push(`/employer/applicants/${item.id}`)}
          >
            <View style={s.cardRow}>
              <CompanyAvatar
                logoUrl={item.company?.logo_url}
                companyName={item.company?.name || ""}
                jobTitle={item.title}
                size={40}
              />
              <View style={{ flex: 1 }}>
                <Text style={s.cardTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={s.cardMeta}>
                  {item.is_active ? "Active" : "Expired"} · Posted {new Date(item.date_posted).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={s.cardBottom}>
              <View style={s.applicantBadge}>
                <Feather name="users" size={13} color={colors.accent} />
                <Text style={s.applicantText}>
                  {item.application_count} applicant{item.application_count !== 1 ? "s" : ""}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="briefcase" size={36} color={colors.mutedForeground} />
            <Text style={s.emptyTitle}>No jobs posted yet</Text>
            <Pressable style={s.postBtn} onPress={() => router.push("/employer/post-job")}>
              <Feather name="plus" size={16} color={colors.accentForeground} />
              <Text style={s.postBtnText}>Post a Job</Text>
            </Pressable>
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  list: { padding: spacing.md },
  card: {
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 8,
  },
  cardRow: { flexDirection: "row", gap: 12 },
  cardTitle: { color: colors.foreground, fontSize: 15, fontWeight: "600" },
  cardMeta: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 2 },
  cardBottom: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  applicantBadge: { flexDirection: "row", alignItems: "center", gap: 5 },
  applicantText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  empty: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyTitle: { color: colors.foreground, fontSize: fontSize.lg, fontWeight: "600" },
  postBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 8,
  },
  postBtnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
});
