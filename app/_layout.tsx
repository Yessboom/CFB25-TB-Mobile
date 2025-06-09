import { AuthProvider, useAuth } from '@/context/AuthContect';
import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

function AppContent() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <View style={{
        flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#f5f5f5'
      }}>
        <ActivityIndicator size="large" color="#007AFF"/>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated
        ? (
          // only login when NOT authed
          <Stack.Screen name="login" />
        )
        : (
          <>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="login" />
          </>
        )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}