import { useState } from 'react';
import { View, Text, Pressable, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, pressedOpacity } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT, ACCENT } from '../theme';
import { useNav } from '../nav';
import { pickAndUploadImage } from '../imageUpload';
import { api, ApiError } from '../apiClient';
import { useBusiness } from '../business';
import Svg, { Path } from 'react-native-svg';

// 13 · Snap camera — full-bleed viewfinder, AI lenses, mode strip, shutter.
export function Snap() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const { currentId } = useBusiness();
  const [mode, setMode] = useState('Snap');
  const [lastShot, setLastShot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const modes = ['Story', 'Snap', 'Reel', 'Live'];

  const capture = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const media = await pickAndUploadImage({ quality: 0.9 });
      if (!media) return;
      setLastShot(media.url);
      try {
        await api('/api/posts', {
          method: 'POST',
          body: { image_keys: [media.key], business_id: currentId },
        });
        Alert.alert('Posted', 'Snap uploaded to your feed.');
      } catch (e) {
        Alert.alert(
          'Uploaded but not posted',
          e instanceof ApiError && e.status === 401
            ? 'Sign in to publish posts.'
            : String((e as Error).message ?? e),
        );
      }
    } finally {
      setBusy(false);
    }
  };
  const lenses = ['✨', '🌸', '🎭', '🌈', '🤖', '🔥'];

  const tools: Array<[string, string]> = [
    ['Flip', 'M20 7H4M4 7l4-4M4 7l4 4M4 17h16M16 17l4-4M16 17l4 4'],
    ['Timer', 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'],
    ['Grid', 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    ['AR', 'M2 12L12 2l10 10-10 10-10-10zM12 7v5l3 3'],
  ];
  const topIconPaths = [
    'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
    'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  ];

  return (
    <AHScreen pad={false} style={{ backgroundColor: '#111', position: 'relative', overflow: 'hidden' }}>
      {lastShot ? (
        <Image
          source={{ uri: lastShot }}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          resizeMode="cover"
        />
      ) : (
        <ImageSlot
          placeholder="Camera preview"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      )}

      {/* gradient overlay */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}
      />

      {/* top bar */}
      <View
        style={{
          position: 'relative',
          paddingTop: insets.top + 14,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={nav.back}
          android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 20 }}
          style={pressedOpacity({
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.28)',
            alignItems: 'center',
            justifyContent: 'center',
          }, 0.55)}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 6l-6 6 6 6"
              stroke="#fff"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
        <Text
          style={{
            fontFamily: AH_BRAND_FONT,
            fontWeight: '800',
            fontSize: 17,
            color: '#fff',
            letterSpacing: 0.4,
          }}
        >
          {'aihoni'}
          <Text style={{ color: ACCENT }}>{'.'}</Text>
        </Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {topIconPaths.map((d, i) => (
            <Pressable
              key={i}
              android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 20 }}
              style={pressedOpacity({
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: 'rgba(0,0,0,0.28)',
                alignItems: 'center',
                justifyContent: 'center',
              }, 0.55)}
            >
              <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                <Path
                  d={d}
                  stroke="#fff"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ))}
        </View>
      </View>

      {/* right tool strip */}
      <View
        style={{
          position: 'absolute',
          right: 14,
          top: '40%',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {tools.map(([label, d]) => (
          <Pressable
            key={label}
            android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 22 }}
            style={pressedOpacity({ alignItems: 'center', gap: 4 }, 0.55)}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: 'rgba(0,0,0,0.35)',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d={d}
                  stroke="#fff"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={{ fontSize: 9.5, fontWeight: '600', color: 'rgba(255,255,255,0.75)' }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flex: 1 }} />

      {/* AI lens row */}
      <View style={{ position: 'relative', paddingHorizontal: 18, paddingBottom: 14 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '700' }}>
            AI Lenses
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>See all</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {lenses.map((l, i) => (
            <Pressable
              key={i}
              android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 26 }}
              style={pressedOpacity({
                width: 50,
                height: 50,
                borderRadius: 25,
                flexShrink: 0,
                backgroundColor: i === 0 ? ACCENT : 'rgba(255,255,255,0.15)',
                borderWidth: i === 0 ? 2 : 1.5,
                borderColor: i === 0 ? '#fff' : 'rgba(255,255,255,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
              }, 0.6)}
            >
              <Text style={{ fontSize: 22 }}>{l}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* mode strip */}
      <View
        style={{
          position: 'relative',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 20,
          marginBottom: 18,
          paddingHorizontal: 18,
        }}
      >
        {modes.map((m) => (
          <Pressable
            key={m}
            onPress={() => setMode(m)}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: true, radius: 20 }}
            hitSlop={8}
            style={pressedOpacity({ alignItems: 'center', gap: 5, paddingHorizontal: 4 }, 0.55)}
          >
            <Text
              style={{
                fontSize: 13.5,
                fontWeight: '700',
                color: m === mode ? '#fff' : 'rgba(255,255,255,0.5)',
              }}
            >
              {m}
            </Text>
            {m === mode && (
              <View
                style={{
                  width: 20,
                  height: 3,
                  borderRadius: 99,
                  backgroundColor: ACCENT,
                }}
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* shutter row */}
      <View
        style={{
          position: 'relative',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingHorizontal: 28,
          paddingBottom: Math.max(insets.bottom, 22),
        }}
      >
        <Pressable
          onPress={capture}
          disabled={busy}
          android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 24 }}
          style={pressedOpacity({
            width: 48,
            height: 48,
            borderRadius: 14,
            overflow: 'hidden',
            borderWidth: 2.5,
            borderColor: 'rgba(255,255,255,0.7)',
            flexShrink: 0,
          }, 0.55)}
        >
          {lastShot ? (
            <Image source={{ uri: lastShot }} style={{ width: '100%', height: '100%' }} />
          ) : (
            <ImageSlot placeholder=" " style={{ width: '100%', height: '100%' }} />
          )}
        </Pressable>
        <Pressable
          onPress={capture}
          disabled={busy}
          android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 42 }}
          style={pressedOpacity({
            width: 82,
            height: 82,
            borderRadius: 41,
            borderWidth: 4,
            borderColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: busy ? 0.6 : 1,
          }, 0.8)}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor:
                mode === 'Live' ? '#E03030' : mode === 'Reel' ? ACCENT : '#fff',
            }}
          />
        </Pressable>
        <Pressable
          android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 22 }}
          style={pressedOpacity({
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: 'rgba(0,0,0,0.35)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }, 0.55)}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
              d="M20 7H4M4 7l4-4M4 7l4 4M4 17h16M16 17l4-4M16 17l4 4"
              stroke="#fff"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </Pressable>
      </View>
    </AHScreen>
  );
}
