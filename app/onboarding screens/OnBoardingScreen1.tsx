import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Onboarding from "react-native-onboarding-swiper";

const { width, height } = Dimensions.get("window");
const BLUE = "#1C5DDB";
const ONBOARDING_KEY = "@meditrack_onboarding_complete";

const CustomDot = ({ selected }: { selected: boolean }) => (
  <View
    style={[styles.dot, selected ? styles.dotActive : styles.dotInactive]}
  />
);

const NextButton = ({ ...props }) => (
  <TouchableOpacity style={styles.nextBtn} {...props} activeOpacity={0.85}>
    <Text style={styles.nextBtnText}>Next</Text>
  </TouchableOpacity>
);

const DoneButton = ({ ...props }) => (
  <TouchableOpacity style={styles.nextBtn} {...props} activeOpacity={0.85}>
    <Text style={styles.nextBtnText}>Get Started</Text>
  </TouchableOpacity>
);

const SkipButton = ({ ...props }) => (
  <TouchableOpacity style={styles.skipBtn} {...props} activeOpacity={0.7}>
    <Text style={styles.skipBtnText}>Skip</Text>
  </TouchableOpacity>
);
const SlideImage = ({ color }: { color: string }) => (
  <View style={[styles.imagePlaceholder, { backgroundColor: color }]}>
    {/* Replace this View with:
        <Image
          source={require('../assets/onboarding1.png')}
          style={styles.image}
          resizeMode="contain"
        />
    */}
  </View>
);

const OnboardingScreen = () => {
  const router = useRouter();

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (e) {
      console.warn("AsyncStorage error:", e);
    } finally {
      router.replace("/(tabs)" as any);
    }
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
    } catch (e) {
      console.warn("AsyncStorage error:", e);
    } finally {
      router.replace("/(tabs)" as any);
    }
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleSkip}
      showSkip={true}
      NextButtonComponent={NextButton}
      DoneButtonComponent={DoneButton}
      SkipButtonComponent={SkipButton}
      DotComponent={CustomDot}
      bottomBarColor="#F5F5F5"
      bottomBarHeight={120}
      containerStyles={styles.container}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
      pages={[
        {
          backgroundColor: "#F5F5F5",
          image: <SlideImage color="#D3D3D3" />,
          title: "Find pharmacy\nnear you",
          subtitle:
            "It's easy to find pharmacy that is near to your location. With just one tap.",
        },
        {
          backgroundColor: "#F5F5F5",
          image: <SlideImage color="#D3D3D3" />,
          title: "Search with \n our database",
          subtitle:
            "It's easy to find pharmacy that is near to your location. With just one tap.",
        },
        {
          backgroundColor: "#F5F5F5",
          image: <SlideImage color="#D3D3D3" />,
          title: "Get delivery on \n your door",
          subtitle:
            "It's easy to find pharmacy that is near to your location. With just one tap.",
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    paddingHorizontal: 24,
  },

  // Image placeholder
  imagePlaceholder: {
    width: width - 48,
    height: height * 0.36,
    borderRadius: 12,
    marginBottom: 8,
  },
  image: {
    width: width - 48,
    height: height * 0.36,
    borderRadius: 12,
  },

  // Title & subtitle
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#1A1D2E",
    textAlign: "left",
    lineHeight: 38,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#888888",
    textAlign: "left",
    lineHeight: 22,
    maxWidth: "80%",
  },

  // Dots
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
  },
  dotActive: {
    width: 20,
    backgroundColor: BLUE,
  },
  dotInactive: {
    width: 8,
    backgroundColor: "#CCCCCC",
  },

  // Next / Get Started button
  nextBtn: {
    backgroundColor: BLUE,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },

  // Skip button
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  skipBtnText: {
    fontSize: 15,
    color: "#999999",
    fontWeight: "500",
  },
});

export default OnboardingScreen;
