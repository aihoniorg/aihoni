import { useRef } from 'react';
import { View, Text, ScrollView, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHTabBar, AHOrb, RIPPLE, RIPPLE_ICON, pressedOpacity } from '../components/ui';
import { AHStoryRing } from '../components/StoryRing';
import { AH_BRAND_FONT, AH_FONT, INK, ACCENT, MUTED, FAINT, LINE, LINE2 } from '../theme';
import { useNav, type ScreenId } from '../nav';
import Svg, { Path, Circle } from 'react-native-svg';

interface Row {
  kind?: string;
  name: string;
  last?: string;
  time: string;
  ai?: boolean;
  g?: string;
  c?: string;
  group?: boolean;
  unread?: number;
  sub?: string;
  voice?: boolean;
  file?: boolean;
  read?: boolean;
  muted?: boolean;
  to?: ScreenId;
}

const STORIES_HEIGHT = 108;
const FILTERS_HEIGHT = 47;

// 11 · Chats — messenger-style inbox (landing screen of the app).
export function ChatList() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Native-driver collapse: translate + opacity only (no layout) for jank-free scroll.
  const storiesTranslate = scrollY.interpolate({
    inputRange: [0, STORIES_HEIGHT],
    outputRange: [0, -STORIES_HEIGHT],
    extrapolate: 'clamp',
  });
  const storiesOpacity = scrollY.interpolate({
    inputRange: [0, STORIES_HEIGHT * 0.6, STORIES_HEIGHT],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  const filtersTranslate = scrollY.interpolate({
    inputRange: [0, STORIES_HEIGHT],
    outputRange: [0, -STORIES_HEIGHT],
    extrapolate: 'clamp',
  });
  const filters: Array<[string, boolean]> = [
    ['All Chats', true],
    ['New', false],
    ['Family', false],
    ['Work', false],
    ['Friends', false],
    ['Stores', false],
    ['Unread', false],
  ];
  const stories = [
    { glyph: 'सु', add: true, label: 'तपाईं' },
    { glyph: 'रा', color: '#7AAD6A', label: 'Ram' },
    { glyph: 'अ', color: '#5C7AA8', kind: 'business' as const, label: 'Sajha' },
    { glyph: 'सी', color: '#D9695A', label: 'Sita', seen: true },
    { glyph: 'द', color: '#B07A4A', label: 'Daniel', seen: true },
    { glyph: 'लि', color: '#4C8C8C', label: 'Liam' },
    { glyph: 'अ', color: '#8B5CF6', label: 'Annapurna', kind: 'business' as const },
    { glyph: 'मे', color: '#E8572F', label: 'Megha', seen: true },
  ];

  const rows: Row[] = [
    { kind: 'pinned', name: 'aihoni', last: 'आज सुनको भाउ रू 1,42,500 छ', time: '09:37', ai: true, to: 'chat' },
    { g: 'रा', c: '#7AAD6A', name: 'Ram Thapa', last: 'दाल को बोरा छ?', time: '09:01', unread: 1 },
    { group: true, c: '#3A6FE0', name: 'Lagankhel व्यापारी', last: 'Sita: भोलि बैठक छ', time: '08:40', unread: 3, sub: '8 members', to: 'groupChat' },
    { g: 'अ', c: '#5C7AA8', name: 'Alex · Sajha Kirana', last: 'Concept_preview.mov', time: '09:12', unread: 2, voice: true, file: true, to: 'chatAttach' },
    { g: 'द', c: '#B07A4A', name: 'Daniel Brooks', last: '👍', time: '08:17', read: true },
    { g: 'IME', c: '#C0392B', name: 'IME Pay', last: 'रू 250 recharge successful', time: 'Sun', read: true, sub: 'Auto: top-up confirmed' },
    { g: 'सी', c: '#D9695A', name: 'Sita Gurung', last: "You're coming tonight, right?", time: 'Sun', muted: true, to: 'chatAttach' },
    { g: 'लि', c: '#4C8C8C', name: 'Liam Chen', last: 'Sounds good to me', time: 'Oct 14' },
    { g: 'अ', c: '#8B5CF6', name: 'Annapurna Dairy', last: 'दही ल्याइदिनुस्', time: 'Oct 13', unread: 1 },
    { g: 'मे', c: '#E8572F', name: 'Megha Pharmacy', last: 'Voice message', time: 'Oct 13', voice: true, read: true },
    { group: true, c: '#2E9E6B', name: 'Family · परिवार', last: 'Mom: साँझको खाना घरमै', time: 'Oct 12', unread: 4, sub: '6 members' },
    { g: 'ब', c: '#3A6FE0', name: 'Bibek Tamang', last: 'फोन गर्दिनुस् न', time: 'Oct 12', read: true },
    { g: 'eS', c: '#5BB12F', name: 'eSewa', last: 'Payment of रू 1,200 received', time: 'Oct 11', read: true, sub: 'Auto: transaction confirmed' },
    { g: 'क', c: '#D9695A', name: 'Kabita Khadka', last: 'धन्यवाद! 🙏', time: 'Oct 11', read: true },
    { g: 'BA', c: '#1A6FB5', name: 'BookAdda Store', last: 'Your order has been shipped', time: 'Oct 10', sub: 'Tracking #BA-3120', unread: 1 },
    { group: true, c: '#8B5CF6', name: 'Pulchowk Friends', last: 'Daniel: tomorrow lunch?', time: 'Oct 10', sub: '12 members' },
    { g: 'सा', c: '#7AAD6A', name: 'Saroj Karki', last: 'अगाडि बढ्नुस्', time: 'Oct 9', muted: true },
    { g: 'श', c: ACCENT, name: 'Shrestha Kirana Pasal', last: 'नयाँ चामल आयो', time: 'Oct 9', sub: 'Your business · 3 customers' },
    { g: 'NT', c: '#5C2D91', name: 'Khalti', last: 'You sent रू 500 to Ram', time: 'Oct 8', read: true, sub: 'Auto: payment sent' },
    { g: 'अ', c: '#B07A4A', name: 'Anil Bhandari', last: 'OK got it', time: 'Oct 8', read: true },
    { group: true, c: '#D9695A', name: 'School Reunion 2070', last: 'Sunita: photos shared!', time: 'Oct 7', sub: '23 members', muted: true },
    { g: 'का', c: '#4C8C8C', name: 'Kabir Sherpa', last: 'See you on Friday', time: 'Oct 6', read: true },
  ];

  const dbl = (
    <Svg width={15} height={9} viewBox="0 0 16 10">
      <Path
        d="M1 5l3 3.4L9.5 2"
        stroke={ACCENT}
        strokeWidth={1.7}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M7 5l3 3.4L15.5 2"
        stroke={ACCENT}
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
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 6,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: INK }}>
          Chats
        </Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <Pressable
            onPress={() => nav.go('snap')}
            android_ripple={RIPPLE_ICON}
            hitSlop={6}
            style={pressedOpacity({ padding: 6 })}
          >
            <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
              <Path
                d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2l.9-1.6a1 1 0 0 1 .9-.5h5a1 1 0 0 1 .9.5L16.3 6h1.2A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"
                stroke={INK}
                strokeWidth={1.8}
                strokeLinejoin="round"
              />
              <Circle cx={12} cy={12} r={3.2} stroke={INK} strokeWidth={1.8} />
            </Svg>
          </Pressable>
          <Pressable
            onPress={() => nav.go('profile')}
            android_ripple={RIPPLE_ICON}
            hitSlop={6}
            style={pressedOpacity({ padding: 6 })}
          >
            <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 3h14v18H5zM12 10a2.4 2.4 0 1 0 0-4.8A2.4 2.4 0 0 0 12 10zM8.5 16.5a3.5 3.5 0 0 1 7 0"
                stroke={INK}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
          <Pressable
            android_ripple={RIPPLE_ICON}
            hitSlop={6}
            style={pressedOpacity({ padding: 6 })}
          >
            <View style={{ position: 'relative' }}>
              <Svg width={23} height={23} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M18 8.5a6 6 0 0 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 14.5 18 8.5z"
                  stroke={INK}
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                <Path
                  d="M10.2 19.5a2.2 2.2 0 0 0 3.6 0"
                  stroke={INK}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                />
              </Svg>
              <View
                style={{
                  position: 'absolute',
                  top: 1,
                  right: 2,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: ACCENT,
                  borderWidth: 1.5,
                  borderColor: '#fff',
                }}
              />
            </View>
          </Pressable>
          <Pressable
            android_ripple={RIPPLE_ICON}
            hitSlop={6}
            style={pressedOpacity({ padding: 6 })}
          >
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Circle cx={11} cy={11} r={7} stroke={INK} strokeWidth={2} />
              <Path d="M21 21l-4-4" stroke={INK} strokeWidth={2} strokeLinecap="round" />
            </Svg>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1, position: 'relative' }}>
      {/* stories — absolute overlay; translates up smoothly on native driver */}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: STORIES_HEIGHT,
          zIndex: 3,
          backgroundColor: '#fff',
          transform: [{ translateY: storiesTranslate }],
          opacity: storiesOpacity,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 14, alignItems: 'center', paddingVertical: 10 }}
        >
          {stories.map((s, i) => (
            <Pressable
              key={i}
              onPress={() => i === 0 ? nav.go('snap') : nav.go('businessPage')}
              android_ripple={RIPPLE_ICON}
              style={pressedOpacity({ alignItems: 'center', gap: 4, padding: 4 })}
            >
              <AHStoryRing size={64} {...s} />
              <Text
                style={{ fontSize: 11, color: MUTED, fontWeight: '600', maxWidth: 64 }}
                numberOfLines={1}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </Animated.View>

      {/* filter tabs — sticky just below stories; translates with stories */}
      <Animated.View
        style={{
          position: 'absolute',
          top: STORIES_HEIGHT,
          left: 0,
          right: 0,
          height: FILTERS_HEIGHT,
          zIndex: 2,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: LINE,
          transform: [{ translateY: filtersTranslate }],
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8, gap: 18 }}
        >
        {filters.map(([l, on], i) => (
          <Pressable
            key={i}
            android_ripple={RIPPLE}
            style={pressedOpacity({ paddingBottom: 9, position: 'relative' })}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: on ? '800' : '600',
                color: on ? INK : MUTED,
              }}
            >
              {l}
            </Text>
            {on && (
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 3,
                  borderRadius: 99,
                  backgroundColor: ACCENT,
                }}
              />
            )}
          </Pressable>
        ))}
        </ScrollView>
      </Animated.View>

      {/* list — sits beneath the absolute stories/filters; paddingTop clears them */}
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: STORIES_HEIGHT + FILTERS_HEIGHT }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {rows.map((r, i) => {
          const pinned = r.kind === 'pinned';
          return (
            <Pressable
              key={i}
              onPress={() => r.to && nav.go(r.to)}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 13,
                paddingHorizontal: 20,
                paddingVertical: 12,
                backgroundColor: pinned ? '#ECF2FE' : 'transparent',
              })}
            >
              {r.ai ? (
                <View style={{ flexShrink: 0 }}>
                  <AHOrb size={48} />
                </View>
              ) : r.group ? (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: r.c ? r.c + '24' : '#eee',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderWidth: 2,
                    borderColor: '#fff',
                  }}
                >
                  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                    <Circle cx={9} cy={9} r={3} stroke={r.c || INK} strokeWidth={1.8} />
                    <Path
                      d="M3.5 18a5.5 5.5 0 0 1 11 0"
                      stroke={r.c || INK}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                    <Path
                      d="M16 7.5a2.8 2.8 0 0 1 0 5.4M17 18a5 5 0 0 0-2.3-4.2"
                      stroke={r.c || INK}
                      strokeWidth={1.8}
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>
              ) : (
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: r.c ? r.c + '38' : '#eee',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    borderWidth: 2,
                    borderColor: '#fff',
                  }}
                >
                  <Text
                    style={{
                      fontFamily: AH_BRAND_FONT,
                      fontWeight: '800',
                      fontSize: 16,
                      color: r.c || INK,
                    }}
                  >
                    {r.g}
                  </Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 15.5,
                      fontWeight: '700',
                      fontFamily: r.ai ? AH_BRAND_FONT : AH_FONT,
                      color: INK,
                    }}
                  >
                    {r.name}
                    {r.ai && <Text style={{ color: ACCENT }}>.</Text>}
                  </Text>
                  {r.ai && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 3,
                        backgroundColor: ACCENT,
                        borderRadius: 99,
                        paddingHorizontal: 7,
                        paddingLeft: 5,
                        paddingVertical: 2,
                      }}
                    >
                      <Svg width={10} height={10} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 3l1.6 4.3a5 5 0 0 0 3.1 3.1L21 12l-4.3 1.6a5 5 0 0 0-3.1 3.1L12 21l-1.6-4.3a5 5 0 0 0-3.1-3.1L3 12l4.3-1.6a5 5 0 0 0 3.1-3.1z"
                          fill="#fff"
                        />
                      </Svg>
                      <Text
                        style={{ fontSize: 9.5, fontWeight: '800', color: '#fff' }}
                      >
                        AI
                      </Text>
                    </View>
                  )}
                  <Text
                    style={{
                      marginLeft: 'auto',
                      fontSize: 11.5,
                      fontWeight: r.unread ? '700' : '500',
                      color: r.unread ? ACCENT : MUTED,
                    }}
                  >
                    {r.time}
                  </Text>
                </View>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}
                >
                  {r.read && dbl}
                  {r.voice && (
                    <Svg width={13} height={13} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M3 13c2 0 2-3 4-3s2 5 4 5 2-7 4-7 2 4 4 4 2-1 2-1"
                        stroke={ACCENT}
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    </Svg>
                  )}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 13.5,
                      color: r.unread ? INK : MUTED,
                      fontWeight: r.unread ? '600' : '400',
                    }}
                    numberOfLines={1}
                  >
                    {r.sub || r.last}
                  </Text>
                  {pinned && (
                    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M14 4l6 6-4 1-2 6-3-3-4 4-1-1 4-4-3-3 6-2 1-4z"
                        fill={ACCENT}
                      />
                    </Svg>
                  )}
                  {!!r.unread && (
                    <View
                      style={{
                        minWidth: 20,
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: ACCENT,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: 6,
                        flexShrink: 0,
                      }}
                    >
                      <Text
                        style={{ fontSize: 11.5, fontWeight: '800', color: '#fff' }}
                      >
                        {r.unread}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          );
        })}
        <View style={{ height: 12 }} />
      </Animated.ScrollView>
      </View>

      <AHTabBar active="chat" />
    </AHScreen>
  );
}
