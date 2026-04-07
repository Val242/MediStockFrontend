import { BASE_URL } from "@/utils/api";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRIMARY_BLUE = "#0057B7";

type SmartSearchResult = {
  pharmacy: string;
  distance: number;
  availableDrugs: string[];
};

const commonSearches = [
  { label: "Fever & headache" },
  { label: "Sore throat" },
  { label: "Stomach pain" },
  { label: "Paracetamol" },
  { label: "Malaria" },
  { label: "Antibiotics" },
];

export default function Chat() {
  const [query, setQuery] = useState("");
  const [responseItems, setResponseItems] = useState<SmartSearchResult[] | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      Alert.alert(
        "What are you looking for?",
        "Try a symptom or medicine name like fever, sore throat, or paracetamol."
      );
      return;
    }

    setIsSearching(true);
    setResponseText(null);
    setResponseItems(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Location required",
          "Please enable location permissions so we can find the nearest hospital with the medicine."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(`${BASE_URL}/stock/smart-search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: trimmedQuery,
          lat: latitude,
          lng: longitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setResponseItems(data as SmartSearchResult[]);
      } else if (typeof data === "string") {
        setResponseText(data);
      } else {
        const resultText = data?.message || data?.result || JSON.stringify(data, null, 2);
        setResponseText(resultText);
      }
    } catch (error: any) {
      console.error("Smart search error:", error);
      Alert.alert(
        "Search failed",
        error?.message || "Unable to reach the AI service."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleChipClick = (label: string) => {
    setQuery(label);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={PRIMARY_BLUE} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroSection}>
          <View style={styles.bgCircle1} />
          <View style={styles.bgCircle2} />

          <View style={styles.topBar}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoMedi}>Medi</Text>
              <Text style={styles.logoStock}>Stock</Text>
            </View>

            <View style={styles.locationContainer}>
              <View style={styles.locationDot} />
              <Text style={styles.locationText}>Nearby</Text>
            </View>
          </View>

          <Text style={styles.headline}>Find your{"\n"}medicine nearby</Text>
          <Text style={styles.subheadline}>
            Describe what you need in plain words
          </Text>

          <View style={styles.searchContainer}>

            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              placeholder="e.g. I have fever and sore throat..."
              placeholderTextColor="#7D8DA6"
              selectionColor={PRIMARY_BLUE}
              returnKeyType="search"
            />

            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.searchHint}>
            Try paracetamol, malaria treatment, or child cough syrup
          </Text>

          {isSearching ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>Searching AI backend...</Text>
            </View>
          ) : responseItems ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Nearest pharmacies with availability</Text>
              {responseItems.map((item, index) => (
                <View key={`${item.pharmacy}-${index}`} style={styles.pharmacyResult}>
                  <Text style={styles.pharmacyName}>{item.pharmacy}</Text>
                  <Text style={styles.distanceText}>
                    {item.distance.toFixed(1)} km away
                  </Text>
                  <Text style={styles.availableDrugsLabel}>Available drugs:</Text>
                  <Text style={styles.availableDrugsText}>
                    {item.availableDrugs.join(", ")}
                  </Text>
                </View>
              ))}
            </View>
          ) : responseText ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>AI Smart Search Result</Text>
              <Text style={styles.resultText}>{responseText}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.commonSearchesCard}>
          <Text style={styles.sectionTitle}>Common Searches</Text>
          <Text style={styles.sectionSubtitle}>
            Tap any one to fill the search box faster
          </Text>

          <View style={styles.chipsContainer}>
            {commonSearches.map(({ label }) => {
              const isSelected = query === label;

              return (
                <TouchableOpacity
                  key={label}
                  style={[styles.chip, isSelected && styles.chipActive]}
                  onPress={() => handleChipClick(label)}
                  activeOpacity={0.9}
                >
                  <Text
                    style={[styles.chipText, isSelected && styles.chipTextActive]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_BLUE,
  },
  container: {
    flex: 1,
    backgroundColor: "#F4F8FF",
  },
  contentContainer: {
    paddingBottom: 32,
  },
  heroSection: {
    backgroundColor: PRIMARY_BLUE,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 38,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  bgCircle1: {
    position: "absolute",
    top: -50,
    right: -45,
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  bgCircle2: {
    position: "absolute",
    top: 72,
    right: 18,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "rgba(111, 185, 255, 0.22)",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 34,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  logoMedi: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 24,
    letterSpacing: -0.4,
  },
  logoStock: {
    color: "#9ED1FF",
    fontWeight: "800",
    fontSize: 24,
    letterSpacing: -0.4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8FE3FF",
  },
  locationText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  headline: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    lineHeight: 40,
    marginBottom: 10,
    letterSpacing: -0.7,
  },
  subheadline: {
    color: "rgba(255,255,255,0.84)",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 260,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    gap: 10,
    shadowColor: "#003E85",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#173052",
    minHeight: 42,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: PRIMARY_BLUE,
    justifyContent: "center",
    alignItems: "center",
  },
  searchHint: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 13,
    marginTop: 12,
  },
  commonSearchesCard: {
    marginTop: 22,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#0C3870",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#5B6F8E",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: "#2B4262",
    marginBottom: 18,
    lineHeight: 22,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#D7E6FB",
    backgroundColor: "#F7FAFF",
  },
  chipActive: {
    backgroundColor: PRIMARY_BLUE,
    borderColor: PRIMARY_BLUE,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3658",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },
  resultCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#0C3870",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2B4262",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 15,
    color: "#3C4A66",
    lineHeight: 22,
  },
  pharmacyResult: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E6EDF7",
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#102A43",
  },
  distanceText: {
    fontSize: 13,
    color: "#5B6F8E",
    marginTop: 4,
  },
  availableDrugsLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0D3B66",
    marginTop: 10,
  },
  availableDrugsText: {
    fontSize: 14,
    color: "#334E68",
    marginTop: 4,
    lineHeight: 20,
  },
});