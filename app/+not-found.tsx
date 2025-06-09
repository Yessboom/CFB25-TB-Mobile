import { getCurrentUser } from "@/api/auth";
import { Link, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  const [redirectUrl, setRedirectUrl] = useState("/login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          setRedirectUrl("/(tabs)/userInfos");
        } else {
          setRedirectUrl("/login");
        }
      } catch (error) {
        console.error('Error checking user:', error);
        setRedirectUrl("/login");
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not found" }} />
      <View style={styles.container}>
        <Text style={styles.title}>This page doesn&apos;t exist.</Text>
        
        {loading ? (
          <Text style={styles.loading}>Loading...</Text>
        ) : (
          <Link href={redirectUrl as any} style={styles.button}>
            {redirectUrl.includes('userInfos') ? 'Go to Profile' : 'Go to Login'}
          </Link>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#ccc',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#007AFF',
    marginTop: 20,
  },
});