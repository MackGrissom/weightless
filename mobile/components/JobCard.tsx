import { memo } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { CompanyAvatar } from "@/components/CompanyAvatar";
import { JOB_TYPE_LABELS, EXP_LABELS } from "@/lib/constants";
import { colors, borderRadius, fontSize, spacing } from "@/lib/theme";
import type { Job } from "@/lib/types";

function formatSalary(min: number | null, max: number | null): string | null {
  if (!min && !max) return null;
  const fmt = (v: number) => `$${Math.round(v / 1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hrs = Math.floor(diff / 3600000);
  if (hrs < 1) return "Just now";
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function JobCardInner({ job }: { job: Job }) {
  const router = useRouter();
  const salary = formatSalary(job.salary_min, job.salary_max);
  const company = job.company?.name || "Company";

  return (
    <Pressable
      onPress={() => router.push(`/job/${job.slug}`)}
      style={({ pressed }) => [s.card, pressed && s.pressed]}
    >
      {/* Header: logo, title, company, time */}
      <View style={s.row1}>
        <CompanyAvatar
          logoUrl={job.company?.logo_url}
          companyName={company}
          jobTitle={job.title}
          categorySlug={job.category?.slug}
          size={46}
        />
        <View style={s.titleCol}>
          <Text style={s.title} numberOfLines={2}>{job.title}</Text>
          <Text style={s.company} numberOfLines={1}>{company}</Text>
        </View>
        <View style={s.rightCol}>
          <Text style={s.time}>{timeAgo(job.date_posted)}</Text>
          {job.is_featured && <Feather name="zap" size={12} color={colors.accent} />}
        </View>
      </View>

      {/* Row 2: info chips — only show what exists */}
      <View style={s.chipRow}>
        {salary && (
          <View style={s.salaryChip}>
            <Feather name="dollar-sign" size={11} color={colors.accent} />
            <Text style={s.salaryText}>{salary}</Text>
          </View>
        )}
        <View style={s.chip}>
          <Text style={s.chipText}>{JOB_TYPE_LABELS[job.job_type] || job.job_type}</Text>
        </View>
        {job.experience_level && (
          <View style={s.chip}>
            <Text style={s.chipText}>{EXP_LABELS[job.experience_level] || job.experience_level}</Text>
          </View>
        )}
        {job.visa_sponsorship && (
          <View style={s.visaChip}>
            <Feather name="globe" size={10} color={colors.success} />
            <Text style={s.visaText}>Visa</Text>
          </View>
        )}
        {job.category && (
          <View style={s.chip}>
            <Text style={s.chipText}>{job.category.name}</Text>
          </View>
        )}
      </View>

      {/* Row 3: tech stack (if exists) */}
      {job.tech_stack && job.tech_stack.length > 0 && (
        <View style={s.techRow}>
          {job.tech_stack.slice(0, 4).map((t) => (
            <View key={t} style={s.techChip}>
              <Text style={s.techText}>{t}</Text>
            </View>
          ))}
          {job.tech_stack.length > 4 && (
            <Text style={s.techMore}>+{job.tech_stack.length - 4}</Text>
          )}
        </View>
      )}

      {/* Bottom: arrow indicator */}
      <View style={s.bottomRow}>
        <Text style={s.viewText}>View details</Text>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  pressed: { opacity: 0.7, transform: [{ scale: 0.985 }] },

  row1: { flexDirection: "row", gap: 12 },
  titleCol: { flex: 1, justifyContent: "center" },
  title: { color: colors.foreground, fontWeight: "700", fontSize: 15, lineHeight: 20 },
  company: { color: colors.mutedForeground, fontSize: 13, marginTop: 2 },
  rightCol: { alignItems: "flex-end", gap: 4, paddingTop: 2 },
  time: { color: colors.mutedForeground, fontSize: 11 },

  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 12 },
  salaryChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: `${colors.accent}12`, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8,
  },
  salaryText: { color: colors.accent, fontSize: 12, fontWeight: "700" },
  chip: {
    backgroundColor: colors.muted, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8,
  },
  chipText: { color: colors.mutedForeground, fontSize: 11, fontWeight: "500" },
  visaChip: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: `${colors.success}10`, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8,
  },
  visaText: { color: colors.success, fontSize: 11, fontWeight: "600" },

  techRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 10, alignItems: "center" },
  techChip: {
    backgroundColor: `${colors.accent}08`, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6,
  },
  techText: { color: colors.accent, fontSize: 10, fontWeight: "500" },
  techMore: { color: colors.mutedForeground, fontSize: 10, marginLeft: 2 },

  bottomRow: {
    flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 4,
    marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border,
  },
  viewText: { color: colors.mutedForeground, fontSize: 12 },
});

export const JobCard = memo(JobCardInner);
