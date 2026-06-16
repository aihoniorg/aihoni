import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Image,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHTabBar, RIPPLE_ICON, pressedOpacity } from '../components/ui';
import { AHStoryRing } from '../components/StoryRing';
import { ImageSlot } from '../components/ImageSlot';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, LINE } from '../theme';
import { useNav } from '../nav';
import { api } from '../apiClient';
import { useBusiness, type Business } from '../business';
import Svg, { Path, Circle } from 'react-native-svg';

const IMG_W = Dimensions.get('window').width - 40;

function PostImageCarousel({ urls }: { urls: string[] }) {
  const [active, setActive] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / IMG_W);
    if (i !== active) setActive(i);
  };
  if (urls.length === 0) {
    return (
      <View style={{ width: '100%', aspectRatio: 1, borderRadius: 22, overflow: 'hidden', backgroundColor: ACCENT + '14' }}>
        <ImageSlot placeholder=" " style={{ width: '100%', height: '100%' }} />
      </View>
    );
  }
  return (
    <View style={{ position: 'relative' }}>
      <View style={{ width: '100%', aspectRatio: 1, borderRadius: 22, overflow: 'hidden', backgroundColor: ACCENT + '24' }}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        >
          {urls.map((u, i) => (
            <Image
              key={i}
              source={{ uri: u }}
              style={{ width: IMG_W, height: IMG_W }}
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>
      {urls.length > 1 && (
        <>
          <View
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(20,12,4,0.7)',
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>
              {active + 1}/{urls.length}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: -16,
              left: 0,
              right: 0,
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            {urls.map((_, j) => (
              <View
                key={j}
                style={{
                  width: j === active ? 7 : 5,
                  height: j === active ? 7 : 5,
                  borderRadius: 4,
                  backgroundColor: j === active ? ACCENT : ACCENT + '50',
                }}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

interface ApiPost {
  id: string;
  business_id: string | null;
  caption: string | null;
  image_keys: string[];
  image_urls: string[];
  ratio: number;
  likes: number;
  created_at: number;
}

function relativeTime(unix: number): string {
  const diff = Date.now() / 1000 - unix;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

function formatLikes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

const STORIES_HEIGHT = 108;
const FILTERS_HEIGHT = 47;

// 12 · Feed — post feed with Like / Save / Share (no comments).
export function Feed() {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('all');
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const { businesses } = useBusiness();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    api<{ posts: ApiPost[] }>('/api/posts')
      .then((r) => { if (!cancelled) setPosts(r.posts ?? []); })
      .catch((e) => { if (!cancelled) setError(String((e as Error).message ?? e)); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const businessById = new Map<string, Business>();
  for (const b of businesses) businessById.set(b.id, b);

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

  const filters: Array<[string, string]> = [
    ['all', 'All'],
    ['stores', 'Stores'],
    ['nearby', 'Nearby'],
    ['saved', 'Saved 🔖'],
  ];
  const stories = [
    { glyph: 'सु', add: true, label: 'तपाईं' },
    { glyph: 'रा', color: '#7AAD6A', label: 'Ram' },
    { glyph: 'अ', color: '#5C7AA8', kind: 'business' as const, label: 'Sajha' },
    { glyph: 'सी', color: '#D9695A', label: 'Sita' },
    { glyph: 'द', color: '#B07A4A', label: 'Daniel' },
  ];

  return (
    <AHScreen pad={false}>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: 20,
            paddingBottom: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
          }}
        >
          <Text style={{ fontSize: 26, fontWeight: '800', letterSpacing: -0.5, color: INK }}>
            Feed
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
            <Pressable
              onPress={() => nav.go('snap')}
              android_ripple={RIPPLE_ICON}
              hitSlop={6}
              style={pressedOpacity({ padding: 7 })}
            >
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path d="M12 5v14M5 12h14" stroke={INK} strokeWidth={2.2} strokeLinecap="round" />
              </Svg>
            </Pressable>
            <Pressable android_ripple={RIPPLE_ICON} hitSlop={6} style={pressedOpacity({ padding: 7 })}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Circle cx={11} cy={11} r={7} stroke={INK} strokeWidth={2} />
                <Path d="M21 21l-4-4" stroke={INK} strokeWidth={2} strokeLinecap="round" />
              </Svg>
            </Pressable>
          </View>
        </View>

        <View style={{ flex: 1, position: 'relative' }}>
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
              contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 10, gap: 14, alignItems: 'center' }}
            >
              {stories.map((s, i) => (
                <Pressable key={i} onPress={() => nav.go('businessPage')} style={{ alignItems: 'center', gap: 4 }}>
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

          <Animated.View
            style={{
              position: 'absolute',
              top: STORIES_HEIGHT,
              left: 0,
              right: 0,
              height: FILTERS_HEIGHT,
              zIndex: 2,
              backgroundColor: '#fff',
              flexDirection: 'row',
              gap: 18,
              paddingHorizontal: 20,
              paddingTop: 12,
              borderBottomWidth: 1,
              borderBottomColor: LINE,
              transform: [{ translateY: filtersTranslate }],
            }}
          >
            {filters.map(([id, l]) => {
              const on = id === tab;
              return (
                <Pressable key={id} onPress={() => setTab(id)} style={{ paddingBottom: 9, position: 'relative' }}>
                  <Text style={{ fontSize: 13.5, fontWeight: on ? '800' : '600', color: on ? INK : MUTED }}>
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
              );
            })}
          </Animated.View>

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
            {loading && posts.length === 0 && (
              <Text style={{ textAlign: 'center', color: MUTED, marginTop: 24 }}>
                Loading…
              </Text>
            )}
            {error && (
              <Text style={{ textAlign: 'center', color: '#D14836', marginTop: 24, paddingHorizontal: 24 }}>
                Couldn't load feed: {error}
              </Text>
            )}
            {!loading && !error && posts.length === 0 && (
              <Text style={{ textAlign: 'center', color: MUTED, marginTop: 24 }}>
                No posts yet. Open the camera to share one.
              </Text>
            )}
            {posts.map((p, i) => {
              const biz = p.business_id ? businessById.get(p.business_id) ?? null : null;
              const name = biz?.name ?? 'aihoni';
              const glyph = (name.trim()[0] ?? '?').toUpperCase();
              const loc = `${biz?.district ?? '—'} · ${relativeTime(p.created_at)}`;
              return (
                <View key={p.id} style={{ paddingHorizontal: 20, paddingTop: 14 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 11,
                      marginBottom: 11,
                    }}
                  >
                    <Pressable
                      onPress={() => nav.go('businessPage')}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 2,
                        borderColor: ACCENT,
                        padding: 1.5,
                        overflow: 'hidden',
                      }}
                    >
                      {biz?.logo_url ? (
                        <Image source={{ uri: biz.logo_url }} style={{ width: '100%', height: '100%', borderRadius: 20 }} />
                      ) : (
                        <View
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 20,
                            backgroundColor: ACCENT + '38',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Text
                            style={{
                              color: ACCENT,
                              fontFamily: AH_BRAND_FONT,
                              fontWeight: '800',
                              fontSize: 13,
                            }}
                          >
                            {glyph}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: INK }}>{name}</Text>
                      <Text style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>{loc}</Text>
                    </View>
                    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                      <Circle cx={5} cy={12} r={1.6} fill={MUTED} />
                      <Circle cx={12} cy={12} r={1.6} fill={MUTED} />
                      <Circle cx={19} cy={12} r={1.6} fill={MUTED} />
                    </Svg>
                  </View>

                  <PostImageCarousel urls={p.image_urls} />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 14,
                      paddingHorizontal: 4,
                      paddingVertical: 13,
                      paddingBottom: 6,
                      marginTop: p.image_urls.length > 1 ? 10 : 0,
                    }}
                  >
                    <Pressable
                      android_ripple={RIPPLE_ICON}
                      hitSlop={8}
                      style={pressedOpacity({ flexDirection: 'row', alignItems: 'center', gap: 7, padding: 5 })}
                    >
                      <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M12 20.5s-7.5-4.5-9.5-9A5 5 0 0 1 12 6.5a5 5 0 0 1 9.5 5c-2 4.5-9.5 9-9.5 9z"
                          stroke={INK}
                          strokeWidth={1.9}
                          strokeLinejoin="round"
                        />
                      </Svg>
                      <Text style={{ fontSize: 13.5, fontWeight: '700', color: INK }}>
                        {formatLikes(p.likes)}
                      </Text>
                    </Pressable>
                    <Pressable android_ripple={RIPPLE_ICON} hitSlop={8} style={pressedOpacity({ padding: 5 })}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M5 3.5h14V21l-7-4.4L5 21z"
                          stroke={INK}
                          strokeWidth={1.9}
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </Pressable>
                    <Pressable android_ripple={RIPPLE_ICON} hitSlop={8} style={pressedOpacity({ padding: 5 })}>
                      <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M3.5 11.5L20.5 4l-6 16.5-3-7.5z"
                          stroke={INK}
                          strokeWidth={1.9}
                          strokeLinejoin="round"
                        />
                      </Svg>
                    </Pressable>
                  </View>

                  {p.caption ? (
                    <Text style={{ fontSize: 13.5, lineHeight: 20, color: INK }}>
                      <Text style={{ fontWeight: '700' }}>{name}</Text>
                      {'  '}
                      {p.caption}
                    </Text>
                  ) : null}
                  {i < posts.length - 1 && (
                    <View style={{ height: 1, backgroundColor: LINE, marginTop: 16 }} />
                  )}
                </View>
              );
            })}
            <View style={{ height: 20 }} />
          </Animated.ScrollView>
        </View>
      </View>
      <AHTabBar active="feed" />
    </AHScreen>
  );
}
