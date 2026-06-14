import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHHeader, AHTabBar, RIPPLE, RIPPLE_ICON, pressedOpacity } from '../components/ui';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, LINE, LINE2, mixWithWhite } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface Tile {
  span?: 'tall' | 'wide';
  multi?: boolean;
}

// 20 · Business page — Instagram-style profile + Explore grid.
export function BusinessPage() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [following, setFollowing] = useState(false);
  const stats: Array<[string, string]> = [
    ['142', 'Posts'],
    ['3.4k', 'Followers'],
    ['86', 'Following'],
  ];
  const highlights: Array<[string, string]> = [
    ['नयाँ', ACCENT],
    ['भाउ', '#3A6FE0'],
    ['Offers', '#8B5CF6'],
    ['Combo', '#2E9E6B'],
  ];
  const tiles: Tile[] = [
    { span: 'tall', multi: true },
    {},
    {},
    { span: 'wide' },
    {},
    { multi: true },
    {},
    { span: 'tall' },
    {},
    {},
    {},
  ];

  return (
    <AHScreen pad={false}>
      <AHHeader
        title="Shrestha Kirana Pasal"
        subtitle="@shresthakirana · व्यापार"
        back
        right={
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Circle cx={12} cy={5} r={1.7} fill={INK} />
            <Circle cx={12} cy={12} r={1.7} fill={INK} />
            <Circle cx={12} cy={19} r={1.7} fill={INK} />
          </Svg>
        }
      />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* avatar + stats */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 8,
          }}
        >
          <View
            style={{
              width: 78,
              height: 78,
              borderRadius: 39,
              borderWidth: 2.5,
              borderColor: ACCENT,
              padding: 2.5,
              flexShrink: 0,
            }}
          >
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 39,
                backgroundColor: ACCENT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontFamily: AH_BRAND_FONT,
                  fontWeight: '800',
                  fontSize: 28,
                }}
              >
                प
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            {stats.map(([n, l]) => (
              <View key={l} style={{ alignItems: 'center' }}>
                <Text
                  style={{ fontSize: 18, fontWeight: '800', letterSpacing: -0.3, color: INK }}
                >
                  {n}
                </Text>
                <Text style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* bio */}
        <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: INK }}>
            {'किराना · Grocery'}
          </Text>
          <Text style={{ fontSize: 13, color: INK, lineHeight: 19, marginTop: 2 }}>
            {'दैनिक तरकारी, चामल, दाल, तेल। होम डेलिभरी उपलब्ध।'}
          </Text>
          <Text style={{ fontSize: 12.5, color: ACCENT, fontWeight: '700', marginTop: 3 }}>
            {'📍 Lagankhel · Open 7am–8pm'}
          </Text>
        </View>

        {/* action buttons */}
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
          <Pressable
            onPress={() => setFollowing(!following)}
            android_ripple={following ? RIPPLE : { color: 'rgba(255,255,255,0.25)', borderless: false }}
            style={pressedOpacity({
              flex: 2,
              borderRadius: 99,
              paddingVertical: 11,
              backgroundColor: following ? '#fff' : ACCENT,
              borderWidth: following ? 1.5 : 0,
              borderColor: LINE2,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            })}
          >
            {following && (
              <Svg width={13} height={10} viewBox="0 0 12 10">
                <Path
                  d="M1 5l3.2 3.4L11 1"
                  stroke={INK}
                  strokeWidth={2.2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            )}
            <Text
              style={{
                fontSize: 13.5,
                fontWeight: '800',
                color: following ? INK : '#fff',
              }}
            >
              {following ? 'Following' : '+ Follow'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => nav.go('chatAttach')}
            android_ripple={RIPPLE}
            style={pressedOpacity({
              flex: 1,
              borderRadius: 99,
              paddingVertical: 11,
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: LINE2,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: INK }}>Message</Text>
          </Pressable>
          <Pressable
            android_ripple={RIPPLE}
            style={pressedOpacity({
              width: 44,
              height: 42,
              borderRadius: 99,
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: LINE2,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 5c0-1 1-2 2-2h2l2 4-2 1.5c1 3 3 5 6 6L15.5 13l4 2v2c0 1-1 2-2 2-7.2 0-13-5.8-13-13z"
                stroke={INK}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </View>

        {/* highlights */}
        <View style={{ height: 108 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 14, alignItems: 'center' }}
          >
          {highlights.map(([l, color]) => (
            <View
              key={l}
              style={{ alignItems: 'center', gap: 4 }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: mixWithWhite(color, 0.16),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1.5,
                  borderColor: LINE,
                }}
              >
                <Text
                  style={{
                    color,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: '800',
                    fontSize: 13,
                  }}
                >
                  {l}
                </Text>
              </View>
              <Text style={{ fontSize: 10.5, color: MUTED }}>{l}</Text>
            </View>
          ))}
          </ScrollView>
        </View>

        {/* tab bar inside profile */}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: LINE }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingVertical: 10,
              paddingBottom: 8,
              borderBottomWidth: 2,
              borderBottomColor: ACCENT,
            }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Rect x="3" y="3" width="7" height="7" rx="1.2" stroke={ACCENT} strokeWidth={1.9} />
              <Rect x="14" y="3" width="7" height="7" rx="1.2" stroke={ACCENT} strokeWidth={1.9} />
              <Rect x="3" y="14" width="7" height="7" rx="1.2" stroke={ACCENT} strokeWidth={1.9} />
              <Rect x="14" y="14" width="7" height="7" rx="1.2" stroke={ACCENT} strokeWidth={1.9} />
            </Svg>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10, paddingBottom: 8 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Rect x="3" y="3" width="18" height="18" rx="5" stroke={MUTED} strokeWidth={1.9} />
              <Path d="M10.5 9.2l4.5 2.8-4.5 2.8z" fill={MUTED} />
            </Svg>
          </View>
          <View
            style={{ flex: 1, alignItems: 'center', paddingVertical: 10, paddingBottom: 8 }}
          >
            <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
              <Circle cx={9} cy={9} r={3} stroke={MUTED} strokeWidth={1.9} />
              <Circle cx={16} cy={16} r={4.5} stroke={MUTED} strokeWidth={1.9} />
            </Svg>
          </View>
        </View>

        {/* posts grid — 3 columns with tall/wide spanning */}
        <View style={{ padding: 3, flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
          {tiles.map((p, i) => {
            const isTall = p.span === 'tall';
            const isWide = p.span === 'wide';
            return (
              <View
                key={i}
                style={{
                  position: 'relative',
                  width: isWide ? '65%' : '31%',
                  height: isTall ? 235 : 116,
                  backgroundColor: mixWithWhite(ACCENT, 0.1 + (i % 3) * 0.05),
                }}
              >
                <ImageSlot
                  placeholder=" "
                  style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                />
                {p.multi && (
                  <View
                    style={{ position: 'absolute', top: 5, right: 5 }}
                  >
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Rect x="6" y="3" width="15" height="15" rx="2.5" stroke="#fff" strokeWidth={2} />
                      <Path
                        d="M3 8v11a2 2 0 0 0 2 2h11"
                        stroke="#fff"
                        strokeWidth={2}
                        strokeLinecap="round"
                        fill="none"
                      />
                    </Svg>
                  </View>
                )}
                {(isTall || isWide) && (
                  <View style={{ position: 'absolute', bottom: 5, left: 5 }}>
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      {isTall ? (
                        <Rect x="8" y="3" width="8" height="18" rx="2" stroke="#fff" strokeWidth={2} />
                      ) : (
                        <Rect x="3" y="8" width="18" height="8" rx="2" stroke="#fff" strokeWidth={2} />
                      )}
                    </Svg>
                  </View>
                )}
              </View>
            );
          })}
        </View>
        <View style={{ height: 16 }} />
      </ScrollView>
      <AHTabBar active="feed" />
    </AHScreen>
  );
}
