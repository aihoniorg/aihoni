import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert, Image } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AHScreen, AHTabBar, AHCoin, RIPPLE, pressedOpacity } from '../components/ui';
import { AH_BRAND_FONT, INK, ACCENT, MUTED, LINE, LINE2, FAINT, BG_SOFT, ACCENT_SOFT, GREEN, mixWithWhite } from '../theme';
import { useNav } from '../nav';
import { useAuth } from '../auth';
import { getPushToken, sendLocalTestNotification } from '../notifications';
import { pickAndUploadImage } from '../imageUpload';
import { api, ApiError } from '../apiClient';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import type { ReactNode } from 'react';

const WALLET_W = 196;
const WALLET_H = 168;

function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginTop: 22,
        marginBottom: 10,
        marginHorizontal: 2,
      }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: INK }}>{title}</Text>
      {action}
    </View>
  );
}

function Row({
  icon,
  title,
  sub,
  onPress,
  trailing,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
  onPress?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={RIPPLE}
      style={pressedOpacity({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 13,
        padding: 12,
        paddingHorizontal: 15,
      })}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          backgroundColor: ACCENT_SOFT,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14.5, fontWeight: '600', color: INK }}>{title}</Text>
        {sub ? (
          <Text style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{sub}</Text>
        ) : null}
      </View>
      {trailing ?? (
        <Svg width={7} height={12} viewBox="0 0 8 14">
          <Path
            d="M1 1l5.5 6L1 13"
            stroke="#C2B49A"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      )}
    </Pressable>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <View
      style={{
        borderRadius: 18,
        backgroundColor: '#fff',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.14,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {children}
    </View>
  );
}

interface Wallet {
  name: string;
  id: string;
  pts: string;
  c: string;
  glyph: string;
  isDefault?: boolean;
}

