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
import type { Application } from "@/lib/types";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: keyof typeof Feather.glyphMap }> = {
  submitted: { label: "Submitted", color: colors.mutedForeground, icon: "clock" },
  viewed: { label: "Viewed", color: "#60a5fa", icon: "eye" },
  shortlisted: { label: "Shortlisted", color: colors.success, icon: "star" },
  rejected: { label: "Not Selected", color: "#ef4444", icon: "x-circle" },
  withdrawn: { label: "Withdrawn", color: colors.mutedForeground, icon: "minus-circle" },
};

export default function ApplicationsScreen() {
  useRequireAuth();
  const { user } = useAuth();
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApps = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("applications")
      .select("*, job:jobs(*, company:companies(*), category:categories(*))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) setApps(data as Application[]);
  }, [user]);

  useEffect(() => { fetchApps().finally(() => setLoading(false)); }, [fetchApps]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchApps();
    setRefreshing(false);
  }, [fetchApps]);

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
        <Text style={s.headerTitle}>My Applications</Text>
        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={apps}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        renderItem={({ item }) => {
          const job = item.job;
          const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.submitted;
          const daysAgo = Math.floor((Date.now() - new Date(item.created_at).getTime()) / 86400000);

          return (
            <Pressable
              style={({ pressed }) => [s.card, pressed && { opacity: 0.7 }]}
              onPress={() => job && router.push(`/job/${job.slug}`)}
            >
              <View style={s.cardTop}>
                <CompanyAvatar
                  logoUrl={job?.company?.logo_url}
                  companyName={job?.company?.name || ""}
                  jobTitle={job?.title || ""}
                  categorySlug={job?.category?.slug}
                  size={42}
                />
                <View style={{ flex: 1 }}>
                  <Text style={s.cardTitle} numberOfLines={2}>{job?.title || "Job"}</Text>
                  <Text style={s.cardCompany}>{job?.company?.name}</Text>
                </View>
              </View>

              <View style={s.cardBottom}>
                <View style={[s.statusBadge, { backgroundColor: `${status.color}15` }]}>
                  <Feather name={status.icon} size={12} color={status.color} />
                  <Text style={[s.statusText, { color: status.color }]}>{status.label}</Text>
                </View>
                <Text style={s.dateText}>
                  {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo}d ago`}
                </Text>
              </View>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Feather name="send" size={28} color={colors.accent} />
            </View>
            <Text style={s.emptyTitle}>No applications yet</Text>
            <Text style={s.emptyText}>
              When you apply to jobs, they'll appear here so you can track your progress.
            </Text>
            <Pressable style={s.browseBtn} onPress={() => router.push("/(tabs)/search")}>
              <Text style={s.browseBtnText}>Browse Jobs</Text>
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
  cardTop: { flexDirection: "row", gap: 12 },
  cardTitle: { color: colors.foreground, fontSize: 15, fontWeight: "600", lineHeight: 20 },
  cardCompany: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 2 },
  cardBottom: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border,
  },
  statusBadge: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  dateText: { color: colors.mutedForeground, fontSize: 12 },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: spacing.xl, gap: 8 },
  emptyIcon: {
    width: 60, height: 60, borderRadius: 18,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center",
    marginBottom: 8,
  },
  emptyTitle: { color: colors.foreground, fontSize: fontSize.xl, fontWeight: "700" },
  emptyText: { color: colors.mutedForeground, fontSize: fontSize.base, textAlign: "center", lineHeight: 22 },
  browseBtn: {
    backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 16,
  },
  browseBtnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
});
