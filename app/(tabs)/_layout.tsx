import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: { backgroundColor: '#25292e' },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#25292e' },
      }}
    >
      <Tabs.Screen
        name="index"            // your Home tab
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={ focused ? 'home-sharp' : 'home-outline' }
                      color={color} size={24}/>,
        }}
      />
      <Tabs.Screen
        name="myRosters"        // My Rosters tab
        options={{
          title: 'Rosters',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={ focused ? 'list' : 'list-outline' }
                      color={color} size={24}/>,
        }}
      />
      <Tabs.Screen
        name="rosterTemplate"   // Templates tab
        options={{
          title: 'Templates',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={ focused ? 'folder' : 'folder-outline' }
                      color={color} size={24}/>,
        }}
      />
      <Tabs.Screen
        name="about"            // About tab
        options={{
          title: 'About',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={ focused ? 'information-circle' : 'information-circle-outline' }
                      color={color} size={24}/>,
        }}
      />
    </Tabs>
  );
}
