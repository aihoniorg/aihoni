import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHChatInput, AHOrb, RIPPLE, pressedOpacity } from '../components/ui';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, FAINT, LINE, LINE2, BG_SOFT, ACCENT_SOFT } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// 15 · Chat with aihoni — voice-ask hero + conversation + contextual actions.
export function Chat() {
  const nav = useNav();
  const insets = useSafeAreaInsets();

  const dbl = (col = 'rgba(255,255,255,0.85)') => (
    <Svg width={14} height={8} viewBox="0 0 16 10" style={{ flexShrink: 0 }}>
      <Path
        d="M1 5l3 3.4L9.5 2"
        stroke={col}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 5l3 3.4L15.5 2"
        stroke={col}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const actions = [
    { id: 'order', label: 'Order', active: true, d: 'M3 5h2l2 11h10l2-8H6M9 20.5A1.3 1.3 0 1 0 9 18a1.3 1.3 0 0 0 0 2.5zM17 20.5a1.3 1.3 0 1 0 0-2.5 1.3 1.3 0 0 0 0 2.5z' },
    { id: 'booking', label: 'Booking', d: 'M4 6h16v15H4zM4 11h16M9 4v4M15 4v4' },
    { id: 'appt', label: 'Appoint', d: 'M12 8v4l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z' },
    { id: 'call', label: 'Call', d: 'M4 5c0-1 1-2 2-2h2l2 4-2 1.5c1 3 3 5 6 6L15.5 13l4 2v2c0 1-1 2-2 2-7.2 0-13-5.8-13-13z' },
    { id: 'msg', label: 'Message', d: 'M21 11.5a8 8 0 0 1-11.6 7.1L3 21l1.4-4.4A8 8 0 1 1 21 11.5z' },
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
        <View style={{ flexShrink: 0 }}>
          <AHOrb size={42} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: AH_BRAND_FONT,
              fontSize: 17.5,
              fontWeight: '800',
              lineHeight: 20,
              color: INK,
            }}
          >
            {'aihoni'}
            <Text style={{ color: ACCENT }}>{'.'}</Text>
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              marginTop: 3,
            }}
          >
            <View
              style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT }}
            />
            <Text style={{ fontSize: 11.5, color: ACCENT, fontWeight: '700' }}>
              {'सबै पसल · Any business'}
            </Text>
          </View>
        </View>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path d="M11 5h2v14h-2zM5 9h2v6H5zM17 9h2v6h-2z" fill={INK} />
        </Svg>
        <Svg width={20} height={20} viewBox="0 0 24 24">
          <Circle cx={12} cy={5} r={1.7} fill={INK} />
          <Circle cx={12} cy={12} r={1.7} fill={INK} />
          <Circle cx={12} cy={19} r={1.7} fill={INK} />
        </Svg>
      </View>

      {/* voice-ask hero */}
      <Pressable
        android_ripple={{ color: 'rgba(255,255,255,0.18)', borderless: false }}
        style={pressedOpacity({
          marginHorizontal: 16,
          marginTop: 10,
          borderRadius: 22,
          backgroundColor: INK,
          padding: 14,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          overflow: 'hidden',
        }, 0.82)}
      >
        <AHOrb size={46} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '700', color: '#fff' }}>
            {'केहि सोध्नुहोस्…'}
          </Text>
          <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>
            {'Hold to speak · or type'}
          </Text>
        </View>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: 'rgba(255,255,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
            <Path
              d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>
      </Pressable>

      {/* messages */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#FFFFFF' }}
        contentContainerStyle={{
          padding: 12,
          paddingHorizontal: 16,
          paddingBottom: 8,
          gap: 9,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* AI bubble */}
        <View
          style={{
            alignSelf: 'flex-start',
            maxWidth: 280,
            backgroundColor: '#fff',
            borderRadius: 20,
            borderBottomLeftRadius: 6,
            padding: 10,
            paddingHorizontal: 15,
            paddingBottom: 7,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 14.5, lineHeight: 20, color: INK }}>
            {'नमस्ते Sunita! आज के सोध्न चाहनुहुन्छ?'}
          </Text>
          <View style={{ alignItems: 'flex-end', marginTop: 3 }}>
            <Text style={{ fontSize: 10.5, color: MUTED }}>10:12</Text>
          </View>
        </View>

        {/* user bubble */}
        <View style={{ alignSelf: 'flex-end', maxWidth: 270 }}>
          <View
            style={{
              backgroundColor: INK,
              borderRadius: 20,
              borderBottomRightRadius: 6,
              padding: 9,
              paddingHorizontal: 14,
              paddingBottom: 7,
            }}
          >
            <Text style={{ fontSize: 14.5, lineHeight: 20, color: '#fff' }}>
              {'Shrestha Kirana मा बासमती चामल छ?'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                gap: 5,
                marginTop: 3,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)' }}>
                10:14
              </Text>
              {dbl()}
            </View>
          </View>
        </View>

        {/* AI response */}
        <View style={{ alignSelf: 'flex-start', maxWidth: 295 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 20,
              borderBottomLeftRadius: 6,
              padding: 10,
              paddingHorizontal: 15,
              paddingBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.18,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text style={{ fontSize: 14.5, lineHeight: 21 }}>
              {'हो! '}
              <Text style={{ fontWeight: '700' }}>{'बासमती चामल · २५ केजी'}</Text>
              {' — रू 2,350 मा उपलब्ध छ। डेलिभरी पनि हुन्छ।'}
            </Text>
            <View style={{ alignItems: 'flex-end', marginTop: 2 }}>
              <Text style={{ fontSize: 10.5, color: MUTED }}>10:14</Text>
            </View>
          </View>
        </View>

        {/* contextual quick actions */}
        <View style={{ alignSelf: 'flex-start', maxWidth: 300 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginBottom: 6,
              marginLeft: 2,
            }}
          >
            <View
              style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT }}
            />
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: '700',
                color: MUTED,
                letterSpacing: 0.2,
              }}
            >
              {'यो व्यापारको लागि · suggested'}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 7, flexWrap: 'wrap' }}>
            {actions.map((a) => (
              <Pressable
                key={a.id}
                onPress={a.id === 'order' ? () => nav.go('order') : undefined}
                android_ripple={RIPPLE}
                style={pressedOpacity({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  borderRadius: 99,
                  backgroundColor: a.active ? INK : '#fff',
                  borderWidth: 1.5,
                  borderColor: a.active ? INK : LINE2,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: a.active ? 6 : 2 },
                  shadowOpacity: a.active ? 0.35 : 0.15,
                  shadowRadius: a.active ? 14 : 6,
                  elevation: a.active ? 4 : 1,
                })}
              >
                <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                  <Path
                    d={a.d}
                    stroke={a.active ? '#fff' : INK}
                    strokeWidth={1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text
                  style={{
                    fontSize: 12.5,
                    fontWeight: '700',
                    color: a.active ? '#fff' : INK,
                  }}
                >
                  {a.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* inline order form */}
        <View
          style={{
            alignSelf: 'flex-start',
            width: 290,
            backgroundColor: '#fff',
            borderRadius: 18,
            padding: 13,
            paddingHorizontal: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 22,
            elevation: 5,
            borderWidth: 1,
            borderColor: LINE,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginBottom: 11,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 9,
                backgroundColor: ACCENT_SOFT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M3 5h2l2 11h10l2-8H6M9 20.5A1.3 1.3 0 1 0 9 18a1.3 1.3 0 0 0 0 2.5zM17 20.5a1.3 1.3 0 1 0 0-2.5 1.3 1.3 0 0 0 0 2.5z"
                  stroke={ACCENT}
                  strokeWidth={1.9}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: INK }}>
                {'अर्डर · Order'}
              </Text>
              <Text style={{ fontSize: 11, color: MUTED }}>{'बासमती चामल · 25kg'}</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '800', color: ACCENT }}>
              {'रू 2,350'}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 9,
            }}
          >
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: MUTED }}>
              Quantity
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 14,
                backgroundColor: BG_SOFT,
                borderRadius: 99,
                paddingHorizontal: 14,
                paddingVertical: 5,
              }}
            >
              <Text style={{ fontSize: 17, fontWeight: '700', color: MUTED }}>−</Text>
              <Text style={{ fontSize: 14, fontWeight: '800', minWidth: 14, textAlign: 'center', color: INK }}>
                1
              </Text>
              <Text style={{ fontSize: 17, fontWeight: '700', color: ACCENT }}>+</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: ACCENT_SOFT,
              borderRadius: 12,
              padding: 8,
              paddingHorizontal: 11,
              marginBottom: 11,
            }}
          >
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <Path
                d="M3 13h13V6H3zM16 9h4l1 4v3h-5"
                stroke={ACCENT}
                strokeWidth={1.7}
                strokeLinejoin="round"
              />
              <Circle cx={7} cy={17} r={1.5} stroke={ACCENT} strokeWidth={1.6} />
              <Circle cx={18} cy={17} r={1.5} stroke={ACCENT} strokeWidth={1.6} />
            </Svg>
            <Text style={{ flex: 1, fontSize: 12.5, fontWeight: '600', color: INK }}>
              {'घर डेलिभरी · Lagankhel'}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: ACCENT }}>{'रू 50'}</Text>
          </View>
          <Pressable
            onPress={() => nav.go('order')}
            android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
            style={pressedOpacity({
              height: 42,
              borderRadius: 99,
              backgroundColor: INK,
              alignItems: 'center',
              justifyContent: 'center',
            }, 0.82)}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
              {'Confirm order · रू 2,400'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <AHChatInput placeholder="Type or speak…" />
    </AHScreen>
  );
}
