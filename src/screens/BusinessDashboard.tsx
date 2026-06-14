import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHHeader, AHButton, RIPPLE, pressedOpacity } from '../components/ui';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, LINE, LINE2, BG_SOFT, FAINT, mixWithWhite, GREEN } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle } from 'react-native-svg';

interface Service {
  t: string;
  np: string;
  d: string;
  color: string;
  status: string;
  on: boolean;
  ai?: boolean;
  aiLabel?: boolean;
  onPress?: () => void;
}

// AI badge component
function AiBadge({ bg }: { bg: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
        backgroundColor: bg,
        borderRadius: 99,
        paddingHorizontal: 5,
        paddingVertical: 2,
        flexShrink: 0,
      }}
    >
      <Svg width={8} height={8} viewBox="0 0 24 24">
        <Path
          d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z"
          fill="#fff"
        />
      </Svg>
      <Text style={{ fontSize: 8, fontWeight: '800', color: '#fff' }}>AI</Text>
    </View>
  );
}

// 09 · Business dashboard — switch business + connect services.
export function BusinessDashboard() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const businesses: Array<[string, string, boolean, string]> = [
    ['श', 'Shrestha Kirana', true, ACCENT],
    ['दि', 'Didi Fashion', false, '#8B5CF6'],
    ['मे', 'Megha Pharmacy', false, GREEN],
  ];

  const services: Service[] = [
    { t: 'Connect tools', np: 'MCP · POS, stock', d: 'M3 5h18v6H3zM3 14h18v5H3M7 8h.01M7 16.5h.01', color: ACCENT, status: '2 servers', on: true, ai: true },
    { t: 'Teach aihoni', np: '5 sources added', d: 'M12 4l9 4-9 4-9-4 9-4zM5 11v4c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-4', color: ACCENT, status: '5 sources', on: true, aiLabel: true, onPress: () => nav.go('knowledge') },
    { t: 'SMS Gateway', np: 'Sparrow · Go Live', d: 'M4 5h16v11H9l-4 4z', color: GREEN, status: 'Connect', on: false },
    { t: 'Social media', np: 'FB · Insta · TikTok', d: 'M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4', color: '#3A6FE0', status: '3 linked', on: true },
    { t: 'Payments', np: 'eSewa · Khalti', d: 'M3 7h18v12H3zM3 11h18M16 15h2', color: '#D9695A', status: 'Connect', on: false },
  ];

  const smsList: Array<[string, string, string, boolean]> = [
    ['GL', 'Go Live', '#E8572F', true],
    ['AK', 'Akash SMS', '#3A6FE0', false],
    ['SP', 'Sparrow SMS', GREEN, false],
  ];

  return (
    <AHScreen pad={false} style={{ backgroundColor: BG_SOFT }}>
      <AHHeader
        title="Business"
        back
        bg={BG_SOFT}
        right={
          <Pressable onPress={() => nav.go('businessPage')}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                stroke={INK}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
              <Circle cx={12} cy={12} r={3} stroke={INK} strokeWidth={1.8} />
            </Svg>
          </Pressable>
        }
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingTop: 4,
          paddingBottom: 8,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* identity + quick-switch */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 15,
              backgroundColor: ACCENT,
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontFamily: AH_BRAND_FONT,
                fontWeight: '700',
                fontSize: 22,
              }}
            >
              {'श'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                style={{ fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: INK }}
                numberOfLines={1}
              >
                Shrestha Kirana
              </Text>
              <Svg width={13} height={13} viewBox="0 0 24 24">
                <Path
                  d="M6 9l6 6 6-6"
                  stroke={MUTED}
                  strokeWidth={2.4}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <Text style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>
              {'किराना · Grocery · Lagankhel'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {businesses
              .filter(([, , active]) => !active)
              .map(([g, , , c], i) => (
                <View
                  key={i}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 17,
                    backgroundColor: c,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2,
                    borderColor: BG_SOFT,
                    marginLeft: i === 0 ? 8 : -8,
                  }}
                >
                  <Text
                    style={{
                      color: '#fff',
                      fontFamily: AH_BRAND_FONT,
                      fontWeight: '700',
                      fontSize: 13,
                    }}
                  >
                    {g}
                  </Text>
                </View>
              ))}
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderStyle: 'dashed',
                borderColor: LINE2,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: -8,
              }}
            >
              <Svg width={14} height={14} viewBox="0 0 24 24">
                <Path
                  d="M12 5v14M5 12h14"
                  stroke={MUTED}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </View>
        </View>

        {/* setup progress hero */}
        <View
          style={{
            marginTop: 14,
            borderRadius: 20,
            backgroundColor: INK,
            padding: 16,
            paddingHorizontal: 17,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: '700',
                  letterSpacing: 0.7,
                  color: 'rgba(255,255,255,0.55)',
                  textTransform: 'uppercase',
                }}
              >
                {'Setup · सेटअप'}
              </Text>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '700',
                  letterSpacing: -0.3,
                  marginTop: 4,
                  lineHeight: 21,
                  color: '#fff',
                }}
              >
                Connect 3 more to go live
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
              <Text>
                <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff' }}>50</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: 'rgba(255,255,255,0.6)' }}>%</Text>
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 5, marginTop: 14 }}>
            {services.map((s, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 6,
                  borderRadius: 99,
                  backgroundColor: s.on ? ACCENT : 'rgba(255,255,255,0.16)',
                }}
              />
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 10,
            }}
          >
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: GREEN,
              }}
            />
            <Text
              style={{ fontSize: 11.5, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}
            >
              {'3 of 6 connected · 5 sources taught'}
            </Text>
          </View>
        </View>

        {/* connections header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginVertical: 17,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: MUTED }}>
            Connections
          </Text>
          <Text style={{ fontSize: 11.5, fontWeight: '600', color: FAINT }}>
            {'जडानहरू'}
          </Text>
        </View>

        {/* connections grid — 2 columns */}
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}
        >
          {services.map((s) => {
            const live = s.on;
            const isConnect = s.status === 'Connect';
            const iconBg = mixWithWhite(s.color, 0.13);
            return (
              <Pressable
                key={s.t}
                onPress={s.onPress}
                android_ripple={RIPPLE}
                style={pressedOpacity({
                  width: '48%',
                  backgroundColor: '#fff',
                  borderWidth: 1.5,
                  borderColor: live ? '#C5E0D3' : LINE,
                  borderRadius: 16,
                  padding: 12,
                  paddingBottom: 11,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                })}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    flexShrink: 0,
                    backgroundColor: iconBg,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Svg width={19} height={19} viewBox="0 0 24 24" fill="none">
                    <Path
                      d={s.d}
                      stroke={s.color}
                      strokeWidth={1.9}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', letterSpacing: -0.2, color: INK }}>
                      {s.t}
                    </Text>
                    {s.ai && <AiBadge bg={ACCENT} />}
                    {s.aiLabel && <AiBadge bg={ACCENT} />}
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: live ? GREEN : isConnect ? FAINT : MUTED,
                      marginTop: 2,
                      fontWeight: '600',
                    }}
                  >
                    {live ? '● ' + s.status : s.status}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* SMS providers header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginVertical: 17,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: MUTED }}>
            SMS providers
          </Text>
          <Text style={{ fontSize: 11.5, fontWeight: '600', color: FAINT }}>
            {'OTP · alerts'}
          </Text>
        </View>

        <View style={{ marginHorizontal: -18, height: 100 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, gap: 9, alignItems: 'flex-start' }}
          >
          {smsList.map(([g, name, c, on]) => (
            <Pressable
              key={name}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                width: 132,
                backgroundColor: '#fff',
                borderWidth: on ? 2 : 1.5,
                borderColor: on ? INK : LINE2,
                borderRadius: 14,
                padding: 11,
                paddingHorizontal: 12,
              })}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    backgroundColor: mixWithWhite(c, 0.14),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: c,
                      fontFamily: AH_BRAND_FONT,
                      fontWeight: '800',
                      fontSize: 12.5,
                    }}
                  >
                    {g}
                  </Text>
                </View>
                {on ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <View
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: GREEN,
                      }}
                    />
                    <Text style={{ fontSize: 10.5, fontWeight: '700', color: GREEN }}>
                      Live
                    </Text>
                  </View>
                ) : (
                  <Text style={{ fontSize: 10.5, fontWeight: '700', color: FAINT }}>
                    Connect
                  </Text>
                )}
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', marginTop: 9, color: INK }}>
                {name}
              </Text>
              <Text style={{ fontSize: 10.5, color: MUTED, marginTop: 1 }}>
                {'API key · test SMS'}
              </Text>
            </Pressable>
          ))}
          </ScrollView>
        </View>

        <View style={{ height: Math.max(insets.bottom, 16) }} />
      </ScrollView>
    </AHScreen>
  );
}
