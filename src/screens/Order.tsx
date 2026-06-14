import { View, Text, Pressable } from 'react-native';
import { AHScreen, AHButton } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { INK, ACCENT, MUTED, LINE2, ACCENT_SOFT } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle } from 'react-native-svg';

// 19 · Order from reel — bottom sheet with quantity, delivery, pay-with-eSewa.
export function Order() {
  const nav = useNav();
  return (
    <AHScreen
      pad={false}
      style={{ backgroundColor: '#000', position: 'relative', justifyContent: 'flex-end' }}
    >
      <ImageSlot
        placeholder="Product reel"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      <Pressable
        onPress={nav.back}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
      />

      <View
        style={{
          position: 'relative',
          backgroundColor: '#fff',
          borderTopLeftRadius: 26,
          borderTopRightRadius: 26,
          padding: 12,
          paddingHorizontal: 22,
          paddingBottom: 38,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.3,
          shadowRadius: 40,
          elevation: 10,
        }}
      >
        <View
          style={{
            width: 40,
            height: 5,
            borderRadius: 99,
            backgroundColor: '#E2E2E2',
            alignSelf: 'center',
            marginBottom: 18,
          }}
        />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 15,
              backgroundColor: ACCENT_SOFT,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: 26 }}>🍚</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: INK }}>
              {'Basmati चामल · 25kg'}
            </Text>
            <Text style={{ fontSize: 13, color: MUTED, marginTop: 1 }}>
              {'Shrestha Kirana Pasal · Lagankhel'}
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontWeight: '800', color: ACCENT }}>
            {'रू 2,350'}
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: '600', color: INK }}>Quantity</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              backgroundColor: '#fff',
              borderRadius: 99,
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderWidth: 1.5,
              borderColor: LINE2,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: '600', color: MUTED }}>−</Text>
            <Text
              style={{ fontSize: 16, fontWeight: '700', minWidth: 16, textAlign: 'center', color: INK }}
            >
              1
            </Text>
            <Text style={{ fontSize: 20, fontWeight: '600', color: ACCENT }}>+</Text>
          </View>
        </View>

        <View style={{ marginTop: 16, flexDirection: 'column', gap: 9 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 11,
              borderWidth: 2,
              borderColor: ACCENT,
              backgroundColor: ACCENT_SOFT,
              borderRadius: 16,
              padding: 13,
              paddingHorizontal: 15,
            }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 13h13V6H3zM16 9h4l1 4v3h-5M7 18.5A1.5 1.5 0 1 1 7 15.5a1.5 1.5 0 0 1 0 3zM18 18.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
                stroke={ACCENT}
                strokeWidth={1.7}
                strokeLinejoin="round"
              />
            </Svg>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14.5, fontWeight: '700', color: INK }}>
                {'घर डेलिभरी · Home delivery'}
              </Text>
              <Text style={{ fontSize: 12, color: MUTED }}>
                {'Lagankhel · ~30 min · रू 50'}
              </Text>
            </View>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: ACCENT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width={10} height={8} viewBox="0 0 12 10">
                <Path
                  d="M1 5l3.2 3.4L11 1"
                  stroke="#fff"
                  strokeWidth={2.4}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginVertical: 18,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ fontSize: 14, color: MUTED, fontWeight: '600' }}>Total</Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: INK }}>{'रू 2,400'}</Text>
        </View>
        <AHButton kind="orange">
          {'Order · eSewa बाट तिर्नुहोस्'}
        </AHButton>
      </View>
    </AHScreen>
  );
}
