import DrugCard from '@/components/DrugCards';
import NearbyPharmacies from '@/components/NearByPharmacies';
import SearchBar from '@/components/SearchBar';
import TopSection from '@/components/TopSection';
import { ROUTES } from '@/constants/navigation';
import { fetchDrugs, searchDrugs } from '@/utils/api';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Drug = {
  id: number;
  name: string;
  image: string
};

type Pharmacy={
  
}

const Home = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [showNearbyPharmacies, setShowNearbyPharmacies] = useState(true);
  const router = useRouter();

  // Fetch all drugs (initial load or load more)
  const loadDrugs = async (currentOffset = 0, append = false) => {
    try {
      if (!append) setLoading(true);
      setError(null);
      const data = await fetchDrugs(3, currentOffset);
      if (append) {
        setDrugs(prev => [...prev, ...data.data]);
      } else {
        setDrugs(data.data);
      }
      setOffset(currentOffset + 3);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load medicines');
    } finally {
      if (!append) setLoading(false);
    }
  };

  // Load more drugs
  const loadMore = () => {
    loadDrugs(offset, true);
    setShowNearbyPharmacies(false);
  };
  console.log("DRUG DATA:", drugs);

  // Search drugs from backend
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadDrugs(0, false);
      setOffset(3);
      setShowNearbyPharmacies(true);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchDrugs(query.trim());
      setDrugs(data);
      setOffset(0); // Reset offset for search
      setShowNearbyPharmacies(false); // Hide nearby when searching
    } catch (err: any) {
      console.error(err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search (waits 400ms after user stops typing)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Initial load
  useEffect(() => {
    loadDrugs(0, false);
  }, []);

  const handleFindPress = async (drugId: number, drugName: string) => {
    try {
      // 1. Get user location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Enable location to find pharmacies');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      // 2. Call backend
      const response = await fetch(
        `http://10.214.103.72:3000/stock/nearest?lat=${latitude}&lng=${longitude}&drugId=${drugId}`
      );

   
const data = await response.json();




      // Extract lat/lng from API response (handle different field names)
    const nearestPharmacy = data[0];
    console.log(nearestPharmacy)

    const pharmacyLat = nearestPharmacy?.latitude;
    const pharmacyLng = nearestPharmacy?.longitude;


      if (!pharmacyLat || !pharmacyLng) {
        Alert.alert('Error', 'Pharmacy location data not available');
        return;
      }

      // 3. Navigate to map screen with data

      router.push({
        pathname: ROUTES.MAP,
        params: {
          pharmacy: JSON.stringify(data),
          pharmacyLat: String(pharmacyLat),
          pharmacyLng: String(pharmacyLng),
          userLat: String(latitude),
          userLng: String(longitude),
        },
      });
    } catch (error) {
      console.error('Error in handleFindPress:', error);
      Alert.alert('Error', 'Could not find pharmacy');
    }
  };

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' }}>
        <Text style={{ color: '#DC3545', fontSize: 16, textAlign: 'center' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
      <TopSection />

      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for drugs..."
      />

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginTop: 8 }}>
        <Pressable onPress={loadMore}>
          <Text style={{ color: '#0057B7', fontSize: 16, fontWeight: '600' }}>See More</Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0057B7" />
          <Text style={{ marginTop: 12, color: '#666' }}>
            {searchQuery ? 'Searching...' : 'Loading medicines...'}
          </Text>
        </View>
      ) : (
        <View style={{ flexShrink: 1 }}>
          <FlatList
            data={drugs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <DrugCard
                name={item.name}
                description="Available in stock"
                 image={item.image}
                onFindPress={() => handleFindPress(item.id, item.name)}
              />
            )}
            contentContainerStyle={{ paddingVertical: 10, paddingBottom: 30 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Text style={{ color: '#666', fontSize: 16 }}>No drugs found</Text>
              </View>
            }
             
          />
            {showNearbyPharmacies && <NearbyPharmacies />}
        </View>
      )}

    
    </SafeAreaView>
  );
};

export default Home;
