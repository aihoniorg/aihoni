import { ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { AHScreen, AHProgress, AHTitle, AHButton } from '../components/ui';
import { INK, ACCENT, MUTED, LINE2, BG_SOFT, FAINT } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

interface Tool {
  id: string;
  name: string;
  why: string;
  glyph: ReactNode;
  state: 'connected' | 'idle';
  who?: string;
}

// 05 · Connect your tools — Drive / Gmail / Calendar / Contacts / Photos / WhatsApp.
export function Connect() {
  const nav = useNav();

  const tools: Tool[] = [
    {
      id: 'drive',
      name: 'Google Drive',
      why: 'Reads your price lists so aihoni quotes the right rate',
      glyph: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 4h6l6 10-3 6H6L0 14z"
            transform="translate(1.5 1)"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      ),
      state: 'connected',
      who: 'sunita@gmail.com',
    },
    {
      id: 'gmail',
      name: 'Gmail',
      why: 'Drafts replies to customers so you never retype',
      glyph: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="5" width="18" height="14" rx={2.5} stroke={INK} strokeWidth={1.8} fill="none" />
          <Path
            d="M3 7l9 7 9-7"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      ),
      state: 'idle',
    },
    {
      id: 'cal',
      name: 'Calendar',
      why: 'Books appointments & blocks slots automatically',
      glyph: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Rect x="3.5" y="5" width="17" height="15" rx={3} stroke={INK} strokeWidth={1.8} fill="none" />
          <Path
            d="M3.5 10h17M8 3v4M16 3v4"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      ),
      state: 'idle',
    },
    {
      id: 'contacts',
      name: 'Contacts',
      why: 'Knows every customer the moment they message',
      glyph: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Circle cx={12} cy={9} r={3.5} stroke={INK} strokeWidth={1.8} />
          <Path
            d="M5 20a7 7 0 0 1 14 0"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        </Svg>
      ),
      state: 'idle',
    },
    {
      id: 'photos',
      name: 'Photos',
      why: 'Turns product shots & receipts into listings',
      glyph: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Rect x="3" y="4" width="18" height="16" rx={3} stroke={INK} strokeWidth={1.8} fill="none" />
          <Circle cx={9} cy={10} r={2} stroke={INK} strokeWidth={1.8} />
          <Path
            d="M21 16l-5-5-9 9"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      ),
      state: 'idle',
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Business',
      why: 'Pulls every customer chat into one inbox',
      glyph: (
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M21 11.5c0 5-4 9-9 9-1.5 0-3-.4-4.2-1L3 21l1.5-4.8C3.6 15 3 13.3 3 11.5 3 6.5 7 2.5 12 2.5s9 4 9 9z"
            stroke={INK}
            strokeWidth={1.8}
            strokeLinejoin="round"
          />
        </Svg>
      ),
      state: 'idle',
    },
  ];

  const whyItems: Array<[string, string]> = [
    ['Auto-fill orders & bookings', 'No retyping — aihoni reads your Calendar & Contacts'],
    ['Faster, sharper answers', 'It already knows your files, emails & products'],
    ['Reply to customers in one place', 'WhatsApp & Gmail summarised for you'],
  ];

  return (
    <AHScreen>
      <AHProgress step={3} />
      <AHTitle
        np="जोड्नुहोस् आफ्ना टूलहरू"
        en="Connect your tools"
        sub="aihoni can read what you allow — nothing more. Add now or later from Profile."
      />

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ flexDirection: 'column', gap: 9 }}>
          {tools.map((t) => (
            <View
              key={t.id}
              style={{
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: LINE2,
                borderRadius: 16,
                padding: 12,
                paddingHorizontal: 14,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  flexShrink: 0,
                  backgroundColor: BG_SOFT,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {t.glyph}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: INK }}>
                  {t.name}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 5,
                    alignItems: 'flex-start',
                    marginTop: 3,
                  }}
                >
                  <Svg
                    width={13}
                    height={13}
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1.5 }}
                  >
                    <Path
                      d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z"
                      fill={ACCENT}
                    />
                  </Svg>
                  <Text
                    style={{
                      fontSize: 11.5,
                      lineHeight: 16,
                      color: ACCENT,
                      fontWeight: '600',
                    }}
                  >
                    {t.why}
                  </Text>
                </View>
                {t.who ? (
                  <Text style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>
                    {t.who}
                  </Text>
                ) : null}
              </View>
              {t.state === 'connected' ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    backgroundColor: '#E8F5ED',
                    borderRadius: 99,
                    paddingHorizontal: 11,
                    paddingVertical: 6,
                  }}
                >
                  <Svg width={11} height={9} viewBox="0 0 12 10">
                    <Path
                      d="M1 5l3.2 3.4L11 1"
                      stroke="#1A8F4C"
                      strokeWidth={2.4}
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                  <Text
                    style={{ fontSize: 12, fontWeight: '700', color: '#1A8F4C' }}
                  >
                    Connected
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: BG_SOFT,
                    borderRadius: 99,
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                  }}
                >
                  <Text
                    style={{ fontSize: 12.5, fontWeight: '600', color: INK }}
                  >
                    Connect
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View
          style={{
            marginTop: 14,
            backgroundColor: BG_SOFT,
            borderRadius: 16,
            padding: 15,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginBottom: 9,
            }}
          >
            <Svg width={15} height={15} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z"
                fill={ACCENT}
              />
            </Svg>
            <Text style={{ fontSize: 12.5, fontWeight: '800', color: INK }}>
              Why connect?
            </Text>
          </View>
          {whyItems.map(([t, s]) => (
            <View
              key={t}
              style={{
                flexDirection: 'row',
                gap: 9,
                alignItems: 'flex-start',
                marginBottom: 8,
              }}
            >
              <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={12} r={10} fill={INK} />
                <Path
                  d="M7.5 12.2l3 3 6-6.4"
                  stroke="#fff"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 12.5, fontWeight: '700', lineHeight: 17 }}
                >
                  {t}
                </Text>
                <Text
                  style={{ fontSize: 11.5, color: MUTED, lineHeight: 16, marginTop: 1 }}
                >
                  {s}
                </Text>
              </View>
            </View>
          ))}
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: LINE2,
              paddingTop: 9,
              marginTop: 4,
            }}
          >
            <Text
              style={{ fontSize: 11.5, lineHeight: 17, color: MUTED }}
            >
              <Text style={{ color: INK, fontWeight: '700' }}>{'सुरक्षित।'}</Text>
              {' aihoni reads only what you allow, and personal stays separate from your businesses.'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <AHButton kind="primary" onClick={nav.next}>
        Continue
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        {'Skip — I\'ll connect later'}
      </AHButton>
    </AHScreen>
  );
}
