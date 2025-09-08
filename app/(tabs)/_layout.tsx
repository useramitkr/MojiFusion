// app/(tabs)/_layout.tsx - Updated with Settings tab
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { HapticTab } from "@/components/HapticTab";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontWeight: "bold",
          fontSize: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "PlayZone",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "game-controller" : "game-controller-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="themes"
        options={{
          title: "Themes",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "color-palette" : "color-palette-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? "settings" : "settings-outline"} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}