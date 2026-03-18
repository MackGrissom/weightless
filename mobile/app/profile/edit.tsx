import { useState, useEffect } from "react";
import {
  View, Text, TextInput, ScrollView, Pressable,
  StyleSheet, Alert, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useAuth, useRequireAuth } from "@/lib/auth";
import { uploadResume } from "@/lib/storage";
import { colors, spacing, fontSize, borderRadius } from "@/lib/theme";

export default function EditProfileScreen() {
  useRequireAuth();
  const { user, profile, updateProfile } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState({
    full_name: "",
    headline: "",
    location: "",
    bio: "",
    skills: [] as string[],
    linkedin_url: "",
    github_url: "",
    portfolio_url: "",
    resume_url: null as string | null,
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || "",
        headline: profile.headline || "",
        location: profile.location || "",
        bio: profile.bio || "",
        skills: profile.skills || [],
        linkedin_url: profile.linkedin_url || "",
        github_url: profile.github_url || "",
        portfolio_url: profile.portfolio_url || "",
        resume_url: profile.resume_url,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile(form);
    setSaving(false);
    if (error) Alert.alert("Error", error);
    else {
      Alert.alert("Saved", "Your profile has been updated.");
      router.back();
    }
  };

  const handleResumeUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;

    const file = result.assets[0];
    if (file.size && file.size > 5 * 1024 * 1024) {
      Alert.alert("Too large", "Resume must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const path = await uploadResume(user!.id, file.uri, file.name);
      setForm((f) => ({ ...f, resume_url: path }));
      Alert.alert("Uploaded", "Resume uploaded successfully.");
    } catch (err) {
      Alert.alert("Error", "Failed to upload resume. Please try again.");
      console.error("Resume upload error:", err);
    }
    setUploading(false);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (!s || form.skills.includes(s)) return;
    setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setForm((f) => ({ ...f, skills: f.skills.filter((_, i) => i !== index) }));
  };

  const update = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  return (
    <SafeAreaView style={st.container} edges={["top"]}>
      <View style={st.header}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="chevron-left" size={26} color={colors.foreground} />
        </Pressable>
        <Text style={st.headerTitle}>Edit Profile</Text>
        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [st.saveHeaderBtn, pressed && { opacity: 0.7 }]}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Text style={st.saveHeaderText}>Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>
        <Field label="Full Name" placeholder="Jane Doe" value={form.full_name} onChangeText={(v) => update("full_name", v)} />
        <Field label="Headline" placeholder="Senior Frontend Engineer" value={form.headline} onChangeText={(v) => update("headline", v)} />
        <Field label="Location" placeholder="Lisbon, Portugal" value={form.location} onChangeText={(v) => update("location", v)} />
        <Field label="Bio" placeholder="Tell employers about yourself..." value={form.bio} onChangeText={(v) => update("bio", v)} multiline />

        {/* Skills */}
        <Text style={st.label}>Skills</Text>
        <View style={st.skillInputRow}>
          <TextInput
            style={[st.input, { flex: 1 }]}
            placeholder="Add a skill..."
            placeholderTextColor={colors.mutedForeground}
            value={skillInput}
            onChangeText={setSkillInput}
            onSubmitEditing={addSkill}
            returnKeyType="done"
          />
          <Pressable style={st.addSkillBtn} onPress={addSkill}>
            <Feather name="plus" size={18} color={colors.accentForeground} />
          </Pressable>
        </View>
        <View style={st.skillsRow}>
          {form.skills.map((s, i) => (
            <Pressable key={`${s}-${i}`} onPress={() => removeSkill(i)} style={st.skillBadge}>
              <Text style={st.skillBadgeText}>{s}</Text>
              <Feather name="x" size={11} color={colors.mutedForeground} />
            </Pressable>
          ))}
        </View>

        {/* Resume */}
        <Text style={st.label}>Resume</Text>
        <Pressable
          style={({ pressed }) => [st.uploadBtn, pressed && { opacity: 0.7 }]}
          onPress={handleResumeUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Feather name="upload" size={18} color={colors.accent} />
          )}
          <Text style={st.uploadText}>
            {form.resume_url ? "Resume uploaded — tap to replace" : "Upload PDF resume (max 5MB)"}
          </Text>
        </Pressable>

        {/* Links */}
        <Field label="LinkedIn" placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChangeText={(v) => update("linkedin_url", v)} keyboardType="url" />
        <Field label="GitHub" placeholder="https://github.com/..." value={form.github_url} onChangeText={(v) => update("github_url", v)} keyboardType="url" />
        <Field label="Portfolio" placeholder="https://yoursite.com" value={form.portfolio_url} onChangeText={(v) => update("portfolio_url", v)} keyboardType="url" />

        {/* Save button */}
        <Pressable
          style={({ pressed }) => [st.saveBtn, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color={colors.accentForeground} />
          ) : (
            <Text style={st.saveBtnText}>Save Profile</Text>
          )}
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, placeholder, value, onChangeText, multiline, keyboardType }: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "url";
}) {
  return (
    <View style={st.fieldGroup}>
      <Text style={st.label}>{label}</Text>
      <TextInput
        style={[st.input, multiline && st.textArea]}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        autoCapitalize={keyboardType === "url" ? "none" : "sentences"}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: fontSize.lg, fontWeight: "700", color: colors.foreground },
  saveHeaderBtn: { paddingHorizontal: 12, paddingVertical: 6 },
  saveHeaderText: { color: colors.accent, fontSize: fontSize.base, fontWeight: "700" },
  scroll: { padding: spacing.md },
  fieldGroup: { marginBottom: 16 },
  label: {
    color: colors.mutedForeground, fontSize: 12, fontWeight: "700",
    marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.muted, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 16, paddingVertical: 14,
    color: colors.foreground, fontSize: fontSize.base,
  },
  textArea: { minHeight: 100 },
  skillInputRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  addSkillBtn: {
    width: 48, borderRadius: 14,
    backgroundColor: colors.accent, justifyContent: "center", alignItems: "center",
  },
  skillsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 },
  skillBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: `${colors.accent}12`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8,
  },
  skillBadgeText: { color: colors.accent, fontSize: fontSize.sm, fontWeight: "500" },
  uploadBtn: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border, borderStyle: "dashed",
    padding: 16, marginBottom: 16,
  },
  uploadText: { color: colors.mutedForeground, fontSize: fontSize.sm, flex: 1 },
  saveBtn: {
    backgroundColor: colors.accent, borderRadius: 16, paddingVertical: 18,
    alignItems: "center", marginTop: 8,
  },
  saveBtnText: { color: colors.accentForeground, fontSize: 17, fontWeight: "800" },
});
