import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHChatInput } from '../components/ui';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, LINE, LINE2, BG_SOFT, mixWithWhite } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle } from 'react-native-svg';

interface Msg {
  from?: string;
  g?: string;
  c?: string;
  text?: string;
  time: string;
  self?: boolean;
  read?: boolean;
  file?: boolean;
  fileName?: string;
  fileSize?: string;
}

// 14 · Group chat — multi-sender bubbles + stacked member avatars.
export function GroupChat() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const members = [
    { g: 'रा', c: '#7AAD6A' },
    { g: 'सी', c: '#D9695A' },
    { g: 'अ', c: '#5C7AA8' },
    { g: 'लि', c: '#B07A4A' },
  ];
  const messages: Msg[] = [
    { from: 'Ram', g: 'रा', c: '#7AAD6A', text: 'भोलि बैठक छ! सबैजना आउनुस् है।', time: '10:02' },
    { from: 'Sita', g: 'सी', c: '#D9695A', text: 'हुन्छ, म आउँछु 👍', time: '10:04' },
    { from: 'Alex', g: 'अ', c: '#5C7AA8', text: 'Time confirm garnu paryo, kati baje?', time: '10:05' },
    { from: 'Ram', g: 'रा', c: '#7AAD6A', text: 'बिहान ११ बजे — Lagankhel Office', time: '10:07' },
    { self: true, text: 'Okay! म पनि हुन्छु। 🙏', time: '10:09', read: true },
    { from: 'Liam', g: 'लि', c: '#B07A4A', text: 'Can someone share the agenda doc?', time: '10:11' },
    { self: true, text: 'Sending now →', time: '10:12', read: true },
    { self: true, file: true, fileName: 'meeting-agenda.pdf', fileSize: '1.2 MB', time: '10:12', read: true },
  ];

  const dbl = (
    <Svg width={14} height={8} viewBox="0 0 16 10">
      <Path
        d="M1 5l3 3.4L9.5 2"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 5l3 3.4L15.5 2"
        stroke="rgba(255,255,255,0.8)"
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <AHScreen pad={false}>
      {/* header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 18,
          paddingBottom: 10,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: LINE,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
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
          <View style={{ flexDirection: 'row', marginRight: -8 }}>
            {members.map((m, i) => (
              <View
                key={i}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  flexShrink: 0,
                  backgroundColor: mixWithWhite(m.c, 0.24),
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 2,
                  borderColor: '#fff',
                  marginLeft: i === 0 ? 0 : -10,
                  zIndex: 4 - i,
                }}
              >
                <Text
                  style={{
                    color: m.c,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: '800',
                    fontSize: 11.5,
                  }}
                >
                  {m.g}
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', letterSpacing: -0.2, color: INK }}>
              {'Lagankhel व्यापारी'}
            </Text>
            <Text style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>
              {'8 members · Tap to view'}
            </Text>
          </View>
          <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={5} r={1.7} fill={INK} />
            <Circle cx={12} cy={12} r={1.7} fill={INK} />
            <Circle cx={12} cy={19} r={1.7} fill={INK} />
          </Svg>
        </View>
      </View>

      {/* messages */}
      <ScrollView
        style={{ flex: 1, backgroundColor: '#F8F8F8' }}
        contentContainerStyle={{
          padding: 14,
          paddingBottom: 8,
          gap: 10,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignSelf: 'center',
            backgroundColor: '#fff',
            borderRadius: 99,
            paddingHorizontal: 13,
            paddingVertical: 4,
            borderWidth: 1,
            borderColor: LINE,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '700', color: MUTED }}>Today</Text>
        </View>

        {messages.map((m, i) =>
          m.self ? (
            <View
              key={i}
              style={{
                alignSelf: 'flex-end',
                maxWidth: 270,
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: 2,
              }}
            >
              {m.file ? (
                <View
                  style={{
                    backgroundColor: INK,
                    borderRadius: 18,
                    borderBottomRightRadius: 4,
                    padding: 10,
                    paddingHorizontal: 13,
                    paddingBottom: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 9,
                        backgroundColor: 'rgba(255,255,255,0.14)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 4v11M7 11l5 5 5-5M5 20h14"
                          stroke="#fff"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </View>
                    <View>
                      <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#fff' }}>
                        {m.fileName}
                      </Text>
                      <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>
                        {m.fileSize}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      gap: 5,
                      marginTop: 7,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}>
                      {m.time}
                    </Text>
                    {dbl}
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: INK,
                    borderRadius: 18,
                    borderBottomRightRadius: 4,
                    padding: 10,
                    paddingHorizontal: 14,
                    paddingBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 14.5, lineHeight: 20, color: '#fff' }}>
                    {m.text}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      gap: 5,
                      marginTop: 4,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.75)' }}>
                      {m.time}
                    </Text>
                    {dbl}
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View
              key={i}
              style={{
                alignSelf: 'flex-start',
                maxWidth: 285,
                flexDirection: 'row',
                gap: 8,
                alignItems: 'flex-end',
              }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  flexShrink: 0,
                  backgroundColor: mixWithWhite(m.c!, 0.22),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: m.c,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: '800',
                    fontSize: 11,
                  }}
                >
                  {m.g}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: m.c,
                    marginBottom: 4,
                    marginLeft: 2,
                  }}
                >
                  {m.from}
                </Text>
                <View
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: 18,
                    borderBottomLeftRadius: 4,
                    padding: 10,
                    paddingHorizontal: 14,
                    paddingBottom: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 6,
                    elevation: 2,
                  }}
                >
                  <Text style={{ fontSize: 14.5, lineHeight: 20, color: INK }}>
                    {m.text}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10.5,
                      color: MUTED,
                      textAlign: 'right',
                      marginTop: 4,
                    }}
                  >
                    {m.time}
                  </Text>
                </View>
              </View>
            </View>
          ),
        )}
      </ScrollView>

      <AHChatInput placeholder="Message group…" />
    </AHScreen>
  );
}