function WalletCard({ w, onTopUp }: { w: Wallet; onTopUp: () => void }) {
  const isDefault = !!w.isDefault;
  // One unified card style for all wallets — light/white background with brand-color accents.
  // The wallet's own color is what distinguishes each (icon tint, accent stripe, badge color).

  return (
    <Pressable
      onPress={onTopUp}
      android_ripple={RIPPLE}
      style={pressedOpacity(
        {
          width: WALLET_W,
          height: WALLET_H,
          borderRadius: 22,
          overflow: 'hidden',
          flexShrink: 0,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: LINE,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 2,
        },
        0.94,
      )}
    >
      {/* Soft brand-tinted band across the top — subtle, NOT heavy */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 72,
          backgroundColor: mixWithWhite(w.c, 0.07),
        }}
      />
      {/* Brand color accent stripe on the very top edge */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: w.c,
        }}
      />

      <View style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}>
        {/* top row — brand chip + status */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: mixWithWhite(w.c, 0.16),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{
                color: w.c,
                fontFamily: AH_BRAND_FONT,
                fontWeight: '800',
                fontSize: 16,
              }}
            >
              {w.glyph}
            </Text>
          </View>
          {isDefault ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: mixWithWhite(w.c, 0.14),
                borderRadius: 99,
                paddingHorizontal: 9,
                paddingVertical: 3,
              }}
            >
              <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: GREEN }} />
              <Text
                style={{
                  fontSize: 9.5,
                  fontWeight: '800',
                  color: w.c,
                  letterSpacing: 0.4,
                }}
              >
                DEFAULT
              </Text>
            </View>
          ) : (
            <Text
              style={{
                fontSize: 10.5,
                fontWeight: '800',
                color: w.c,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
              }}
            >
              Business
            </Text>
          )}
        </View>

        {/* hero balance + name */}
        <View>
          <Text
            style={{
              fontSize: 10.5,
              fontWeight: '700',
              color: MUTED,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              marginBottom: 3,
            }}
            numberOfLines={1}
          >
            {w.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: '800',
                letterSpacing: -1,
                lineHeight: 36,
                color: INK,
              }}
            >
              {w.pts}
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: MUTED }}>pts</Text>
          </View>
          <Text style={{ fontSize: 10.5, fontWeight: '600', color: FAINT, marginTop: 2 }}>
            {'≈ रू ' + w.pts}
          </Text>
        </View>

        {/* footer — ID + chevron */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTopWidth: 1,
            borderTopColor: LINE,
            paddingTop: 9,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Svg width={9} height={9} viewBox="0 0 24 24" fill="none">
              <Circle cx={12} cy={12} r={10} stroke={FAINT} strokeWidth={2} />
              <Circle cx={12} cy={12} r={4} fill={FAINT} />
            </Svg>
            <Text
              style={{
                fontSize: 10,
                fontWeight: '700',
                color: MUTED,
                letterSpacing: 0.5,
                fontVariant: ['tabular-nums'],
              }}
            >
              {w.id}
            </Text>
          </View>
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: mixWithWhite(w.c, 0.14),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 12h14M13 6l6 6-6 6"
                stroke={w.c}
                strokeWidth={2.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function AddWalletCard({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={RIPPLE}
      style={pressedOpacity({
        width: WALLET_W,
        height: WALLET_H,
        borderRadius: 24,
        borderWidth: 1.5,
        borderStyle: 'dashed',
        borderColor: LINE2,
        backgroundColor: BG_SOFT,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        flexShrink: 0,
      })}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1.5,
          borderColor: ACCENT_SOFT,
          shadowColor: ACCENT,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M12 5v14M5 12h14"
            stroke={ACCENT}
            strokeWidth={2.6}
            strokeLinecap="round"
          />
        </Svg>
      </View>
      <View style={{ alignItems: 'center', gap: 2 }}>
        <Text style={{ fontSize: 13.5, fontWeight: '700', color: INK }}>Add wallet</Text>
        <Text style={{ fontSize: 10.5, color: MUTED }}>Personal or business</Text>
      </View>
    </Pressable>
  );
}

// 21 · Profile — identity, wallets, businesses, payment, personal information.
export function Profile() {
  const nav = useNav();
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [token, setToken] = useState<string | null>(getPushToken());
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url ?? user?.picture ?? null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const changeAvatar = async () => {
    setAvatarUploading(true);
    try {
      const media = await pickAndUploadImage({ aspect: [1, 1], quality: 0.8 });
      if (!media) return;
      setAvatarUrl(media.url);
      try {
        await api('/api/auth/me', { method: 'PATCH', body: { avatar_key: media.key } });
      } catch (e) {
        Alert.alert(
          'Avatar saved locally',
          e instanceof ApiError && e.status === 401
            ? 'Sign in to save your avatar to your account.'
            : 'Could not save avatar to your profile right now.',
        );
      }
    } finally {
      setAvatarUploading(false);
    }
  };

  // Derived display values (fallback to sample when not signed in).
  const displayName = user?.name ?? 'Sunita Shrestha';
  const displayEmail = user?.email;
  const displayInitial = (user?.name?.trim()?.[0] ?? 'S').toUpperCase();

  const handleLogout = () => {
    Alert.alert('Log out', 'You will be returned to the sign-in screen.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          nav.reset('welcome');
        },
      },
    ]);
  };

  // Poll briefly for the token (registration completes async on app start).
  useEffect(() => {
    if (token) return;
    const id = setInterval(() => {
      const t = getPushToken();
      if (t) {
        setToken(t);
        clearInterval(id);
      }
    }, 800);
    return () => clearInterval(id);
  }, [token]);

  const copyToken = async () => {
    if (!token) return;
    await Clipboard.setStringAsync(token);
    Alert.alert('Copied', 'Push token copied to clipboard.');
  };

  const fireTest = async () => {
    try {
      await sendLocalTestNotification(
        'aihoni.',
        'राम Thapa: दाल को बोरा छ?',
        { screen: 'chat' },
      );
    } catch (e) {
      Alert.alert('Could not fire test', String(e));
    }
  };

  const wallets: Wallet[] = [
    { name: 'aihoni Points', id: 'AIH-2480-SNT', pts: '2,480', c: ACCENT, glyph: 'P', isDefault: true },
    { name: 'Shrestha Kirana', id: 'AIH-0940-SKP', pts: '940', c: '#3A6FE0', glyph: 'श' },
    { name: 'Sunita Fashion', id: 'AIH-0312-SNF', pts: '312', c: '#8B5CF6', glyph: 'सु' },
  ];

  const businesses: Array<[string, string, string]> = [
    ['प', 'Shrestha Kirana Pasal', '142 products · Lagankhel'],
    ['कप', 'Sunita Fashion', '38 products · Pulchowk'],
  ];

  const payments: Array<[string, string, string, string]> = [
    ['eSewa', '...4821 · Linked', '#5BB12F', 'e'],
    ['Khalti', 'Wallet · Linked', '#5C2D91', 'K'],
    ['IME Pay', 'Tap to link', '#C0392B', 'I'],
  ];

  return (
    <AHScreen pad={false}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* profile header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <Pressable
            onPress={changeAvatar}
            disabled={avatarUploading}
            android_ripple={RIPPLE}
            style={pressedOpacity({
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 2.5,
              borderColor: ACCENT,
              padding: 2,
              flexShrink: 0,
              opacity: avatarUploading ? 0.6 : 1,
            })}
          >
            <View
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 30,
                backgroundColor: ACCENT + '38',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Text
                  style={{
                    color: ACCENT,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: '800',
                    fontSize: 22,
                  }}
                >
                  {displayInitial}
                </Text>
              )}
            </View>
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 20, fontWeight: '700', letterSpacing: -0.3, color: INK }}
              numberOfLines={1}
            >
              {displayName}
            </Text>
            <Text style={{ fontSize: 13, color: MUTED, marginTop: 1 }} numberOfLines={1}>
              {displayEmail ?? '+977 98XXXXXXXX · Lalitpur'}
            </Text>
          </View>
          <Pressable
            onPress={() => nav.go('personal')}
            style={{
              backgroundColor: ACCENT_SOFT,
              borderRadius: 99,
              paddingHorizontal: 14,
              paddingVertical: 7,
            }}
          >
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: ACCENT }}>Edit</Text>
          </Pressable>
        </View>

        {/* wallets — uniform compact cards */}
        <SectionHeader
          title="Wallets"
          action={
            <Pressable onPress={() => nav.go('recharge')}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: ACCENT }}>
                Recharge
              </Text>
            </Pressable>
          }
        />
        <View style={{ height: WALLET_H + 10, marginHorizontal: -20 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, alignItems: 'center' }}
          >
            {wallets.map((w) => (
              <WalletCard key={w.id} w={w} onTopUp={() => nav.go('recharge')} />
            ))}
            <AddWalletCard onPress={() => nav.go('recharge')} />
          </ScrollView>
        </View>

        {/* your businesses */}
        <SectionHeader
          title="Your business"
          action={
            <Pressable onPress={() => nav.go('addBusiness')}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: ACCENT }}>
                + Add
              </Text>
            </Pressable>
          }
        />
        <Card>
          {businesses.map(([g, n, s], i) => (
            <Pressable
              key={n}
              onPress={() => nav.go('businessDashboard')}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 13,
                padding: 12,
                paddingHorizontal: 14,
                borderTopWidth: i ? 1 : 0,
                borderTopColor: LINE,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: mixWithWhite(ACCENT, 0.14),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    color: ACCENT,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: '800',
                    fontSize: 14,
                  }}
                >
                  {g}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14.5, fontWeight: '700', color: INK }}>{n}</Text>
                <Text style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>{s}</Text>
              </View>
              <Svg width={8} height={13} viewBox="0 0 8 14">
                <Path
                  d="M1 1l5.5 6L1 13"
                  stroke="#C2B49A"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ))}
        </Card>

        {/* payment */}
        <SectionHeader
          title="Payment"
          action={
            <Pressable onPress={() => nav.go('recharge')}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: ACCENT }}>
                Manage
              </Text>
            </Pressable>
          }
        />
        <Card>
          {payments.map(([name, sub, c, g], i) => (
            <Pressable
              key={name}
              onPress={() => nav.go('recharge')}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 13,
                padding: 12,
                paddingHorizontal: 14,
                borderTopWidth: i ? 1 : 0,
                borderTopColor: LINE,
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: mixWithWhite(c, 0.14),
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Text
                  style={{
                    color: c,
                    fontFamily: AH_BRAND_FONT,
                    fontWeight: '800',
                    fontSize: 14,
                  }}
                >
                  {g}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: INK }}>{name}</Text>
                <Text style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>{sub}</Text>
              </View>
              <Svg width={7} height={12} viewBox="0 0 8 14">
                <Path
                  d="M1 1l5.5 6L1 13"
                  stroke="#C2B49A"
                  strokeWidth={2}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </Pressable>
          ))}
        </Card>

        {/* personal information */}
        <SectionHeader
          title="Personal information"
          action={
            <Pressable onPress={() => nav.go('personal')}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: ACCENT }}>
                Edit
              </Text>
            </Pressable>
          }
        />
        <Card>
          <Row
            onPress={() => nav.go('personal')}
            title="Sunita Shrestha"
            sub="Full name"
            icon={
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Circle cx={12} cy={9} r={3.6} stroke={ACCENT} strokeWidth={1.8} />
                <Path d="M5 20a7 7 0 0 1 14 0" stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            }
          />
          <View style={{ height: 1, backgroundColor: LINE }} />
          <Row
            onPress={() => nav.go('personal')}
            title="+977 98XXXXXXXX"
            sub="Mobile · Verified"
            icon={
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Rect x="6" y="3" width="12" height="18" rx="3" stroke={ACCENT} strokeWidth={1.8} />
                <Path d="M11 17h2" stroke={ACCENT} strokeWidth={1.8} strokeLinecap="round" />
              </Svg>
            }
            trailing={
              <View
                style={{
                  backgroundColor: GREEN + '20',
                  borderRadius: 99,
                  paddingHorizontal: 9,
                  paddingVertical: 3,
                }}
              >
                <Text style={{ fontSize: 10.5, fontWeight: '800', color: GREEN }}>OK</Text>
              </View>
            }
          />
          <View style={{ height: 1, backgroundColor: LINE }} />
          <Row
            onPress={() => nav.go('personal')}
            title="Lalitpur"
            sub="District"
            icon={
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 21s7-6.4 7-12a7 7 0 1 0-14 0c0 5.6 7 12 7 12z"
                  stroke={ACCENT}
                  strokeWidth={1.8}
                  strokeLinejoin="round"
                />
                <Circle cx={12} cy={9} r={2.4} stroke={ACCENT} strokeWidth={1.8} />
              </Svg>
            }
          />
          <View style={{ height: 1, backgroundColor: LINE }} />
          <Row
            onPress={() => nav.go('language')}
            title="नेपाली · English"
            sub="Language"
            icon={
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M4 5h16M9 5c0 6-2.5 10-5 12M7 9c1 3 4 5 8 6"
                  stroke={ACCENT}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
          />
          <View style={{ height: 1, backgroundColor: LINE }} />
          <Row
            title="Privacy & data"
            sub="Personal and business kept separate"
            icon={
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 3l7 3v6c0 4-3 7-7 8-4-1-7-4-7-8V6z"
                  stroke={ACCENT}
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            }
          />
        </Card>

        {/* notifications — debug & test */}
        <SectionHeader
          title="Notifications"
          action={
            <Pressable onPress={fireTest} android_ripple={RIPPLE} hitSlop={6}>
              <Text style={{ fontSize: 12.5, fontWeight: '700', color: ACCENT }}>
                Send test
              </Text>
            </Pressable>
          }
        />
        <Card>
          <View style={{ padding: 14 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                marginBottom: 6,
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: token ? GREEN : FAINT,
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '700',
                  color: token ? GREEN : MUTED,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                }}
              >
                {token ? 'Push enabled' : 'Waiting for token'}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: INK,
                fontFamily: 'Menlo',
                lineHeight: 16,
              }}
              numberOfLines={2}
              selectable
            >
              {token ?? 'ExponentPushToken[…] will appear after permission is granted in a dev/prod build.'}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 8,
                marginTop: 12,
              }}
            >
              <Pressable
                onPress={fireTest}
                android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
                style={pressedOpacity({
                  flex: 1,
                  backgroundColor: INK,
                  borderRadius: 99,
                  paddingVertical: 10,
                  alignItems: 'center',
                })}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>
                  Fire local test
                </Text>
              </Pressable>
              <Pressable
                onPress={copyToken}
                disabled={!token}
                android_ripple={RIPPLE}
                style={pressedOpacity({
                  flex: 1,
                  backgroundColor: token ? BG_SOFT : BG_SOFT,
                  borderRadius: 99,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: LINE2,
                  opacity: token ? 1 : 0.5,
                })}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: INK }}>
                  Copy token
                </Text>
              </Pressable>
            </View>
          </View>
        </Card>

        {/* log out */}
        <View style={{ marginTop: 22 }}>
          <Pressable
            onPress={handleLogout}
            android_ripple={RIPPLE}
            style={pressedOpacity({
              backgroundColor: '#fff',
              borderRadius: 18,
              borderWidth: 1.5,
              borderColor: '#F1D5D5',
              paddingVertical: 14,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 9,
            })}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 12H4M4 12l4-4M4 12l4 4M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"
                stroke="#D14836"
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text style={{ fontSize: 14.5, fontWeight: '700', color: '#D14836' }}>
              Log out
            </Text>
          </Pressable>
          {user?.email && (
            <Text
              style={{
                fontSize: 11.5,
                color: MUTED,
                textAlign: 'center',
                marginTop: 8,
              }}
            >
              Signed in as {user.email}
            </Text>
          )}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
      <AHTabBar active="profile" />
    </AHScreen>
  );
}
