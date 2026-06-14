import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHChatInput, RIPPLE, RIPPLE_ICON, pressedOpacity } from '../components/ui';
import { INK, ACCENT, MUTED, LINE, LINE2, BG_SOFT } from '../theme';
import { useNav } from '../nav';
import Svg, { Path, Circle } from 'react-native-svg';

// 17 · Chat · long-press reactions + reply.
export function ChatReact() {
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

  const reactions = ['❤️', '😂', '😮', '😢', '🙏', '👍'];
  const actions = [
    { id: 'reply', label: 'Reply', d: 'M9 14l-5-5 5-5M4 9h11a5 5 0 0 1 5 5v3' },
    { id: 'forward', label: 'Forward', d: 'M15 14l5-5-5-5M20 9H9a5 5 0 0 0-5 5v3' },
    { id: 'copy', label: 'Copy', d: 'M9 3h10v14H9zM5 7v12h10' },
    { id: 'star', label: 'Star', d: 'M12 3l2.5 6 6.5.5-5 4.5 1.5 6.5L12 17l-5.5 3.5L8 14 3 9.5 9.5 9z' },
    { id: 'reaction', label: 'More', d: 'M5 12h14M12 5v14' },
    { id: 'delete', label: 'Delete', d: 'M5 6h14M9 6V4h6v2M7 6v14h10V6' },
  ];

  return (
    <AHScreen pad={false}>
      {/* header — selection mode */}
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
              d="M6 6l12 12M18 6L6 18"
              stroke={INK}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
        <Text style={{ flex: 1, fontSize: 15.5, fontWeight: '800', color: INK }}>
          1 selected
        </Text>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M9 14l-5-5 5-5M4 9h11a5 5 0 0 1 5 5v3"
            stroke={INK}
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
          <Path
            d="M15 14l5-5-5-5M20 9H9a5 5 0 0 0-5 5v3"
            stroke={INK}
            strokeWidth={1.9}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
        <Svg width={22} height={22} viewBox="0 0 24 24">
          <Circle cx={12} cy={5} r={1.7} fill={INK} />
          <Circle cx={12} cy={12} r={1.7} fill={INK} />
          <Circle cx={12} cy={19} r={1.7} fill={INK} />
        </Svg>
      </View>

      {/* messages + overlay */}
      <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <View
          style={{
            padding: 14,
            paddingHorizontal: 16,
            paddingBottom: 8,
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <View style={{ alignSelf: 'flex-start', maxWidth: 260, opacity: 0.35 }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                borderBottomLeftRadius: 6,
                padding: 11,
                paddingHorizontal: 15,
                paddingBottom: 8,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 6,
              }}
            >
              <Text style={{ fontSize: 14, lineHeight: 20, color: INK }}>
                {'आजको भाउ कति छ?'}
              </Text>
            </View>
          </View>

          <View style={{ alignSelf: 'flex-start', maxWidth: 290, opacity: 0.35, position: 'relative' }}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 20,
                borderBottomLeftRadius: 6,
                padding: 11,
                paddingHorizontal: 15,
                paddingBottom: 9,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.18,
                shadowRadius: 6,
              }}
            >
              <Text style={{ fontSize: 14, lineHeight: 21 }}>
                {'आज सुनको भाउ '}
                <Text style={{ fontWeight: '700' }}>{'रू 1,42,500'}</Text>
                {' छ। हिजोभन्दा बढी।'}
              </Text>
              <Text
                style={{ fontSize: 10.5, color: MUTED, textAlign: 'right', marginTop: 3 }}
              >
                10:14
              </Text>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: -10,
                left: 12,
                backgroundColor: '#fff',
                borderRadius: 99,
                paddingHorizontal: 9,
                paddingVertical: 3,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                borderWidth: 1,
                borderColor: LINE,
              }}
            >
              <Text style={{ fontSize: 13 }}>❤️</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: MUTED }}>2</Text>
            </View>
          </View>
        </View>

        {/* dim wash */}
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(20,12,4,0.45)',
          }}
        />

        {/* reaction picker + selected message + action menu */}
        <View
          style={{
            position: 'absolute',
            top: 80,
            left: 0,
            right: 0,
            paddingHorizontal: 16,
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 10,
          }}
        >
          {/* reaction bar */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 99,
              padding: 6,
              paddingHorizontal: 8,
              flexDirection: 'row',
              gap: 4,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.4,
              shadowRadius: 32,
              elevation: 8,
            }}
          >
            {reactions.map((r) => (
              <Pressable
                key={r}
                android_ripple={RIPPLE_ICON}
                style={pressedOpacity({
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: r === '❤️' ? '#ECF2FE' : 'transparent',
                  transform: r === '❤️' ? [{ scale: 1.1 }] : [],
                })}
              >
                <Text style={{ fontSize: 22 }}>{r}</Text>
              </Pressable>
            ))}
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: BG_SOFT,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M5 12h14M12 5v14"
                  stroke={INK}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          </View>

          {/* selected message */}
          <View style={{ maxWidth: 290 }}>
            <View
              style={{
                backgroundColor: INK,
                borderRadius: 20,
                borderBottomRightRadius: 6,
                padding: 11,
                paddingHorizontal: 14,
                paddingBottom: 9,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 22 },
                shadowOpacity: 0.55,
                shadowRadius: 40,
                elevation: 10,
              }}
            >
              <Text style={{ fontSize: 14.5, lineHeight: 20, color: '#fff' }}>
                {'राम्रो! एक केजी राख्नुहोला।'}
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
                <Text style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)' }}>
                  10:15
                </Text>
                {dbl()}
              </View>
            </View>
          </View>

          {/* action menu */}
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 18,
              padding: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 14 },
              shadowOpacity: 0.4,
              shadowRadius: 32,
              elevation: 8,
              minWidth: 220,
            }}
          >
            {actions.map((a, i) => (
              <Pressable
                key={a.id}
                android_ripple={RIPPLE}
                style={pressedOpacity({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  padding: 10,
                  paddingHorizontal: 12,
                  borderTopWidth: i ? 1 : 0,
                  borderTopColor: LINE,
                })}
              >
                <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                  <Path
                    d={a.d}
                    stroke={a.id === 'delete' ? '#D14836' : INK}
                    strokeWidth={1.9}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 14.5,
                    fontWeight: '600',
                    color: a.id === 'delete' ? '#D14836' : INK,
                  }}
                >
                  {a.label}
                </Text>
                {a.id === 'reply' && (
                  <Text style={{ fontSize: 11, fontWeight: '700', color: MUTED }}>
                    {'← swipe'}
                  </Text>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <AHChatInput placeholder="Type a reply…" reply={true} />
    </AHScreen>
  );
}
