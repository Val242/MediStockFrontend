import DrugCard from '@/components/DrugCards';
import TopSection from '@/components/TopSection';
import { BASE_URL } from '@/utils/api';
import * as Location from 'expo-location';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native';

type DrugItem = {
  id: string;
  name: string;
  image?: string;
};

type PharmacyData = {
  name: string;
  location: string;
  image?: string;
  availableDrugs: DrugItem[];
};

const PharmacyScreen = () => {
  const params = useLocalSearchParams();
  const [pharmacy, setPharmacy] = useState<PharmacyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPharmacy = async () => {
      try {
        if (params.pharmacy) {
          const raw = JSON.parse(params.pharmacy as string);
          const pharmacyId = raw.id;

          let drugs: DrugItem[] = [];

          if (pharmacyId) {
            const res = await fetch(`${BASE_URL}/pharmacies/${pharmacyId}/available-drugs`);
            if (res.ok) {
              const data = await res.json();
              console.log('Drugs API response:', data);

              // Map API response to DrugItem[]
              drugs = data.map((item: any, index: number) => ({
                id: `${index}`,
                name: item.drug?.name || `Drug ${index + 1}`,
                image: item.drug?.image,
              }));
            }
          }

          setPharmacy({
            name: raw.pharmacy || raw.name || 'Pharmacy',
            location: raw.location || raw.address || 'Nearby location',
            image: raw.image,
            availableDrugs: drugs,
          });
        } else {
          // fallback: fetch nearest pharmacy by location
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            console.warn('Location permission denied');
            setLoading(false);
            return;
          }

          const loc = await Location.getCurrentPositionAsync({});
          const res = await fetch(
            `${BASE_URL}/pharmacies/nearby?lat=${loc.coords.latitude}&lng=${loc.coords.longitude}`
          );
          const data = await res.json();

          if (Array.isArray(data) && data.length > 0) {
            const pharmacyItem = data[0];

            const drugs: DrugItem[] = Array.isArray(pharmacyItem.availableDrugs)
              ? pharmacyItem.availableDrugs.map((item: any, index: number) => ({
                  id: `${index}`,
                  name: item.drug?.name || `Drug ${index + 1}`,
                  image: item.drug?.image,
                }))
              : [];

            setPharmacy({
              name: pharmacyItem.pharmacy || pharmacyItem.name || 'Pharmacy',
              location: pharmacyItem.location || pharmacyItem.address || 'Nearby location',
              image: pharmacyItem.image,
              availableDrugs: drugs,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load pharmacy details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPharmacy();
  }, [params.pharmacy]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0057B7" />
      </View>
    );
  }

  if (!pharmacy) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No pharmacy data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopSection />

      <View style={styles.profileSection}>
        <View style={styles.imageFrame}>
          <Image
            source={
              pharmacy.image
                ? { uri: pharmacy.image }
                : require('../../assets/images/logo.png')
            }
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
        <Text style={styles.pharmacyLocation}>{pharmacy.location}</Text>
      </View>

      <Text style={styles.sectionTitle}>Available medication</Text>

      <FlatList
        data={pharmacy.availableDrugs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DrugCard
            name={item.name}
            image={item.image}
            description="Available in stock"
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8FF',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F8FF',
  },
  emptyText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 40,
    color: '#556577',
    fontSize: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 26,
  },
  imageFrame: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0C3870',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 8,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  pharmacyName: {
    marginTop: 16,
    fontSize: 22,
    fontWeight: '800',
    color: '#102A43',
    textAlign: 'center',
  },
  pharmacyLocation: {
    marginTop: 6,
    fontSize: 14,
    color: '#7A869A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#102A43',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 50,
  },
});

export default PharmacyScreen;