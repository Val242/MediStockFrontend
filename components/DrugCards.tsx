import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type DrugCardProps = {
  name: string;
  description?: string;
  image?: any;           // require() or { uri: string }
  onFindPress?: () => void;
};

const DrugCard = ({ 
  name, 
  description = "Available in stock", 
  image, 
  onFindPress 
}: DrugCardProps) => {
  return (
    <View style={styles.card}>
      
      {/* First Section: Image + Drug Info */}
      <View style={styles.mainContent}>
        
        {/* Medicine Image */}
        {/* <Image 
          source={image || require('../assets/images/medicine-placeholder.png')} 
          style={styles.image}
        /> */}

        {/* Drug Details - Takes more space */}
        <View style={styles.details}>
          <Text style={styles.drugName}>{name}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

      </View>

      {/* Second Section: "Find" Button */}
      <Pressable 
        style={styles.findButton} 
        onPress={onFindPress}
      >
        <Text style={styles.findText}>Find</Text>
      </Pressable>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal:15,
    paddingVertical:25,
    marginHorizontal: 16,
    marginVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  mainContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#f8f9fa',
  },

  details: {
    flex: 1,
    marginLeft: 14,
  },

  drugName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },

  description: {
    fontSize: 14,
    color: '#666',
  },

  findButton: {
    backgroundColor: '#f1f1f1',        // Gray background
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 25,
    marginLeft: 12,
  },

  findText: {
    color: '#0057B7',                  // Blue text as requested
    fontWeight: '600',
    fontSize: 15,
  },
});

export default DrugCard;