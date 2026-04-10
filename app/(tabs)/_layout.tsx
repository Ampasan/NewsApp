import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { Tabs } from 'expo-router';
import { Pressable } from 'react-native';

import Colors from '@/constants/Colors';
import { useAppTheme } from '@/context/ThemeContext';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const { scheme, toggleMode } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[scheme].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Berita',
          tabBarIcon: ({ color }) => <TabBarIcon name="newspaper-o" color={color} />,
          headerRight: () => (
            <Pressable onPress={toggleMode}>
              {({ pressed }) => (
                <FontAwesome
                  name={scheme === 'dark' ? 'sun-o' : 'moon-o'}
                  size={22}
                  color={Colors[scheme].text}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Bookmark',
          tabBarIcon: ({ color }) => <TabBarIcon name="bookmark" color={color} />,
        }}
      />
    </Tabs>
  );
}
