import { useState, useEffect, useCallback } from "react";
import {
  View, Text, FlatList, RefreshControl, Pressable,
  StyleSheet, ActivityIndicator, Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";
import { JobCard } from "@/components/JobCard";
import { CompanyAvatar } from "@/components/CompanyAvatar";
import { CATEGORIES } from "@/lib/constants";
import type { Job } from "@/lib/types";

const { width: SCREEN_W } = Dimensions.get("window");

export default function JobsTab() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ jobs: 0, companies: 0 });

  const fetchData = useCallback(async () => {
    // Fetch jobs with salary first, then backfill with recent
    const [withSalary, recent, jobCount, companyCount] = await Promise.all([
      supabase
        .from("jobs")
        .select("*, company:companies(*), category:categories(*)")
        .eq("is_active", true)
        .not("salary_min", "is", null)
        .order("date_posted", { ascending: false })
        .limit(10),
      supabase
        .from("jobs")
        .select("*, company:companies(*), category:categories(*)")
        .eq("is_active", true)
        .order("is_featured", { ascending: false })
        .order("date_posted", { ascending: false })
        .limit(40),
      supabase.from("jobs").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("companies").select("id", { count: "exact", head: true }),
    ]);

    // Merge: salary jobs first, then recent (deduped)
    const salaryJobs = (withSalary.data || []) as Job[];
    const recentJobs = (recent.data || []) as Job[];
    const seenIds = new Set(salaryJobs.map((j) => j.id));
    const merged = [...salaryJobs, ...recentJobs.filter((j) => !seenIds.has(j.id))];
    setJobs(merged);
    setStats({ jobs: jobCount.count || 0, companies: companyCount.count || 0 });
  }, []);

  useEffect(() => { fetchData().finally(() => setLoading(false)); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  if (loading) {
    return (
      <SafeAreaView style={s.center}>
        <Feather name="feather" size={32} color={colors.accent} />
        <ActivityIndicator size="small" color={colors.accent} style={{ marginTop: 12 }} />
      </SafeAreaView>
    );
  }

  const topPicks = jobs.filter((j) => j.salary_min && j.salary_max).slice(0, 6);

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <JobCard job={item} />}
        contentContainerStyle={s.list}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        windowSize={7}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accent} />}
        ListHeaderComponent={
          <View>
            {/* Hero */}
            <View style={s.hero}>
              <View style={s.heroRow}>
                <View style={s.heroLeft}>
                  <View style={s.brand}>
                    <Feather name="feather" size={20} color={colors.accent} />
                    <Text style={s.brandName}>Weightless</Text>
                  </View>
                  <Text style={s.heroTitle}>Remote jobs{"\n"}for nomads</Text>
                </View>
                <View style={s.heroRight}>
                  <View style={s.heroPill}>
                    <Text style={s.heroPillNum}>{stats.jobs.toLocaleString()}</Text>
                    <Text style={s.heroPillLabel}>open roles</Text>
                  </View>
                  <View style={s.heroPill}>
                    <Text style={s.heroPillNum}>{stats.companies.toLocaleString()}</Text>
                    <Text style={s.heroPillLabel}>companies</Text>
                  </View>
                </View>
              </View>

              {/* Search bar */}
              <Pressable
                onPress={() => router.push("/(tabs)/search")}
                style={({ pressed }) => [s.searchBar, pressed && { opacity: 0.8 }]}
              >
                <Feather name="search" size={18} color={colors.mutedForeground} />
                <Text style={s.searchPlaceholder}>Search jobs, companies, skills...</Text>
              </Pressable>
            </View>

            {/* Categories */}
            <FlatList
              data={CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.catList}
              keyExtractor={(c) => c.slug}
              renderItem={({ item }) => (
                <Pressable
                  style={({ pressed }) => [s.catItem, pressed && { transform: [{ scale: 0.93 }] }]}
                  onPress={() => router.push({ pathname: "/(tabs)/search", params: { category: item.slug } })}
                >
                  <View style={s.catIcon}>
                    <Feather name={item.icon} size={18} color={colors.accent} />
                  </View>
                  <Text style={s.catName}>{item.label}</Text>
                </Pressable>
              )}
            />

            {/* Top Picks (salary jobs) */}
            {topPicks.length > 0 && (
              <>
                <View style={s.secRow}>
                  <Text style={s.secTitle}>Top Picks</Text>
                  <Text style={s.secBadge}>With salary</Text>
                </View>
                <FlatList
                  data={topPicks}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={s.pickList}
                  keyExtractor={(j) => `pick-${j.id}`}
                  renderItem={({ item }) => {
                    const pay = `$${Math.round((item.salary_min || 0) / 1000)}k – $${Math.round((item.salary_max || 0) / 1000)}k`;
                    return (
                      <Pressable
                        style={({ pressed }) => [s.pickCard, pressed && { opacity: 0.8 }]}
                        onPress={() => router.push(`/job/${item.slug}`)}
                      >
                        <View style={s.pickTop}>
                          <CompanyAvatar
                            logoUrl={item.company?.logo_url}
                            companyName={item.company?.name || ""}
                            jobTitle={item.title}
                            categorySlug={item.category?.slug}
                            size={30}
                          />
                          <Text style={s.pickCompany} numberOfLines={1}>{item.company?.name}</Text>
                        </View>
                        <Text style={s.pickTitle} numberOfLines={2}>{item.title}</Text>
                        <View style={s.pickPayRow}>
                          <Text style={s.pickPay}>{pay}</Text>
                        </View>
                        {item.tech_stack?.length > 0 && (
                          <Text style={s.pickTech} numberOfLines={1}>
                            {item.tech_stack.slice(0, 3).join(" · ")}
                          </Text>
                        )}
                      </Pressable>
                    );
                  }}
                />
              </>
            )}

            {/* Latest Jobs header */}
            <View style={s.secRow}>
              <Text style={s.secTitle}>Latest Jobs</Text>
              <Text style={s.secCount}>{jobs.length} listings</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.empty}>
            <Feather name="inbox" size={36} color={colors.mutedForeground} />
            <Text style={s.emptyTitle}>No jobs yet</Text>
            <Text style={s.emptyText}>Pull down to refresh</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center" },
  list: { paddingBottom: 24 },

  hero: { padding: 20, paddingBottom: 16, backgroundColor: colors.card, borderBottomWidth: 1, borderBottomColor: colors.border },
  heroRow: { flexDirection: "row", justifyContent: "space-between" },
  heroLeft: { flex: 1 },
  brand: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  brandName: { fontSize: 15, fontWeight: "700", color: colors.foreground },
  heroTitle: { fontSize: 30, fontWeight: "900", color: colors.foreground, lineHeight: 36 },
  heroRight: { gap: 6, alignItems: "flex-end" },
  heroPill: {
    backgroundColor: colors.background, borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", minWidth: 90,
  },
  heroPillNum: { color: colors.accent, fontSize: 18, fontWeight: "800" },
  heroPillLabel: { color: colors.mutedForeground, fontSize: 10, marginTop: 1 },
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: colors.background, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, height: 50, marginTop: 16,
  },
  searchPlaceholder: { color: colors.mutedForeground, fontSize: 15 },

  catList: { paddingHorizontal: 16, paddingVertical: 16, gap: 8 },
  catItem: {
    alignItems: "center", gap: 4, backgroundColor: colors.card,
    borderRadius: 14, borderWidth: 1, borderColor: colors.border,
    paddingVertical: 12, paddingHorizontal: 16, minWidth: 80,
  },
  catIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center",
  },
  catName: { fontSize: 11, fontWeight: "600", color: colors.foreground },

  secRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 10,
  },
  secTitle: { fontSize: 19, fontWeight: "800", color: colors.foreground },
  secBadge: {
    color: colors.accent, fontSize: 11, fontWeight: "700",
    backgroundColor: `${colors.accent}12`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, overflow: "hidden",
  },
  secCount: { color: colors.mutedForeground, fontSize: 13 },

  pickList: { paddingHorizontal: 16, gap: 10, paddingBottom: 8 },
  pickCard: {
    width: SCREEN_W * 0.65, backgroundColor: colors.card,
    borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  pickTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  pickCompany: { color: colors.mutedForeground, fontSize: 12, flex: 1 },
  pickTitle: { color: colors.foreground, fontSize: 15, fontWeight: "700", lineHeight: 20 },
  pickPayRow: { marginTop: 8 },
  pickPay: { color: colors.accent, fontSize: 14, fontWeight: "800" },
  pickTech: { color: colors.mutedForeground, fontSize: 11, marginTop: 6 },

  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { color: colors.foreground, fontSize: 17, fontWeight: "600" },
  emptyText: { color: colors.mutedForeground, fontSize: 14 },
});
