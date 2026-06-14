import { View, Text, Pressable } from 'react-native';
import { AHScreen, AHProgress, AHTitle, AHButton, AHOrb, AHWave, pressedOpacity } from '../components/ui';
import { MUTED, LINE2 } from '../theme';
import { useNav } from '../nav';

// 06 · Voice-first setup.
export function Voice() {
  const nav = useNav();
  return (
    <AHScreen>
      <AHProgress step={4} />
      <AHTitle
        np="बोलेर सोध्नुहोस्"
        en="Just talk to aihoni"
        sub="No typing needed. Press the button, ask in Nepali or English."
      />

      <View style={{ flexDirection: 'column', gap: 10, marginTop: 4 }}>
        <View style={{ alignSelf: 'flex-end', maxWidth: 270 }}>
          <View
            style={{
              backgroundColor: '#1B1B1F',
              borderRadius: 20,
              borderBottomRightRadius: 6,
              padding: 16,
            }}
          >
            <Text
              style={{ color: '#fff', fontSize: 15.5, lineHeight: 22 }}
            >
              {"\"आज तरकारीको भाउ कस्तो छ?\""}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: 'flex-start', maxWidth: 280 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: LINE2,
              borderRadius: 20,
              borderBottomLeftRadius: 6,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 15.5, lineHeight: 22 }}>
              {'नमस्ते सुनिता जी! आजको कालीमाटी थोक भाउ अनुसार…'}
            </Text>
            <AHWave n={10} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <Pressable
          android_ripple={{ color: 'rgba(255,255,255,0.18)', borderless: true, radius: 56 }}
          style={pressedOpacity({ borderRadius: 60 }, 0.85)}
        >
          <AHOrb size={104} />
        </Pressable>
        <Text
          style={{ fontSize: 14, fontWeight: '600', color: MUTED }}
        >
          {'Hold to speak · थिचेर बोल्नुहोस्'}
        </Text>
      </View>

      <AHButton kind="primary" onClick={nav.next}>
        Allow microphone
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        {"I'd rather type ›"}
      </AHButton>
    </AHScreen>
  );
}
