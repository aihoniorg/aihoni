import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHTabBar, pressedOpacity } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT, INK, ACCENT } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// 18 · Reels — Instagram-style feed with a one-tap order bar.
export function Reels() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const rail: Array<[string, string]> = [
    ['M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z', '1.2k'],
    ['M21 11.5a8 8 0 0 1-11.6 7.1L3 21l1.4-4.4A8 8 0 1 1 21 11.5z', '86'],
    ['M4 12l16-7-7 16-2-7-7-2z', 'Share'],
  ];

  return (
    <AHScreen pad={false} style={{ backgroundColor: '#000', position: 'relative' }}>
      <ImageSlot
        placeholder="Product reel"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
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
          paddingTop: insets.top + 10,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 19, fontWeight: '700', color: '#fff' }}>Reels</Text>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="3" width="18" height="18" rx="5" stroke="#fff" strokeWidth={1.8} />
          <Circle cx={12} cy={12} r={3.4} stroke="#fff" strokeWidth={1.8} />
        </Svg>
      </View>

      <View style={{ flex: 1 }} />

      {/* right rail */}
      <View
        style={{
          position: 'absolute',
          right: 14,
          bottom: 170,
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
        }}
      >
        {rail.map(([d, n], i) => (
          <Pressable
            key={i}
            android_ripple={{ color: 'rgba(255,255,255,0.25)', borderless: true, radius: 24 }}
            hitSlop={6}
            style={pressedOpacity({ alignItems: 'center', gap: 5, padding: 4 }, 0.55)}
          >
            <Svg width={27} height={27} viewBox="0 0 24 24" fill="none">
              <Path
                d={d}
                stroke="#fff"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={{ fontSize: 11.5, fontWeight: '600', color: '#fff' }}>{n}</Text>
          </Pressable>
        ))}
      </View>

      {/* bottom info + order */}
      <View style={{ position: 'relative', paddingHorizontal: 18, paddingBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 }}>
          <Pressable
            onPress={() => nav.go('businessPage')}
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: ACCENT,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#fff',
            }}
          >
            <Text
              style={{ fontFamily: AH_BRAND_FONT, fontWeight: '800', fontSize: 13, color: '#fff' }}
            >
              प
            </Text>
          </Pressable>
          <Text style={{ fontSize: 14.5, fontWeight: '700', color: '#fff' }}>
            Shrestha Kirana Pasal
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.6)',
              borderRadius: 99,
              paddingHorizontal: 11,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Follow</Text>
          </View>
        </View>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: 'rgba(255,255,255,0.95)',
            marginBottom: 14,
            maxWidth: 250,
          }}
        >
          {'नयाँ आएको बासमती चामल 🍚 — २५ केजी बोरा सस्तोमा।'}
        </Text>

        {/* order card */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 11,
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.22)',
            borderRadius: 16,
            padding: 10,
            paddingHorizontal: 12,
          }}
        >
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 11,
              backgroundColor: 'rgba(255,255,255,0.18)',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: 19 }}>🍚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
              {'Basmati चामल · 25kg'}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '800', color: '#fff' }}>
              {'रू 2,350 '}
              <Text
                style={{
                  fontSize: 11.5,
                  fontWeight: '500',
                  color: 'rgba(255,255,255,0.7)',
                  textDecorationLine: 'line-through',
                }}
              >
                {'रू 2,600'}
              </Text>
            </Text>
          </View>
          <Pressable
            onPress={() => nav.go('order')}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
            style={pressedOpacity({
              backgroundColor: INK,
              borderRadius: 99,
              paddingHorizontal: 18,
              paddingVertical: 11,
              flexShrink: 0,
            }, 0.82)}
          >
            <Text style={{ fontSize: 14.5, fontWeight: '700', color: '#fff' }}>Order</Text>
          </Pressable>
        </View>
      </View>
      <AHTabBar active="reels" />
    </AHScreen>
  );
}
