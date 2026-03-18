import { View, Text, StyleSheet, Image as RNImage } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, borderRadius } from "@/lib/theme";

// Category-to-icon mapping for beautiful fallbacks
const CATEGORY_ICONS: Record<string, { icon: keyof typeof Feather.glyphMap; bg: string; fg: string }> = {
  engineering: { icon: "terminal", bg: "#3b82f620", fg: "#60a5fa" },
  design: { icon: "figma", bg: "#a855f720", fg: "#c084fc" },
  marketing: { icon: "bar-chart", bg: "#f9731620", fg: "#fb923c" },
  product: { icon: "layers", bg: "#06b6d420", fg: "#22d3ee" },
  data: { icon: "database", bg: "#10b98120", fg: "#34d399" },
  support: { icon: "message-circle", bg: "#eab30820", fg: "#fbbf24" },
  writing: { icon: "file-text", bg: "#ec489920", fg: "#f472b6" },
  education: { icon: "book", bg: "#8b5cf620", fg: "#a78bfa" },
};

// Title keyword matching for smarter icon selection
const TITLE_KEYWORDS: { keywords: string[]; icon: keyof typeof Feather.glyphMap; bg: string; fg: string }[] = [
  { keywords: ["engineer", "developer", "devops", "sre", "backend", "frontend", "fullstack", "software"], icon: "terminal", bg: "#3b82f620", fg: "#60a5fa" },
  { keywords: ["designer", "ux", "ui", "creative", "graphic", "visual"], icon: "figma", bg: "#a855f720", fg: "#c084fc" },
  { keywords: ["marketing", "seo", "growth", "social media", "brand", "content market"], icon: "bar-chart", bg: "#f9731620", fg: "#fb923c" },
  { keywords: ["product manager", "product owner", "program manager", "scrum"], icon: "layers", bg: "#06b6d420", fg: "#22d3ee" },
  { keywords: ["data", "analyst", "machine learning", "ml", "ai ", "analytics", "scientist"], icon: "database", bg: "#10b98120", fg: "#34d399" },
  { keywords: ["customer", "support", "success", "account"], icon: "message-circle", bg: "#eab30820", fg: "#fbbf24" },
  { keywords: ["writer", "editor", "content", "copywriter", "technical writer"], icon: "file-text", bg: "#ec489920", fg: "#f472b6" },
  { keywords: ["teacher", "instructor", "education", "tutor", "professor"], icon: "book", bg: "#8b5cf620", fg: "#a78bfa" },
  { keywords: ["recruiter", "hr", "people", "talent"], icon: "users", bg: "#14b8a620", fg: "#2dd4bf" },
  { keywords: ["sales", "business development", "account exec"], icon: "trending-up", bg: "#ef444420", fg: "#f87171" },
  { keywords: ["finance", "accounting", "bookkeeper", "cfo"], icon: "credit-card", bg: "#84cc1620", fg: "#a3e635" },
  { keywords: ["legal", "compliance", "counsel"], icon: "shield", bg: "#6366f120", fg: "#818cf8" },
  { keywords: ["operations", "ops", "logistics"], icon: "settings", bg: "#78716c20", fg: "#a8a29e" },
  { keywords: ["devops", "cloud", "infrastructure", "platform", "sre"], icon: "cloud", bg: "#0ea5e920", fg: "#38bdf8" },
  { keywords: ["mobile", "ios", "android", "react native", "flutter"], icon: "smartphone", bg: "#8b5cf620", fg: "#a78bfa" },
  { keywords: ["security", "cyber", "infosec"], icon: "lock", bg: "#ef444420", fg: "#f87171" },
  { keywords: ["video", "editor", "motion", "animation"], icon: "film", bg: "#ec489920", fg: "#f472b6" },
  { keywords: ["manager", "director", "head of", "vp", "chief", "lead"], icon: "briefcase", bg: "#f59e0b20", fg: "#fbbf24" },
];

function getIconForJob(
  title: string,
  categorySlug?: string | null
): { icon: keyof typeof Feather.glyphMap; bg: string; fg: string } {
  // 1. Try matching title keywords (most specific)
  const titleLower = title.toLowerCase();
  for (const entry of TITLE_KEYWORDS) {
    if (entry.keywords.some((kw) => titleLower.includes(kw))) {
      return entry;
    }
  }

  // 2. Fall back to category
  if (categorySlug && CATEGORY_ICONS[categorySlug]) {
    return CATEGORY_ICONS[categorySlug];
  }

  // 3. Default
  return { icon: "briefcase", bg: `${colors.accent}15`, fg: colors.accent };
}

// Deterministic color from company name for initial fallback
function getCompanyColor(name: string): { bg: string; fg: string } {
  const palette = [
    { bg: "#3b82f618", fg: "#60a5fa" },
    { bg: "#8b5cf618", fg: "#a78bfa" },
    { bg: "#06b6d418", fg: "#22d3ee" },
    { bg: "#10b98118", fg: "#34d399" },
    { bg: "#f9731618", fg: "#fb923c" },
    { bg: "#ec489918", fg: "#f472b6" },
    { bg: "#eab30818", fg: "#fbbf24" },
    { bg: "#ef444418", fg: "#f87171" },
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

interface CompanyAvatarProps {
  logoUrl: string | null | undefined;
  companyName: string;
  jobTitle?: string;
  categorySlug?: string | null;
  size?: number;
  /** "icon" shows category icon, "initial" shows letter */
  fallbackMode?: "icon" | "initial";
}

export function CompanyAvatar({
  logoUrl,
  companyName,
  jobTitle = "",
  categorySlug,
  size = 46,
  fallbackMode = "icon",
}: CompanyAvatarProps) {
  const radius = size > 40 ? 14 : 10;

  if (logoUrl) {
    return (
      <RNImage
        source={{ uri: logoUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: radius }]}
      />
    );
  }

  if (fallbackMode === "icon") {
    const { icon, bg, fg } = getIconForJob(jobTitle, categorySlug);
    return (
      <View style={[styles.fallback, { width: size, height: size, borderRadius: radius, backgroundColor: bg }]}>
        <Feather name={icon} size={size * 0.45} color={fg} />
      </View>
    );
  }

  // Initial mode
  const { bg, fg } = getCompanyColor(companyName);
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: radius, backgroundColor: bg }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4, color: fg }]}>
        {companyName.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { backgroundColor: colors.muted },
  fallback: { justifyContent: "center", alignItems: "center" },
  initial: { fontWeight: "800" },
});
