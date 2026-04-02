import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { concatColorMatrices, grayscale, contrast, saturate, ColorMatrix } from 'react-native-color-matrix-image-filters';
import { generatePDF } from 'react-native-html-to-pdf';
import * as Sharing from 'expo-sharing';

export default function PreviewScreen({ route, navigation }) {
  const { pages } = route.params;
  const photo = pages[pages.length - 1];
  const [activeFilter, setActiveFilter] = useState(grayscale(0));
  const [activeFilterName, setActiveFilterName] = useState('original');

  function applyFilter(filterType) {
  if (filterType === 'grayscale') {
    setActiveFilter(grayscale(1));
    setActiveFilterName('grayscale');
    } else if (filterType === 'contrast') {
    setActiveFilter(contrast(2));
    setActiveFilterName('contrast');
    } else if (filterType === 'magic') {
    setActiveFilter(concatColorMatrices(grayscale(1), contrast(2), saturate(0)));
    setActiveFilterName('magic');
    } else if (filterType === 'original') {
    setActiveFilter(grayscale(0));
    setActiveFilterName('original');
    }
  }

  async function exportPDF() {
    const cssFilter = {
      original: 'none',
      grayscale: 'grayscale(1)',
      contrast: 'contrast(2)',
      magic: 'grayscale(1) contrast(2) saturate(0)',
    }[activeFilterName];

    const imagesHtml = pages.map( pageUri => `
      <div style="page-break-after: always;">  
      <img src="${pageUri}" style="filter: ${cssFilter}; width: 100%; height: 100vh; object-fit: contain;" />
      </div>
      `).join('\n');

    const html = `
      <html>
        <body style="margin:0; padding:0;">
          ${imagesHtml}
        </body>
      </html>
      `;

    const result = await generatePDF({
      html,
      fileName: 'ScannerApp_' + Date.now(),
      directory: 'Documents',
    });

    console.log('Full result:', JSON.stringify(result));
    await Sharing.shareAsync('file://' + result.filePath);
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
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('Camera', { pages: pages })}>
          <Text style={styles.buttonText}>Add Cheese</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.useButton} onPress={exportPDF}>
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
    gap: 8,
    paddingHorizontal: 16,
    width: '100%',
    alignItems: 'stretch',
   },
   retakeButton: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   },
   useButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   },
   addButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   },
   buttonText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    flexShrink: 1,
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