import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Feather } from "@expo/vector-icons";
import { useRequireAuth } from "@/lib/auth";
import { SITE_URL } from "@/lib/constants";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";

export default function PostJobScreen() {
  useRequireAuth();
  const router = useRouter();

  const openPostJob = async () => {
    await WebBrowser.openBrowserAsync(`${SITE_URL}/post-job`, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.FORM_SHEET,
      toolbarColor: colors.background,
      controlsColor: colors.accent,
    });
  };

  return (
    <SafeAreaView style={s.container} edges={["top"]}>
      <View style={s.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </Pressable>
        <Text style={s.headerTitle}>Post a Job</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={s.content}>
        <View style={s.iconCircle}>
          <Feather name="plus-circle" size={36} color={colors.accent} />
        </View>

        <Text style={s.title}>Reach Remote Talent</Text>
        <Text style={s.description}>
          Post your job on Weightless and reach thousands of digital nomads and remote workers worldwide. Listings include company profile, salary display, and category placement.
        </Text>

        <View style={s.pricingRow}>
          <View style={s.priceCard}>
            <Text style={s.priceLabel}>Standard</Text>
            <Text style={s.priceAmount}>$99</Text>
            <Text style={s.pricePer}>30 days</Text>
          </View>
          <View style={[s.priceCard, s.priceCardFeatured]}>
            <View style={s.popularBadge}>
              <Text style={s.popularText}>Popular</Text>
            </View>
            <Text style={s.priceLabel}>Featured</Text>
            <Text style={[s.priceAmount, { color: colors.accent }]}>$299</Text>
            <Text style={s.pricePer}>30 days + promo</Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [s.postBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
          onPress={openPostJob}
        >
          <Feather name="edit" size={18} color={colors.accentForeground} />
          <Text style={s.postBtnText}>Create Job Post</Text>
        </Pressable>
        <Text style={s.note}>Opens the full job posting form with secure Stripe payment.</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  content: { flex: 1, justifyContent: "center", alignItems: "center", padding: spacing.xl },
  iconCircle: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: `${colors.accent}12`, justifyContent: "center", alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: fontSize["2xl"], fontWeight: "900", color: colors.foreground },
  description: {
    color: colors.mutedForeground, fontSize: fontSize.base, textAlign: "center",
    marginTop: 8, lineHeight: 22, maxWidth: 320,
  },
  pricingRow: { flexDirection: "row", gap: 10, marginTop: 24 },
  priceCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: 16,
    borderWidth: 1, borderColor: colors.border, padding: 16, alignItems: "center",
  },
  priceCardFeatured: { borderColor: `${colors.accent}40` },
  popularBadge: {
    position: "absolute", top: -8,
    backgroundColor: colors.accent, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2,
  },
  popularText: { color: colors.accentForeground, fontSize: 10, fontWeight: "700" },
  priceLabel: { color: colors.mutedForeground, fontSize: fontSize.sm, fontWeight: "500" },
  priceAmount: { color: colors.foreground, fontSize: 28, fontWeight: "900", marginTop: 4 },
  pricePer: { color: colors.mutedForeground, fontSize: 11, marginTop: 2 },
  postBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: colors.accent, borderRadius: 16,
    paddingHorizontal: 32, paddingVertical: 18, marginTop: 28,
  },
  postBtnText: { color: colors.accentForeground, fontSize: 17, fontWeight: "800" },
  note: { color: colors.mutedForeground, fontSize: 12, marginTop: 10, textAlign: "center" },
});
