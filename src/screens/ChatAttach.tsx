import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHChatInput, RIPPLE, pressedOpacity } from '../components/ui';
import { AH_BRAND_FONT, INK, ACCENT, BG_SOFT } from '../theme';
import { useNav } from '../nav';
import { uploadImage } from '../imageUpload';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path, Rect } from 'react-native-svg';

// 16 · Chat · attachment sheet (WhatsApp-style paperclip menu).
export function ChatAttach() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [uploading, setUploading] = useState(false);

  const attach = async (source: 'photo' | 'camera') => {
    if (uploading) return;
    setUploading(true);
    try {
      let asset: ImagePicker.ImagePickerAsset | null = null;
      if (source === 'photo') {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission needed', 'Allow photo library access.');
          return;
        }
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.85,
        });
        if (!res.canceled && res.assets.length) asset = res.assets[0];
      } else {
        const perm = await ImagePicker.requestCameraPermissionsAsync();
        if (!perm.granted) {
          Alert.alert('Permission needed', 'Allow camera access.');
          return;
        }
        const res = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.85,
        });
        if (!res.canceled && res.assets.length) asset = res.assets[0];
      }
      if (!asset) return;
      const media = await uploadImage(asset);
      Alert.alert('Sent', 'Attachment uploaded.', [
        { text: 'OK', onPress: () => nav.back() },
      ]);
      void media; // TODO: pass key/url back to Chat thread on next slice
    } catch (e) {
      Alert.alert('Upload failed', String((e as Error).message ?? e));
    } finally {
      setUploading(false);
    }
  };
  const sheetItems = [
    { id: 'photo', label: 'Photo', d: 'M3 5h18v15H3zM3 16l5-5 5 5 3-3 5 5' },
    { id: 'camera', label: 'Camera', d: 'M4 7h3l2-3h6l2 3h3v13H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
    { id: 'file', label: 'Document', d: 'M6 3h8l5 5v13H6zM14 3v5h5' },
    { id: 'voice', label: 'Audio', d: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11.5a7 7 0 0 0 14 0M12 18.5V22' },
    { id: 'loc', label: 'Location', d: 'M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11zM12 12.5a2.4 2.4 0 1 0 0-5 2.4 2.4 0 0 0 0 5z' },
    { id: 'contact', label: 'Contact', d: 'M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM5 21a7 7 0 0 1 14 0' },
    { id: 'product', label: 'Product', d: 'M3 9l9-6 9 6v12H3zM9 21v-7h6v7' },
    { id: 'poll', label: 'Poll', d: 'M5 19V11M12 19V5M19 19V14' },
  ];

  return (
    <AHScreen pad={false}>
      {/* header */}
      <View
        style={{
          paddingTop: insets.top + 12,
          paddingHorizontal: 18,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 11,
          backgroundColor: '#fff',
        }}
      >
        <Pressable onPress={nav.back}>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Path
              d="M14 6l-6 6 6 6"
              stroke={INK}
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: ACCENT,
            padding: 1.5,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 20,
              backgroundColor: ACCENT + '50',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: ACCENT,
                fontFamily: AH_BRAND_FONT,
                fontWeight: '800',
                fontSize: 14,
              }}
            >
              {'सी'}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '700', color: INK }}>
            Sita Gurung
          </Text>
          <Text style={{ fontSize: 11.5, color: ACCENT, fontWeight: '600', marginTop: 1 }}>
            Online
          </Text>
        </View>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="6" width="13" height="12" rx="3" stroke={INK} strokeWidth={1.8} />
          <Path
            d="M16 10l5-3v10l-5-3z"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 5c0-1 1-2 2-2h2l2 4-2 1.5c1 3 3 5 6 6L15.5 13l4 2v2c0 1-1 2-2 2-7.2 0-13-5.8-13-13z"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      </View>

      {/* faded messages behind */}
      <View
        style={{
          flex: 1,
          padding: 14,
          paddingHorizontal: 16,
          paddingBottom: 8,
          flexDirection: 'column',
          gap: 10,
          overflow: 'hidden',
          opacity: 0.55,
        }}
      >
        <View style={{ alignSelf: 'flex-start', maxWidth: 250 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              borderBottomLeftRadius: 6,
              padding: 11,
              paddingHorizontal: 15,
              paddingBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 20, color: INK }}>
              {'तपाईंलाई के पठाउने?'}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: 'flex-end', maxWidth: 260 }}>
          <View
            style={{
              backgroundColor: INK,
              borderRadius: 20,
              borderBottomRightRadius: 6,
              padding: 10,
              paddingHorizontal: 14,
              paddingBottom: 8,
            }}
          >
            <Text style={{ fontSize: 14, lineHeight: 20, color: '#fff' }}>
              {'एक मिनेट, फोटो attach गर्छु…'}
            </Text>
          </View>
        </View>
      </View>

      {/* dim overlay */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20,12,4,0.18)',
        }}
      />

      {/* attachment sheet */}
      <View
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: 14,
          paddingHorizontal: 18,
          paddingBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -14 },
          shadowOpacity: 0.25,
          shadowRadius: 36,
          elevation: 10,
        }}
      >
        <View
          style={{
            width: 40,
            height: 5,
            borderRadius: 99,
            backgroundColor: '#E8DCC0',
            alignSelf: 'center',
            marginBottom: 12,
          }}
        />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {sheetItems.map((it) => (
            <Pressable
              key={it.id}
              onPress={
                it.id === 'photo'
                  ? () => attach('photo')
                  : it.id === 'camera'
                  ? () => attach('camera')
                  : undefined
              }
              disabled={(it.id === 'photo' || it.id === 'camera') && uploading}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                width: '22%',
                alignItems: 'center',
                gap: 8,
                paddingVertical: 4,
                opacity: (it.id === 'photo' || it.id === 'camera') && uploading ? 0.6 : 1,
              })}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 22,
                  flexShrink: 0,
                  backgroundColor: BG_SOFT,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Svg width={27} height={27} viewBox="0 0 24 24" fill="none">
                  <Path
                    d={it.d}
                    stroke={INK}
                    strokeWidth={1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: INK }}>
                {it.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <AHChatInput placeholder="Type a message" />
    </AHScreen>
  );
}
