import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import PharmacyCard from './PharmacyCard';

const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);

  const fetchNearbyPharmacies = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const response = await fetch(
        `http://10.214.103.72:3000/pharmacies/nearby?lat=${latitude}&lng=${longitude}`
      );

      const data = await response.json();
      console.log("Nearby pharmacies:", data);
      setPharmacies(data); // Set the fetched data to state

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNearbyPharmacies();
  }, []);

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