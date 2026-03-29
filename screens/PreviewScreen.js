import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { concatColorMatrices, grayscale, contrast, saturate, ColorMatrix } from 'react-native-color-matrix-image-filters';

export default function PreviewScreen({ route, navigation }) {
  const { photo } = route.params;
  const [activeFilter, setActiveFilter] = useState(grayscale(0));

  function applyFilter(filterType) {
  if (filterType === 'grayscale') {
    setActiveFilter(grayscale(1));
    } else if (filterType === 'contrast') {
    setActiveFilter(contrast(2));
    } else if (filterType === 'magic') {
    setActiveFilter(concatColorMatrices(grayscale(1), contrast(2), saturate(0)));
    } else if (filterType === 'original') {
    setActiveFilter(grayscale(0));
    }
  }


  return (
    <View style={styles.container}>
      <ColorMatrix matrix={activeFilter} style={styles.preview}>
      <Image source={{ uri: photo }} style={styles.preview} />
      </ColorMatrix>
      <View style={styles.filterButtons}>
        <TouchableOpacity style={styles.filterButton} onPress={() => applyFilter('grayscale')}>
          <Text style={styles.filterText}>Grayscale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => applyFilter('contrast')}>
          <Text style={styles.filterText}>Contrast</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => applyFilter('magic')}>
          <Text style={styles.filterText}>Magic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton} onPress={() => applyFilter('original')}>
          <Text style={styles.filterText}>Original</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.retakeButton} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Another Cheese?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.useButton} onPress={() => console.log('Use photo:', photo)}>
          <Text style={styles.buttonText}>Use This Cheese</Text>
        </TouchableOpacity>
      </View>
    </View>
   );
}

const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: '#000',
   },
   preview: {
     flex: 1,
   },
   buttons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 16,
    alignSelf: 'center',
   },
   retakeButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
   },
   useButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
   },
   buttonText: {
    color: '#000',
    fontWeight: 'bold',
   },
     filterButtons: {
    position: 'absolute',
    top: 40,
    flexDirection: 'row',
    gap: 12,
    alignSelf: 'center',
  },
  filterButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 8,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});