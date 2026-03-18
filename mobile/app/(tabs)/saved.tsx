import { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, Pressable, RefreshControl,
  StyleSheet, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { JobCard } from "@/components/JobCard";
import { colors, spacing, fontSize } from "@/lib/theme";
import type { Job, SavedJob } from "@/lib/types";

export default function SavedTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("saved_jobs")
      .select("*, job:jobs(*, company:companies(*), category:categories(*))")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (data) {
      setSavedJobs(data.map((s: SavedJob) => s.job).filter(Boolean) as Job[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchSaved();
    setRefreshing(false);
  }, [fetchSaved]);

  if (!user) {
    return (
      <SafeAreaView style={s.container} edges={["top"]}>
        <View style={s.authPrompt}>
          <View style={s.iconCircle}>
            <Feather name="bookmark" size={28} color={colors.accent} />
          </View>
          <Text style={s.authTitle}>Save Jobs</Text>
          <Text style={s.authText}>Sign in to bookmark jobs and view them later.</Text>
          <Pressable style={s.authBtn} onPress={() => router.push("/auth/sign-in")}>
            <Text style={s.authBtnText}>Sign In</Text>
          </Pressable>
        </View>
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

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <FlatList
        data={savedJobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListHeaderComponent={
          <View style={s.header}>
            <Text style={s.title}>Saved Jobs</Text>
            {savedJobs.length > 0 && (
              <Text style={s.count}>{savedJobs.length} saved</Text>
            )}
          </View>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <View style={s.emptyIconOuter}>
              <View style={s.emptyIconInner}>
                <Feather name="bookmark" size={28} color={colors.accent} />
              </View>
            </View>
            <Text style={s.emptyTitle}>No saved jobs yet</Text>
            <Text style={s.emptyText}>
              Tap the bookmark icon on any job to save it for later.
            </Text>
            <Pressable
              style={({ pressed }) => [s.browseBtn, pressed && { opacity: 0.85 }]}
              onPress={() => router.push("/(tabs)/search")}
            >
              <Feather name="search" size={16} color={colors.accentForeground} />
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
  list: { paddingBottom: 20 },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: spacing.md, paddingTop: spacing.md, paddingBottom: 8,
  },
  title: { fontSize: 26, fontWeight: "900", color: colors.foreground },
  count: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  empty: { alignItems: "center", paddingTop: 80, paddingHorizontal: spacing.xl, gap: 8 },
  emptyIconOuter: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: `${colors.accent}08`, justifyContent: "center", alignItems: "center",
  },
  emptyIconInner: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: `${colors.accent}15`, justifyContent: "center", alignItems: "center",
  },
  emptyTitle: { color: colors.foreground, fontSize: fontSize.xl, fontWeight: "700" },
  emptyText: { color: colors.mutedForeground, fontSize: fontSize.base, textAlign: "center", lineHeight: 22, maxWidth: 280 },
  browseBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 14, marginTop: 16,
  },
  browseBtnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
  authPrompt: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  iconCircle: {
    width: 64, height: 64, borderRadius: 20,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center", marginBottom: 16,
  },
  authTitle: { fontSize: fontSize.xl, fontWeight: "800", color: colors.foreground },
  authText: { color: colors.mutedForeground, fontSize: fontSize.base, textAlign: "center", marginTop: 4 },
  authBtn: {
    backgroundColor: colors.accent, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14, marginTop: 20,
  },
  authBtnText: { color: colors.accentForeground, fontSize: fontSize.base, fontWeight: "700" },
});
