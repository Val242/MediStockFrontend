import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Pharmacy = {
  id: number;
  name: string;
  lat: number;
  lng: number;
};

type MapScreenProps = {
  pharmacyLat?: string | number;
  pharmacyLng?: string | number;
  userLat?: string | number;
  userLng?: string | number;
};

const MapScreen = ({ pharmacyLat, pharmacyLng, userLat, userLng }: MapScreenProps) => {
  
  // ✅ Initialize immediately (no delay)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(() => {
    if (userLat && userLng) {
      return {
        latitude: typeof userLat === 'string' ? parseFloat(userLat) : userLat,
        longitude: typeof userLng === 'string' ? parseFloat(userLng) : userLng,
      };
    }
    return null;
  });

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(() => {
    if (pharmacyLat && pharmacyLng) {
      return {
        id: 0,
        name: 'Pharmacy',
        lat: typeof pharmacyLat === 'string' ? parseFloat(pharmacyLat) : pharmacyLat,
        lng: typeof pharmacyLng === 'string' ? parseFloat(pharmacyLng) : pharmacyLng,
      };
    }
    return null;
  });

  // ✅ Only fetch location if not provided
  useEffect(() => {
    if (userLocation) return;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required.');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.error(err);
      }
    };

    getLocation();
  }, []);

  // ⛔ No loading state needed anymore
  if (!userLocation) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0057B7" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: pharmacy?.lat ?? userLocation.latitude,
        longitude: pharmacy?.lng ?? userLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
    >
      {/* ✅ User marker */}
      <Marker
        coordinate={userLocation}
        title="You"
      />

      {/* ✅ Pharmacy marker */}
      {pharmacy && (
        <Marker
          coordinate={{ latitude: pharmacy.lat, longitude: pharmacy.lng }}
          title={pharmacy.name}
        />
      )}
    </MapView>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  map: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});