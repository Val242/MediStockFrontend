import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import DrugCard from '@/components/DrugCards';
import SearchBar from '@/components/SearchBar';
import TopSection from '@/components/TopSection';

import NearbyPharmacies from '@/components/NearByPharmacies';
import { fetchDrugs, searchDrugs } from '@/utils/api'; // We'll update api.ts below

type Drug = {
  id: number;
  name: string;
};

const Home = () => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all drugs (initial load)
  const loadDrugs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchDrugs(3,0);
      setDrugs(data.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  // Search drugs from backend
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      loadDrugs();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await searchDrugs(query.trim());
      setDrugs(data);
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
    loadDrugs();
  }, []);

  const handleFindPress = (drugName: string) => {
    Alert.alert('Find', `Looking for ${drugName}...`);
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
              onFindPress={() => handleFindPress(item.name)}
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
        </View>
      )}

      <NearbyPharmacies/>
    </SafeAreaView>
  );
};

export default Home;