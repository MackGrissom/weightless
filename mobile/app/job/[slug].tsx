import { useState, useEffect } from "react";
import {
  View, Text, ScrollView, Pressable, StyleSheet,
  Linking, ActivityIndicator, Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";
import { JobCard } from "@/components/JobCard";
import { CompanyAvatar } from "@/components/CompanyAvatar";
import { JOB_TYPE_LABELS, EXP_LABELS, SITE_URL, isValidUrl } from "@/lib/constants";
import type { Job } from "@/lib/types";

function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  const fmt = (v: number) => `$${Math.round(v / 1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}/yr`;
  if (min) return `From ${fmt(min)}/yr`;
  return `Up to ${fmt(max!)}/yr`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<li[^>]*>/gi, "  • ")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  return `Posted ${Math.floor(days / 7)} weeks ago`;
}


export default function JobDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("jobs")
        .select("*, company:companies(*), category:categories(*)")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      const j = data as Job | null;
      setJob(j);
      setLoading(false);

      // Fetch similar jobs
      if (j?.category_id) {
        const { data: similar } = await supabase
          .from("jobs")
          .select("*, company:companies(*), category:categories(*)")
          .eq("is_active", true)
          .eq("category_id", j.category_id)
          .neq("id", j.id)
          .order("date_posted", { ascending: false })
          .limit(4);
        if (similar) setSimilarJobs(similar as Job[]);
      }
    })();
  }, [slug]);

  const handleShare = async () => {
    if (!job) return;
    try {
      await Share.share({
        message: `Check out this remote job: ${job.title} at ${job.company?.name} — ${SITE_URL}/jobs/${job.slug}`,
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={colors.accent} />
      </SafeAreaView>
    );
  }

  if (!job) {
    return (
      <SafeAreaView style={styles.center}>
        <Feather name="alert-circle" size={40} color={colors.mutedForeground} />
        <Text style={styles.errorTitle}>Job not found</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.errorLink}>Go back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const salary = formatSalary(job.salary_min, job.salary_max);
  const companyName = job.company?.name || "Company";
  const plainDesc = job.description ? stripHtml(job.description) : "";
  const hasDescription = plainDesc.length > 30 && plainDesc !== job.title;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Top nav */}
      <View style={styles.topNav}>
        <Pressable onPress={() => router.back()} style={styles.navBtn} hitSlop={10} accessibilityLabel="Go back" accessibilityRole="button">
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </Pressable>
        <View style={styles.navActions}>
          <Pressable onPress={handleShare} style={styles.navBtn} hitSlop={10} accessibilityLabel="Share this job" accessibilityRole="button">
            <Feather name="share" size={20} color={colors.foreground} />
          </Pressable>
          <Pressable style={styles.navBtn} hitSlop={10} accessibilityLabel="Save this job" accessibilityRole="button">
            <Feather name="bookmark" size={20} color={colors.foreground} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Company header */}
        <View style={styles.companyHeader}>
          <CompanyAvatar
            logoUrl={job.company?.logo_url}
            companyName={companyName}
            jobTitle={job.title}
            categorySlug={job.category?.slug}
            size={52}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.companyNameText}>{companyName}</Text>
            <View style={styles.companyMeta}>
              {job.company?.remote_policy && (
                <Text style={styles.companyMetaText}>{job.company.remote_policy}</Text>
              )}
              {job.company?.glassdoor_rating && (
                <View style={styles.ratingRow}>
                  <Feather name="star" size={11} color={colors.accent} />
                  <Text style={styles.ratingNum}>{job.company.glassdoor_rating}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Job title & posted */}
        <Text style={styles.jobTitle}>{job.title}</Text>
        <Text style={styles.postedDate}>{timeAgo(job.date_posted)}</Text>

        {/* Salary highlight */}
        {salary && (
          <View style={styles.salaryCard}>
            <View style={styles.salaryIcon}>
              <Feather name="dollar-sign" size={18} color={colors.accent} />
            </View>
            <View>
              <Text style={styles.salaryAmount}>{salary}</Text>
              <Text style={styles.salaryLabel}>Estimated compensation</Text>
            </View>
          </View>
        )}

        {/* Details grid */}
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Feather name="clock" size={15} color={colors.accent} />
            <Text style={styles.gridLabel}>Type</Text>
            <Text style={styles.gridValue}>{JOB_TYPE_LABELS[job.job_type] || job.job_type}</Text>
          </View>
          {job.experience_level && (
            <View style={styles.gridItem}>
              <Feather name="bar-chart-2" size={15} color={colors.accent} />
              <Text style={styles.gridLabel}>Level</Text>
              <Text style={styles.gridValue}>{EXP_LABELS[job.experience_level] || job.experience_level}</Text>
            </View>
          )}
          <View style={styles.gridItem}>
            <Feather name="map-pin" size={15} color={colors.accent} />
            <Text style={styles.gridLabel}>Location</Text>
            <Text style={styles.gridValue}>{job.location_requirements || "Remote"}</Text>
          </View>
          {job.category && (
            <View style={styles.gridItem}>
              <Feather name="folder" size={15} color={colors.accent} />
              <Text style={styles.gridLabel}>Category</Text>
              <Text style={styles.gridValue}>{job.category.name}</Text>
            </View>
          )}
        </View>

        {/* Flags */}
        {(job.visa_sponsorship || job.is_async_friendly) && (
          <View style={styles.flagRow}>
            {job.visa_sponsorship && (
              <View style={styles.flagGreen}>
                <Feather name="globe" size={14} color={colors.success} />
                <Text style={styles.flagGreenText}>Visa Sponsorship</Text>
              </View>
            )}
            {job.is_async_friendly && (
              <View style={styles.flagAccent}>
                <Feather name="zap" size={14} color={colors.accent} />
                <Text style={styles.flagAccentText}>Async-Friendly</Text>
              </View>
            )}
          </View>
        )}

        {/* Tech stack */}
        {job.tech_stack && job.tech_stack.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TECH STACK</Text>
            <View style={styles.techGrid}>
              {job.tech_stack.map((t) => (
                <View key={t} style={styles.techBadge}>
                  <Text style={styles.techText}>{t}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Description */}
        {hasDescription && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT THIS ROLE</Text>
            <Text style={styles.descText}>{plainDesc}</Text>
          </View>
        )}

        {/* Company info */}
        {job.company?.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ABOUT {companyName.toUpperCase()}</Text>
            <Text style={styles.descText}>{job.company.description}</Text>
            {job.company.website && (
              <Pressable
                onPress={() => { if (job.company?.website && isValidUrl(job.company.website)) Linking.openURL(job.company.website); }}
                style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.7 }]}
              >
                <Feather name="external-link" size={14} color={colors.accent} />
                <Text style={styles.linkText}>Visit website</Text>
              </Pressable>
            )}
            {job.company.tech_stack && job.company.tech_stack.length > 0 && (
              <View style={styles.companyTechRow}>
                {job.company.tech_stack.slice(0, 6).map((t) => (
                  <View key={t} style={styles.companyTechChip}>
                    <Text style={styles.companyTechText}>{t}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Similar jobs */}
        {similarJobs.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SIMILAR JOBS</Text>
            {similarJobs.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
          </View>
        )}

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Sticky apply */}
      <View style={styles.applyBar}>
        {job.posted_by ? (
          /* In-app job — apply with profile */
          <Pressable
            style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
            onPress={() => router.push(`/job/apply/${job.slug}`)}
            accessibilityLabel="Apply with your Weightless profile"
          >
            <Feather name="send" size={18} color={colors.accentForeground} />
            <Text style={styles.applyBtnText}>Apply with Profile</Text>
          </Pressable>
        ) : (
          /* External job — open apply URL */
          <Pressable
            style={({ pressed }) => [styles.applyBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
            onPress={() => { if (job.apply_url && isValidUrl(job.apply_url)) Linking.openURL(job.apply_url); }}
            accessibilityLabel="Apply on external website"
          >
            <Feather name="external-link" size={18} color={colors.accentForeground} />
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </Pressable>
        )}
        <Text style={styles.applyNote}>
          {job.posted_by ? "Apply using your Weightless profile" : "Opens external application page"}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, backgroundColor: colors.background, justifyContent: "center", alignItems: "center", gap: 12 },
  errorTitle: { color: colors.foreground, fontSize: fontSize.lg, fontWeight: "600" },
  errorLink: { color: colors.accent, fontSize: fontSize.base, marginTop: 4 },

  topNav: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 8, paddingVertical: 6,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  navBtn: { padding: 8, borderRadius: 10 },
  navActions: { flexDirection: "row", gap: 4 },

  scroll: { padding: spacing.md },

  companyHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  companyNameText: { color: colors.foreground, fontWeight: "600", fontSize: fontSize.lg },
  companyMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 2 },
  companyMetaText: { color: colors.mutedForeground, fontSize: fontSize.sm },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingNum: { color: colors.mutedForeground, fontSize: fontSize.sm, fontWeight: "600" },

  jobTitle: { fontSize: 26, fontWeight: "800", color: colors.foreground, lineHeight: 32 },
  postedDate: { color: colors.mutedForeground, fontSize: fontSize.sm, marginTop: 6 },

  salaryCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: `${colors.accent}08`, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: `${colors.accent}20`,
    padding: 16, marginTop: 20,
  },
  salaryIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: `${colors.accent}15`, justifyContent: "center", alignItems: "center",
  },
  salaryAmount: { color: colors.accent, fontSize: fontSize.xl, fontWeight: "800" },
  salaryLabel: { color: colors.mutedForeground, fontSize: fontSize.xs, marginTop: 1 },

  grid: {
    flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 20,
  },
  gridItem: {
    backgroundColor: colors.card, borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, minWidth: "47%", flex: 1, gap: 4,
  },
  gridLabel: { color: colors.mutedForeground, fontSize: 11 },
  gridValue: { color: colors.foreground, fontSize: fontSize.sm, fontWeight: "600" },

  flagRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  flagGreen: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: `${colors.success}12`, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  flagGreenText: { color: colors.success, fontSize: fontSize.sm, fontWeight: "500" },
  flagAccent: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: `${colors.accent}12`, borderRadius: 100,
    paddingHorizontal: 12, paddingVertical: 8,
  },
  flagAccentText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "500" },

  section: { marginTop: 28 },
  sectionTitle: {
    color: colors.mutedForeground, fontSize: 11, fontWeight: "800",
    letterSpacing: 1.5, marginBottom: 12,
  },
  techGrid: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  techBadge: {
    backgroundColor: `${colors.accent}12`,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  techText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "500" },
  descText: { color: colors.foreground, fontSize: 15, lineHeight: 24 },
  linkRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14 },
  linkText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "600" },
  companyTechRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 12 },
  companyTechChip: { backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  companyTechText: { color: colors.mutedForeground, fontSize: 11 },

  applyBar: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: `${colors.background}F8`, borderTopWidth: 0.5, borderTopColor: colors.border,
    paddingHorizontal: spacing.md, paddingTop: 12, paddingBottom: 40,
    alignItems: "center",
  },
  applyBtn: {
    backgroundColor: colors.accent, borderRadius: 14, width: "100%",
    paddingVertical: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
  },
  applyBtnText: { color: colors.accentForeground, fontSize: 17, fontWeight: "800" },
  applyNote: { color: colors.mutedForeground, fontSize: 11, marginTop: 6 },
});
