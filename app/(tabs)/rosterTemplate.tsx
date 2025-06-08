import TemplateListScreen from '@/components/rosters/TemplateList';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const RosterDashboardScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Templates  Dashboard</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Templates</Text>
        <TemplateListScreen />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default RosterDashboardScreen;
