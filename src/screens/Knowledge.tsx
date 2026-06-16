import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHHeader, AHButton, RIPPLE, pressedOpacity } from '../components/ui';
import { AH_BRAND_FONT, INK, MUTED, BG_SOFT } from '../theme';
import { useNav } from '../nav';
import { pickAndUploadImage } from '../imageUpload';
import { api, ApiError } from '../apiClient';
import { useBusiness } from '../business';
import Svg, { Path } from 'react-native-svg';

interface PhotoItem {
  url: string;
  title: string;
  sub: string;
}

// 10 · Teach aihoni your business — unified input grid + knowledge list.
export function Knowledge() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const { currentId } = useBusiness();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [uploading, setUploading] = useState(false);

  const addPhoto = async () => {
    setUploading(true);
    try {
      const media = await pickAndUploadImage({ allowsEditing: false, quality: 0.85 });
      if (!media) return;
      const title = 'Photo · ' + new Date().toLocaleTimeString();
      setPhotos((p) => [{ url: media.url, title, sub: 'Uploaded' }, ...p]);

      if (!currentId) return; // upload-only, no business to persist against yet
      try {
        await api('/api/knowledge', {
          method: 'POST',
          body: { business_id: currentId, kind: 'photo', source_key: media.key, title },
        });
      } catch (e) {
        Alert.alert(
          'Saved locally only',
          e instanceof ApiError && e.status === 401
            ? 'Sign in to save knowledge to this business.'
            : 'Could not attach this photo to your business right now.',
        );
      }
    } finally {
      setUploading(false);
    }
  };
  const inputs = [
    { id: 'photo', label: 'Picture', sub: 'फोटो', d: 'M3 5h18v15H3zM3 16l5-5 5 5 3-3 5 5' },
    { id: 'voice', label: 'Voice note', sub: 'आवाज', d: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11.5a7 7 0 0 0 14 0M12 18.5V22' },
    { id: 'file', label: 'File', sub: 'PDF · Word · Excel', d: 'M6 3h8l5 5v13H6zM14 3v5h5' },
    { id: 'text', label: 'Type it', sub: 'लेख्नुहोस्', d: 'M4 6h16M4 12h11M4 18h16' },
    { id: 'link', label: 'Link / URL', sub: 'Webpage, drive', d: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7L12.5 17.2' },
    { id: 'scan', label: 'Scan', sub: 'Camera स्क्यान', d: 'M3 8V6a3 3 0 0 1 3-3h2M21 8V6a3 3 0 0 0-3-3h-2M3 16v2a3 3 0 0 0 3 3h2M21 16v2a3 3 0 0 1-3 3h-2M3 12h18' },
  ];

  const added: Array<[string, string, string]> = [
    ['IMG', 'Price board photo', 'Read 38 prices'],
    ['0:42', 'Voice note — व्यापारको बारेमा', 'Hours, delivery area'],
    ['XLS', 'products-2083.xlsx', '142 items added'],
    ['PDF', 'Rate-list Baisakh.pdf', '24 prices updated'],
    ['URL', 'shrestha.com.np', 'About + contact synced'],
  ];

  return (
    <AHScreen pad={false}>
      <AHHeader title="Teach aihoni" subtitle="Shrestha Kirana · Lagankhel" back />
      <View style={{ paddingHorizontal: 22, marginBottom: 12 }}>
        <Text
          style={{
            fontFamily: AH_BRAND_FONT,
            fontSize: 14,
            fontWeight: '600',
            marginBottom: 2,
            color: INK,
          }}
        >
          {'व्यापार सिकाउनुहोस्'}
        </Text>
        <Text style={{ fontSize: 13, lineHeight: 18, color: MUTED }}>
          Add from any input — anytime, in any mix.
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 12 }}
      >
        {/* 3×2 input methods grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
          {inputs.map((it) => (
            <Pressable
              key={it.id}
              onPress={it.id === 'photo' ? addPhoto : undefined}
              disabled={it.id === 'photo' && uploading}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                width: '31%',
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: '#EFECEC',
                borderRadius: 14,
                padding: 9,
                paddingHorizontal: 6,
                alignItems: 'center',
                gap: 3,
                opacity: it.id === 'photo' && uploading ? 0.6 : 1,
              })}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  flexShrink: 0,
                  backgroundColor: BG_SOFT,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d={it.d}
                    stroke={INK}
                    strokeWidth={1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
              <Text
                style={{ fontSize: 11.5, marginTop: 1, fontWeight: '500', color: INK, textAlign: 'center' }}
              >
                {it.label}
              </Text>
              <Text
                style={{ fontSize: 9.5, color: MUTED, textAlign: 'center' }}
              >
                {it.sub}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* knowledge so far */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: 13,
            marginBottom: 7,
            marginHorizontal: 2,
          }}
        >
          <Text
            style={{ fontSize: 11.5, color: MUTED, letterSpacing: 0.3, fontWeight: '500' }}
          >
            KNOWLEDGE SO FAR · 5
          </Text>
          <Text style={{ fontSize: 11, color: INK, fontWeight: '500' }}>
            + Add more
          </Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 6 }}>
          {photos.map((p) => (
            <View
              key={p.url}
              style={{
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: '#EFECEC',
                borderRadius: 12,
                padding: 7,
                paddingHorizontal: 11,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Image
                source={{ uri: p.url }}
                style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: BG_SOFT }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: INK }} numberOfLines={1}>
                  {p.title}
                </Text>
                <Text style={{ fontSize: 11, color: MUTED, marginTop: 0.5 }}>{p.sub}</Text>
              </View>
            </View>
          ))}
          {added.map(([tag, title, sub]) => (
            <Pressable
              key={title}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: '#EFECEC',
                borderRadius: 12,
                padding: 7,
                paddingHorizontal: 11,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              })}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  flexShrink: 0,
                  backgroundColor: BG_SOFT,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{ fontSize: 9, fontWeight: '800', color: INK }}
                >
                  {tag}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: '600', color: INK }}
                  numberOfLines={1}
                >
                  {title}
                </Text>
                <Text style={{ fontSize: 11, color: MUTED, marginTop: 0.5 }}>
                  {sub}
                </Text>
              </View>
              <Svg width={12} height={9} viewBox="0 0 12 10">
                <Path
                  d="M1 5l3.2 3.4L11 1"
                  stroke="#2E9E6B"
                  strokeWidth={2.2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ))}
        </View>

        {/* open to everyone toggle */}
        <Pressable
          android_ripple={RIPPLE}
          style={pressedOpacity({
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
            backgroundColor: BG_SOFT,
            borderRadius: 14,
            padding: 10,
            paddingHorizontal: 13,
          })}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: INK }}>
              {'सबैले सोध्न सक्ने · Open to everyone'}
            </Text>
            <Text
              style={{ fontSize: 10.5, color: MUTED, marginTop: 1, lineHeight: 15 }}
            >
              Any user can ask aihoni about your business.
            </Text>
          </View>
          <View
            style={{
              width: 44,
              height: 27,
              borderRadius: 99,
              flexShrink: 0,
              backgroundColor: INK,
              justifyContent: 'center',
              alignItems: 'flex-end',
              paddingRight: 2,
            }}
          >
            <View
              style={{
                width: 23,
                height: 23,
                borderRadius: 11.5,
                backgroundColor: '#fff',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
              }}
            />
          </View>
        </Pressable>

        <View style={{ height: 10 }} />
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 22,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 18),
          gap: 6,
        }}
      >
        <AHButton kind="primary" onClick={nav.back}>
          Save knowledge
        </AHButton>
      </View>
    </AHScreen>
  );
}
