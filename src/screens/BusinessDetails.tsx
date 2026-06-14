import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHHeader, AHTitle, AHField, AHButton, AHOrb, RIPPLE, pressedOpacity } from '../components/ui';
import { INK, ACCENT, MUTED, FAINT, LINE2 } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

// Map location picker — stylised map + pin
function AHMapPicker() {
  return (
    <View
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: LINE2,
        height: 134,
        position: 'relative',
      }}
    >
      <Svg
        width="100%"
        height="134"
        viewBox="0 0 360 134"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        <Rect x="0" y="0" width="360" height="134" fill="#E8ECE7" />
        <Rect x="198" y="-12" width="150" height="78" rx="12" fill="#D8E7D2" />
        <Rect x="14" y="84" width="104" height="70" rx="10" fill="#E3E8F0" />
        <Rect x="250" y="86" width="120" height="64" rx="10" fill="#E3E8F0" />
        <Path d="M-10 116 q 95 -22 190 2 t 200 -2 V150 H-10 Z" fill="#CFE0EC" />
        <Path d="M0 80 H360" stroke="#FBFCFB" strokeWidth="11" />
        <Path d="M148 -10 V146" stroke="#FBFCFB" strokeWidth="10" />
        <Path d="M-5 26 L365 62" stroke="#FBFCFB" strokeWidth="6" />
        <Path d="M250 -10 L290 146" stroke="#F6DDAC" strokeWidth="6" />
      </Svg>

      {/* Map pin shadow */}
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: '44%',
          width: 9,
          height: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(20,20,25,0.22)',
        }}
      />
      {/* Map pin */}
      <View
        style={{
          position: 'absolute',
          alignSelf: 'center',
          top: '25%',
        }}
      >
        <Svg width={30} height={38} viewBox="0 0 24 32">
          <Path
            d="M12 0C5.4 0 0 5.2 0 11.6 0 20 12 32 12 32s12-12 12-20.4C24 5.2 18.6 0 12 0z"
            fill={ACCENT}
          />
          <Circle cx={12} cy={11.5} r={4.6} fill="#fff" />
        </Svg>
      </View>

      {/* Choose on map button */}
      <View
        style={{
          position: 'absolute',
          left: 12,
          bottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 7,
          backgroundColor: INK,
          borderRadius: 99,
          paddingHorizontal: 14,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
          <Path
            d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"
            stroke="#fff"
            strokeWidth={2}
            strokeLinejoin="round"
          />
          <Circle cx={12} cy={9} r={2.4} fill="#fff" />
        </Svg>
        <Text style={{ color: '#fff', fontSize: 12.5, fontWeight: '700' }}>
          Choose on map
        </Text>
      </View>

      {/* Locate button */}
      <View
        style={{
          position: 'absolute',
          right: 12,
          bottom: 12,
          width: 34,
          height: 34,
          borderRadius: 10,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={17} height={17} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={12} r={3.2} stroke={INK} strokeWidth={2} />
          <Path
            d="M12 2v3M12 19v3M2 12h3M19 12h3"
            stroke={INK}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </View>
    </View>
  );
}

// 08 · Business details — voice-fill + map location.
export function BusinessDetails() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  return (
    <AHScreen pad={false}>
      <AHHeader title="Business details" back />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
      <AHTitle
        np="व्यापारको विवरण"
        en="Where is your business?"
        sub="Say it out loud — aihoni fills in the form for you."
      />

      <Pressable
        android_ripple={{ color: 'rgba(255,255,255,0.18)', borderless: false }}
        style={pressedOpacity({
          borderRadius: 20,
          backgroundColor: INK,
          padding: 16,
          paddingHorizontal: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 24,
          elevation: 8,
          marginBottom: 18,
          overflow: 'hidden',
        }, 0.82)}
      >
        <AHOrb size={48} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15.5, fontWeight: '700', color: '#fff' }}>
            {'बोलेर भर्नुहोस्'}
          </Text>
          <Text
            style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}
          >
            {'"मेरो व्यापार लगनखेलमा छ…"'}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.35)',
            borderRadius: 99,
            paddingHorizontal: 14,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
            Speak
          </Text>
        </View>
      </Pressable>

      <View style={{ flexDirection: 'column', gap: 16 }}>
        <View style={{ flexDirection: 'column', gap: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: MUTED }}>
              Location
            </Text>
            <Text style={{ fontSize: 11.5, fontWeight: '600', color: FAINT }}>
              {'नक्सामा छान्नुहोस्'}
            </Text>
          </View>
          <AHMapPicker />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              marginTop: 1,
            }}
          >
            <Svg width={13} height={16} viewBox="0 0 24 32" style={{ flexShrink: 0 }}>
              <Path
                d="M12 0C5.4 0 0 5.2 0 11.6 0 20 12 32 12 32s12-12 12-20.4C24 5.2 18.6 0 12 0z"
                fill={ACCENT}
              />
              <Circle cx={12} cy={11.5} r={4.3} fill="#fff" />
            </Svg>
            <Text style={{ fontSize: 14.5, fontWeight: '600', color: INK }}>
              Lagankhel, Lalitpur
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: LINE2,
                borderRadius: 12,
                paddingVertical: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: INK, textAlign: 'center' }}>
                <Text style={{ color: MUTED, fontWeight: '500' }}>Lat </Text>
                {'27.6677° N'}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: LINE2,
                borderRadius: 12,
                paddingVertical: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: INK, textAlign: 'center' }}>
                <Text style={{ color: MUTED, fontWeight: '500' }}>Long </Text>
                {'85.3247° E'}
              </Text>
            </View>
          </View>
        </View>
        <AHField label="Business phone" value="01-54XXXXX" />
        <AHField label="What do you sell?" placeholder="e.g. दाल, चामल, तेल, नुन…" />
      </View>
      <View style={{ height: 12 }} />
      </ScrollView>
      <View style={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 18), gap: 6 }}>
        <AHButton kind="primary" onClick={() => nav.go('businessDashboard')}>
          Save business
        </AHButton>
        <AHButton kind="ghost" onClick={() => nav.go('businessDashboard')}>
          Skip for now
        </AHButton>
      </View>
    </AHScreen>
  );
}
