import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHHeader, AHButton, AHCoin, RIPPLE, pressedOpacity } from '../components/ui';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, LINE, LINE2, FAINT, BG_SOFT, mixWithWhite } from '../theme';
import { useNav } from '../nav';
import Svg, { Path } from 'react-native-svg';

interface Pack {
  pts: string;
  price: string;
  bonus?: string;
  popular?: boolean;
}

// 22 · Recharge points — TikTok-style coin packs + Nepali gateways.
export function Recharge() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [pack, setPack] = useState(2);
  const [method, setMethod] = useState('esewa');
  const packs: Pack[] = [
    { pts: '100', price: '100' },
    { pts: '500', price: '500', bonus: '+20' },
    { pts: '1,000', price: '1,000', bonus: '+50', popular: true },
    { pts: '2,500', price: '2,500', bonus: '+200' },
    { pts: '6,000', price: '6,000', bonus: '+600' },
    { pts: '12,000', price: '12,000', bonus: '+1,500' },
  ];

  const methods = [
    { id: 'esewa', name: 'eSewa', sub: '...4821', c: '#5BB12F', g: 'e' },
    { id: 'khalti', name: 'Khalti', sub: 'Wallet', c: '#5C2D91', g: 'K' },
    { id: 'ime', name: 'IME Pay', sub: 'Wallet', c: '#C0392B', g: 'I' },
    { id: 'connectips', name: 'ConnectIPS', sub: 'Bank', c: '#1A6FB5', g: 'C' },
  ];

  const sel = packs[pack];

  return (
    <AHScreen pad={false}>
      <AHHeader
        title="Recharge points"
        back
        right={
          <Pressable onPress={() => {}}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: MUTED }}>
              History
            </Text>
          </Pressable>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* balance card */}
        <View
          style={{
            borderRadius: 20,
            backgroundColor: INK,
            padding: 16,
            paddingHorizontal: 18,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 13,
            overflow: 'hidden',
          }}
        >
          <AHCoin size={38} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>
              Current balance
            </Text>
            <Text
              style={{
                fontSize: 24,
                fontWeight: '800',
                letterSpacing: -0.5,
                marginTop: 1,
                color: '#fff',
              }}
            >
              {'2,480 '}
              <Text style={{ fontSize: 13, fontWeight: '600', color: 'rgba(255,255,255,0.7)' }}>
                pts
              </Text>
            </Text>
          </View>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.16)',
              borderRadius: 99,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: '#fff' }}>
              {'≈ रू 2,480'}
            </Text>
          </View>
        </View>

        {/* pack grid */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: '700',
            color: MUTED,
            marginTop: 16,
            marginBottom: 9,
            marginLeft: 2,
          }}
        >
          Choose a pack
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
          {packs.map((p, i) => {
            const on = i === pack;
            return (
              <Pressable
                key={i}
                onPress={() => setPack(i)}
                android_ripple={RIPPLE}
                style={pressedOpacity({
                  position: 'relative',
                  width: '31%',
                  borderRadius: 16,
                  paddingTop: 14,
                  paddingBottom: 11,
                  paddingHorizontal: 6,
                  backgroundColor: on ? BG_SOFT : '#fff',
                  borderWidth: 2,
                  borderColor: on ? INK : LINE2,
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 5,
                })}
              >
                {p.popular && (
                  <View
                    style={{
                      position: 'absolute',
                      top: -9,
                      alignSelf: 'center',
                      backgroundColor: ACCENT,
                      borderRadius: 99,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <Text
                      style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}
                    >
                      POPULAR
                    </Text>
                  </View>
                )}
                <AHCoin size={26} />
                <Text
                  style={{ fontSize: 15, fontWeight: '800', letterSpacing: -0.3, color: INK }}
                >
                  {p.pts}
                </Text>
                {p.bonus ? (
                  <Text style={{ fontSize: 10, fontWeight: '700', color: ACCENT }}>
                    {p.bonus} bonus
                  </Text>
                ) : (
                  <Text style={{ fontSize: 10, fontWeight: '600', color: FAINT }}>points</Text>
                )}
                <Text style={{ fontSize: 12, fontWeight: '700', color: INK, marginTop: 2 }}>
                  {'रू ' + p.price}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* payment method */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginTop: 16,
            marginBottom: 9,
            marginHorizontal: 2,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: MUTED }}>Pay with</Text>
          <Text style={{ fontSize: 11.5, fontWeight: '600', color: FAINT }}>
            Nepali gateways
          </Text>
        </View>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          {methods.map((m) => {
            const on = m.id === method;
            return (
              <Pressable
                key={m.id}
                onPress={() => setMethod(m.id)}
                android_ripple={RIPPLE}
                style={pressedOpacity({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 9,
                  paddingHorizontal: 13,
                  borderRadius: 14,
                  backgroundColor: '#fff',
                  borderWidth: 2,
                  borderColor: on ? INK : LINE2,
                })}
              >
                <View
                  style={{
                    width: 56,
                    height: 34,
                    borderRadius: 8,
                    flexShrink: 0,
                    backgroundColor: mixWithWhite(m.c, 0.14),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: m.c,
                      fontFamily: AH_BRAND_FONT,
                      fontWeight: '800',
                      fontSize: 18,
                    }}
                  >
                    {m.g}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: INK }}>{m.name}</Text>
                  <Text style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>{m.sub}</Text>
                </View>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    flexShrink: 0,
                    borderWidth: on ? 0 : 2,
                    borderColor: LINE2,
                    backgroundColor: on ? INK : 'transparent',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {on && (
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
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View style={{ height: 14 }} />
      </ScrollView>

      {/* footer pay bar */}
      <View
        style={{
          paddingHorizontal: 18,
          paddingTop: 12,
          paddingBottom: Math.max(insets.bottom, 26),
          borderTopWidth: 1,
          borderTopColor: LINE,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          backgroundColor: '#fff',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11.5, color: MUTED }}>
            {sel.pts}
            {sel.bonus ? ` ${sel.bonus}` : ''} points
          </Text>
          <Text
            style={{ fontSize: 21, fontWeight: '800', letterSpacing: -0.5, color: INK }}
          >
            {'रू ' + sel.price}
          </Text>
        </View>
        <AHButton kind="primary" style={{ paddingHorizontal: 26 }}>
          Recharge now
        </AHButton>
      </View>
    </AHScreen>
  );
}
