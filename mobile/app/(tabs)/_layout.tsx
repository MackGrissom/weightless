import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/lib/theme";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: Platform.OS === "ios" ? 88 : 64,
          paddingBottom: Platform.OS === "ios" ? 34 : 8,
          paddingTop: 6,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarAccessibilityLabel: "Home tab - Browse remote jobs",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="feather" size={focused ? 23 : 21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarAccessibilityLabel: "Search tab - Find specific jobs",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="search" size={focused ? 23 : 21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarAccessibilityLabel: "Saved tab - Your bookmarked jobs",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="bookmark" size={focused ? 23 : 21} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarAccessibilityLabel: "Profile tab - Your profile and settings",
          tabBarIcon: ({ color, focused }) => (
            <Feather name="user" size={focused ? 23 : 21} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
