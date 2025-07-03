import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  Asset,
} from 'react-native-image-picker';
import {
  check,
  request,
  openSettings,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const openAppSettings = () => {
    Alert.alert(
      'Permission Required',
      'Please enable permission from app settings to proceed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => openSettings() },
      ],
    );
  };

  const requestPermission = async (type: 'camera' | 'gallery') => {
    let permission;
    if (type === 'camera') {
      permission =
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.CAMERA
          : PERMISSIONS.IOS.CAMERA;
    } else {
      permission =
        Platform.OS === 'android'
          ? Platform.Version >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
          : PERMISSIONS.IOS.PHOTO_LIBRARY;
    }

    const status = await check(permission);
    if (status === RESULTS.GRANTED) return true;
    if (status === RESULTS.BLOCKED) {
      openAppSettings();
      return false;
    }

    const result = await request(permission);
    if (result === RESULTS.GRANTED) return true;
    if (result === RESULTS.BLOCKED) openAppSettings();
    return false;
  };

  const simulateUploadProgress = () => {
    setUploading(true);
    setProgress(0);
    let count = 0;
    intervalRef.current = setInterval(() => {
      count += 1;
      setProgress(count);
      if (count >= 100) {
        clearInterval(intervalRef.current!);
        setUploading(false);
      }
    }, 10);
  };

  const handleImagePick = async (type: 'camera' | 'gallery') => {
    const granted = await requestPermission(type);
    if (!granted) return;

    const options = {
      mediaType: 'photo' as const,
      includeBase64: false,
    };

    const result =
      type === 'camera'
        ? await launchCamera(options)
        : await launchImageLibrary(options);

    if (result.didCancel) {
      console.log('User cancelled image picker');
    } else if (result.errorCode) {
      console.log('ImagePicker Error:', result.errorMessage);
      Alert.alert('Error', result.errorMessage || 'Unknown error');
    } else if (result.assets && result.assets.length > 0) {
      const selected: Asset = result.assets[0];
      if (selected.uri) {
        setAvatar(selected.uri);
        simulateUploadProgress();
      }
    }
  };

  const validate = () => {
    let valid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      valid = false;
    } else {
      setNameError('');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }

    if (valid) {
      Alert.alert('Success', 'Profile updated successfully!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatarWrapper}>
          {avatar && !uploading && progress === 100 ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.placeholderAvatar}>
              <Text style={styles.placeholderText}>
                {uploading ? `${progress}%` : 'No Image'}
              </Text>
            </View>
          )}
        </View>

        {uploading && (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
            <Text style={styles.progressText}>{progress}%</Text>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePick('camera')}
          >
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleImagePick('gallery')}
          >
            <Text style={styles.buttonText}>Choose Gallery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#999"
      />
      {nameError ? <Text style={styles.error}>{nameError}</Text> : null}

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

      <TouchableOpacity style={styles.saveButton} onPress={validate}>
        <Text style={styles.saveButtonText}>Save Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 20,
    color: '#1e293b',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  avatarWrapper: {
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#64748b',
    fontSize: 12,
  },
  progressBar: {
    width: '80%',
    height: 14,
    borderRadius: 8,
    backgroundColor: '#cbd5e1',
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 4,
    justifyContent: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  progressText: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
    borderColor: '#e2e8f0',
    borderWidth: 1,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProfileScreen;
