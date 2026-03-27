import { useState, useRef} from 'react';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState(null);
  const cameraRef = useRef(null);
  
  async function takePhoto() {
   console.log('button farted');
   console.log('cameraRef.current', cameraRef.current);
  
   if (cameraRef.current) {
    console.log('Taking photos...');
    const result = await cameraRef.current.takePictureAsync();
    setPhoto(result.uri);
    console.log('photo taken:', result.uri);
    } else {
      console.log('cameraRef is null - camera not ready!');
      }
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
      <CameraView style={styles.camera} facing="back" ref={cameraRef} />
      <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
       <Text style={styles.captureText}>Cheese</Text>
      </TouchableOpacity>
      {photo && <Text style={styles.photoPath}>{photo}</Text>}
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
  photoPath: {
    position: 'absolute',
    bottom: 120,
    color: '#fff',
    fontSize: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
});
