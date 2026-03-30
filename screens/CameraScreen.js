import { useState, useRef} from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CameraScreen({ navigation, route }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  
  async function takePhoto() {
   if (cameraRef.current) {
    const result = await cameraRef.current.takePictureAsync();
    setPhoto(result.uri);
    const existingPages = route.params?.pages || [];
    navigation.navigate('Preview', { pages: [...existingPages, result.uri]});
      }
  }
  
  function retakePhoto() {
    setPhoto(null);
  }

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (    
      <View style={styles.container}>
        <Text style={styles.message}>
          We need permission to use your camera
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef} autofocus="on" />
      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
       <Text style={styles.captureText}>Cheese</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  preview: {
    flex: 1,
  },
  message: {
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
   captureButton: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: 40,
  },
  captureText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf:'center',
  },
  retakeButton: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 8,
  },
  useButton: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
  },
  previewButtons: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    gap: 16,
    alignSelf: 'center',
  },
});
