import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

type PharmacyCardProps = {
  name: string;
  rating?: number;
  image?: string;
  onPress?: () => void;
};

const PharmacyCard = ({ name, rating = 4.5, image, onPress }: PharmacyCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Round Profile Picture (DP) - Empty for now */}
      <View style={styles.imageContainer}>
     <Image source={
    image
      ? { uri: image }
      : require('../assets/images/logo.png')
  } style={styles.image}/>
      </View>

      {/* Pharmacy Name */}
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>

      {/* Star Rating */}
      <View style={styles.ratingContainer}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    alignItems: 'center',
    marginRight: 16,
  },
  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 45,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default PharmacyCard;