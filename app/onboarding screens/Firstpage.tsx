import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";

const ONBOARDING_KEY = "@meditrack_onboarding_complete";

const Firstpage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        if (hasSeenOnboarding === "true") {
          router.replace("/phoneAuth/PhoneAuth");
        } else {
          router.replace("/onboarding screens/OnBoardingScreen1");
        }
      } catch (e) {
        router.replace("/onboarding screens/OnBoardingScreen1");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      {/* App Name */}
      <Text style={styles.appName}>MediStock</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  appName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1D2E",
    letterSpacing: 0.5,
  },
});

export default Firstpage;
