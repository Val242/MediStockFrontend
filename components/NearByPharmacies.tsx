import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import PharmacyCard from './PharmacyCard';

const NearbyPharmacies = () => {
  // Sample data - replace with real API later
  const pharmacies = [
    { id: '1', name: 'MediPlus Pharmacy' },
    { id: '2', name: 'HealthCare Chemist' },
    { id: '3', name: 'QuickMed Pharmacy' },
    { id: '4', name: 'Wellness Drugstore' },
  ];

  return (
    <View style={styles.container}>
      {/* Header: Title + See All */}
      <View style={styles.header}>
        <Text style={styles.title}>Pharmacies nearby you</Text>
        
        <Pressable onPress={() => console.log('See All Pharmacies pressed')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {/* Horizontal Scrollable Pharmacy Cards */}
      <FlatList
        data={pharmacies}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PharmacyCard 
            name={item.name}
            rating={4.3 + Math.random() * 0.7} // Random rating for demo
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    flex: 1,                    // Takes more space (as you requested)
  },
  seeAll: {
    color: '#0057B7',           // Your primary blue
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    paddingRight: 16,           // Extra space at the end
  },
});

export default NearbyPharmacies;