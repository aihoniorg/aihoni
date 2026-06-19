import { Alert, Linking, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';

function openSettingsAlert(title: string, body: string) {
  Alert.alert(title, body, [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Open Settings',
      onPress: () => {
        if (Platform.OS === 'ios') Linking.openURL('app-settings:');
        else Linking.openSettings();
      },
    },
  ]);
}

/** Prompt for the microphone permission; returns true if granted. */
export async function requestMicPermission(): Promise<boolean> {
  const existing = await Audio.getPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) {
    openSettingsAlert(
      'Microphone blocked',
      'Open Settings and enable microphone access for aihoni.',
    );
    return false;
  }
  const res = await Audio.requestPermissionsAsync();
  if (!res.granted) {
    Alert.alert('Microphone needed', 'aihoni cannot hear you without microphone access.');
  }
  return res.granted;
}

/** Prompt for the camera permission; returns true if granted. */
export async function requestCameraPermission(): Promise<boolean> {
  const existing = await ImagePicker.getCameraPermissionsAsync();
  if (existing.granted) return true;
  if (!existing.canAskAgain) {
    openSettingsAlert(
      'Camera blocked',
      'Open Settings and enable camera access for aihoni.',
    );
    return false;
  }
  const res = await ImagePicker.requestCameraPermissionsAsync();
  if (!res.granted) {
    Alert.alert('Camera needed', 'aihoni needs camera access to take a photo.');
  }
  return res.granted;
}
