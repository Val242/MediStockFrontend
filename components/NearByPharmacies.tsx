import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PharmacyCard from './PharmacyCard';

type Pharmacy = {
  id: number;
  name: string;
  image?: string;
};

const BASE_URL = "http://10.214.103.72:3000";

const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);

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
        `${BASE_URL}/pharmacies/nearby?lat=${latitude}&lng=${longitude}`
      );

      const data = await response.json();
      console.log("Nearby pharmacies:", data);

      setPharmacies(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to fetch pharmacies');
    }
  };

  useEffect(() => {
    fetchNearbyPharmacies();
  }, []);

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pharmacies nearby you</Text>

        <Pressable onPress={() => console.log('See All pressed')}>
          <Text style={styles.seeAll}>See all</Text>
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={pharmacies}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => {
          
          // 🔥 Handle image URL properly
          const imageUrl = item.image
            ? item.image.startsWith('http')
              ? item.image
              : `${BASE_URL}/uploads/${item.image}`
            : undefined;

          return (
            <PharmacyCard
              name={item.name}
              rating={4.3 + Math.random() * 0.7}
              image={imageUrl}
            />
          );
        }}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default NearbyPharmacies;

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
    flex: 1,
  },

  seeAll: {
    color: '#0057B7',
    fontSize: 16,
    fontWeight: '600',
  },

  listContent: {
    paddingRight: 16,
  },
});