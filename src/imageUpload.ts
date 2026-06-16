import { ActionSheetIOS, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_BASE, ApiError, getCachedToken } from './apiClient';

export interface UploadedMedia {
  key: string;
  size: number;
  contentType: string;
  url: string;
}

export interface PickOptions {
  allowsEditing?: boolean;
  aspect?: [number, number];
  quality?: number;
}

type Source = 'library' | 'camera';

function chooseSource(): Promise<Source | null> {
  return new Promise((resolve) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Photo library', 'Take photo'],
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx === 1) resolve('library');
          else if (idx === 2) resolve('camera');
          else resolve(null);
        },
      );
    } else {
      Alert.alert('Add a photo', undefined, [
        { text: 'Photo library', onPress: () => resolve('library') },
        { text: 'Take photo', onPress: () => resolve('camera') },
        { text: 'Cancel', style: 'cancel', onPress: () => resolve(null) },
      ]);
    }
  });
}

async function pickFromLibrary(opts: PickOptions): Promise<ImagePicker.ImagePickerAsset | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permission needed', 'Allow photo library access to pick an image.');
    return null;
  }
  const res = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: opts.allowsEditing ?? true,
    aspect: opts.aspect,
    quality: opts.quality ?? 0.85,
  });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0];
}

async function pickFromCamera(opts: PickOptions): Promise<ImagePicker.ImagePickerAsset | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) {
    Alert.alert('Permission needed', 'Allow camera access to take a photo.');
    return null;
  }
  const res = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: opts.allowsEditing ?? true,
    aspect: opts.aspect,
    quality: opts.quality ?? 0.85,
  });
  if (res.canceled || !res.assets?.length) return null;
  return res.assets[0];
}

export async function pickImage(opts: PickOptions = {}): Promise<ImagePicker.ImagePickerAsset | null> {
  const source = await chooseSource();
  if (!source) return null;
  return source === 'library' ? pickFromLibrary(opts) : pickFromCamera(opts);
}

export async function uploadImage(asset: ImagePicker.ImagePickerAsset): Promise<UploadedMedia> {
  const token = getCachedToken();
  if (!token) throw new ApiError(401, null, 'Not signed in');

  const contentType = asset.mimeType || 'image/jpeg';
  const fetched = await fetch(asset.uri);
  const body = await fetched.arrayBuffer();

  const res = await fetch(`${API_BASE}/api/media/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType,
    },
    body,
  });

  const payload = (await res.json().catch(() => null)) as UploadedMedia | { error?: string } | null;
  if (!res.ok) {
    const msg = payload && 'error' in payload && payload.error ? payload.error : `HTTP ${res.status}`;
    throw new ApiError(res.status, payload, msg);
  }
  return payload as UploadedMedia;
}

export async function pickAndUploadImage(opts: PickOptions = {}): Promise<UploadedMedia | null> {
  const asset = await pickImage(opts);
  if (!asset) return null;
  try {
    return await uploadImage(asset);
  } catch (e) {
    Alert.alert('Upload failed', String((e as Error).message ?? e));
    return null;
  }
}
