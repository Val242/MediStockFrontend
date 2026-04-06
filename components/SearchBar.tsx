import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({value, onChangeText,placeholder}: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons 
        name="search" 
        size={22} 
        color="#212529" 
        style={styles.searchIcon}
      />
      
{/* // In SearchBar.tsx */}
        <TextInput
        style={styles.input}
        placeholder="Search for drugs..."
        placeholderTextColor="#a29797"
        value={value}                    // ← Add this
        onChangeText={onChangeText}      // ← Add this
        returnKeyType="search"
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',            // White background
    borderRadius: 20,                  // Good rounded corners
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#F8F9FA',            // Light border for definition
    marginHorizontal: 20,              // Optional: spacing from screen edges
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;