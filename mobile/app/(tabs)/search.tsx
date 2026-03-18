import { useState, useEffect, useCallback } from "react";
import {
  View, Text, TextInput, FlatList, Pressable, ScrollView,
  StyleSheet, ActivityIndicator, Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { CATEGORIES, JOB_TYPES, EXP_LEVELS, sanitizeSearchQuery } from "@/lib/constants";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";
import { JobCard } from "@/components/JobCard";
import type { Job } from "@/lib/types";

export default function SearchTab() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(params.category || "");
  const [activeType, setActiveType] = useState("");
  const [activeExp, setActiveExp] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const search = useCallback(async (q: string, category: string, jobType: string, exp: string) => {
    setLoading(true);
    setSearched(true);
    Keyboard.dismiss();

    let request = supabase
      .from("jobs")
      .select("*, company:companies(*), category:categories(*)", { count: "exact" })
      .eq("is_active", true)
      .order("date_posted", { ascending: false })
      .limit(40);

    const safeQ = sanitizeSearchQuery(q);
    if (safeQ) {
      request = request.or(`title.ilike.%${safeQ}%,description.ilike.%${safeQ}%`);
    }

    if (category) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", category).single();
      if (cat) request = request.eq("category_id", cat.id);
    }

    if (jobType) request = request.eq("job_type", jobType);
    if (exp) request = request.eq("experience_level", exp);

    const { data, count } = await request;
    setResults((data as Job[]) || []);
    setTotalCount(count || 0);
    setLoading(false);
  }, []);

  // Auto-search when category param changes
  useEffect(() => {
    if (params.category) {
      setActiveCategory(params.category);
      search("", params.category, "", "");
    }
  }, [params.category, search]);

  const handleCategoryPress = (slug: string) => {
    const newCat = activeCategory === slug ? "" : slug;
    setActiveCategory(newCat);
    search(query, newCat, activeType, activeExp);
  };

  const handleFilterChange = (type: string, exp: string) => {
    setActiveType(type);
    setActiveExp(exp);
    search(query, activeCategory, type, exp);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Search header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color={colors.mutedForeground} />
          <TextInput
            style={styles.input}
            placeholder="Job title, skill, or company..."
            placeholderTextColor={colors.mutedForeground}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => search(query, activeCategory, activeType, activeExp)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(""); }} hitSlop={8}>
              <Feather name="x-circle" size={18} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        {/* Category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat.slug}
              style={[styles.catPill, activeCategory === cat.slug && styles.catPillActive]}
              onPress={() => handleCategoryPress(cat.slug)}
            >
              <Feather name={cat.icon} size={14} color={activeCategory === cat.slug ? colors.accent : colors.mutedForeground} />
              <Text style={[styles.catPillText, activeCategory === cat.slug && styles.catPillTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Filter pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {JOB_TYPES.map((t) => (
            <Pressable
              key={t.value}
              style={[styles.filterPill, activeType === t.value && styles.filterPillActive]}
              onPress={() => handleFilterChange(t.value, activeExp)}
            >
              <Text style={[styles.filterText, activeType === t.value && styles.filterTextActive]}>{t.label}</Text>
            </Pressable>
          ))}
          <View style={styles.filterDivider} />
          {EXP_LEVELS.map((e) => (
            <Pressable
              key={e.value}
              style={[styles.filterPill, activeExp === e.value && styles.filterPillActive]}
              onPress={() => handleFilterChange(activeType, e.value)}
            >
              <Text style={[styles.filterText, activeExp === e.value && styles.filterTextActive]}>{e.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : searched ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <JobCard job={item} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          maxToRenderPerBatch={10}
          windowSize={7}
          ListHeaderComponent={
            totalCount > 0 ? (
              <Text style={styles.resultCount}>
                {totalCount.toLocaleString()} {totalCount === 1 ? "result" : "results"}
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="search" size={40} color={colors.mutedForeground} />
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>Try different keywords or remove filters</Text>
            </View>
          }
        />
      ) : (
        <View style={styles.promptView}>
          <Feather name="search" size={48} color={colors.border} />
          <Text style={styles.promptTitle}>Find your dream job</Text>
          <Text style={styles.promptText}>Search by title, skill, or company — or tap a category above</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 10 },
  title: { fontSize: fontSize["2xl"], fontWeight: "800", color: colors.foreground, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  searchBar: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.muted, borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md, paddingHorizontal: 14, height: 46,
  },
  input: { flex: 1, color: colors.foreground, fontSize: fontSize.base },
  catScroll: { paddingHorizontal: spacing.md, gap: 6, paddingTop: 10 },
  catPill: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: colors.card, borderRadius: 100,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, paddingVertical: 7,
  },
  catPillActive: { backgroundColor: `${colors.accent}15`, borderColor: `${colors.accent}40` },
  catPillText: { color: colors.mutedForeground, fontSize: 12, fontWeight: "500" },
  catPillTextActive: { color: colors.accent },
  filterScroll: { paddingHorizontal: spacing.md, gap: 5, paddingTop: 8 },
  filterPill: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6,
    backgroundColor: colors.muted,
  },
  filterPillActive: { backgroundColor: `${colors.accent}20` },
  filterText: { color: colors.mutedForeground, fontSize: 11, fontWeight: "500" },
  filterTextActive: { color: colors.accent, fontWeight: "600" },
  filterDivider: { width: 1, height: 18, backgroundColor: colors.border, alignSelf: "center" },
  resultCount: {
    color: colors.mutedForeground, fontSize: fontSize.sm,
    paddingHorizontal: spacing.md, paddingBottom: 6,
  },
  loadingView: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyTitle: { color: colors.foreground, fontSize: fontSize.lg, fontWeight: "600" },
  emptyText: { color: colors.mutedForeground, fontSize: fontSize.sm },
  promptView: { flex: 1, justifyContent: "center", alignItems: "center", paddingBottom: 100, gap: 10 },
  promptTitle: { color: colors.foreground, fontSize: fontSize.xl, fontWeight: "700" },
  promptText: { color: colors.mutedForeground, fontSize: fontSize.sm, textAlign: "center", maxWidth: 260 },
});
