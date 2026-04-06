import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

const TopSection = () => {
  return (
    <View style={{
      marginTop: 5,
      flexDirection: "row",
      alignItems: "center",        // Vertically center everything
      justifyContent: "space-between",  // Pushes icons to edges
      paddingHorizontal: 16,       // Nice padding on left & right
      marginBottom:10
    }}>
      
      {/* Left: Hamburger Menu */}
      <Ionicons name="menu" size={28} color="#212529" />

      {/* Center: Logo + App Name (Takes most space) */}
      <View style={{
        flex: 1,                    // Takes maximum available space
        alignItems: "center",       // Center the logo + text
        flexDirection: "row",
        justifyContent: "center",
      }}>
        <Image 
          source={require("../assets/images/logo.png")}
          style={{ 
            width: 30, 
            height: 28, 
            resizeMode: "contain", 
            borderRadius: 25 
          }} 
        />
        <Text style={{
          color: "#212529",
          fontSize: 18,
          fontWeight: "600",
          marginLeft: 8,
        }}>
          MediStock
        </Text>
      </View>

      {/* Right: Notification Icon */}
      <Ionicons name="notifications-outline" size={28} color="#212529" />

    </View>
  );
};

export default TopSection;