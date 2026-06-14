import { ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  type PressableStateCallbackType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import {
  ACCENT,
  INK,
  MUTED,
  FAINT,
  LINE,
  LINE2,
  BG_SOFT,
  BG,
  ACCENT_SOFT,
  AH_FONT,
  AH_BRAND_FONT,
} from '../theme';
import { useNav, type ScreenId } from '../nav';

// Shared Android ripple config — subtle dark ripple, borderless when used on icons.
export const RIPPLE = { color: 'rgba(0,0,0,0.10)', borderless: false } as const;
export const RIPPLE_LIGHT = { color: 'rgba(255,255,255,0.18)', borderless: false } as const;
export const RIPPLE_ICON = { color: 'rgba(0,0,0,0.12)', borderless: true, radius: 22 } as const;

// Pressed-opacity for iOS (Android gets ripple). Use as a style function.
export const pressedOpacity =
  (base: object = {}, opacity = 0.65) =>
  ({ pressed }: PressableStateCallbackType) =>
    [base, pressed && Platform.OS === 'ios' ? { opacity } : null];

export function AHScreen({
  children,
  pad = true,
  style = {},
}: {
  children: ReactNode;
  pad?: boolean;
  style?: object;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.screen,
        pad && {
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 20),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function AHHeader({
  title,
  subtitle,
  back,
  right,
  bg = '#fff',
  large = false,
}: {
  title?: string | ReactNode;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
  bg?: string;
  large?: boolean;
}) {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 10,
        paddingHorizontal: 18,
        paddingBottom: 10,
        backgroundColor: bg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      {back && (
        <Pressable
          onPress={nav.back}
          hitSlop={10}
          android_ripple={RIPPLE_ICON}
          style={pressedOpacity({
            width: 36,
            height: 36,
            marginLeft: -8,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
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
      )}
      <View style={{ flex: 1 }}>
        {typeof title === 'string' ? (
          <Text
            style={{
              fontSize: large ? 26 : 17,
              fontWeight: large ? '800' : '700',
              letterSpacing: large ? -0.5 : -0.2,
              color: INK,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        ) : (
          title
        )}
        {subtitle ? (
          <Text style={{ fontSize: 11.5, color: MUTED, marginTop: 1 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          {right}
        </View>
      ) : null}
    </View>
  );
}

export function AHProgress({
  step,
  total = 5,
}: {
  step: number;
  total?: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        marginBottom: 12,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            borderRadius: 99,
            width: i === step ? 22 : 6,
            backgroundColor:
              i === step
                ? INK
                : i < step
                  ? 'rgba(27,27,31,0.45)'
                  : LINE2,
          }}
        />
      ))}
    </View>
  );
}

export function AHTitle({
  np,
  en,
  sub,
  align = 'left',
}: {
  np?: string;
  en: string;
  sub?: string;
  align?: 'left' | 'center';
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      {np && (
        <Text
          style={{
            fontFamily: AH_FONT,
            fontSize: 14,
            fontWeight: '600',
            color: INK,
            marginBottom: 3,
            textAlign: align,
          }}
        >
          {np}
        </Text>
      )}
      <Text
        style={{
          fontSize: 25,
          fontWeight: '700',
          letterSpacing: -0.5,
          lineHeight: 29,
          color: INK,
          textAlign: align,
        }}
      >
        {en}
      </Text>
      {sub && (
        <Text
          style={{
            fontSize: 14,
            lineHeight: 20,
            color: MUTED,
            marginTop: 6,
            textAlign: align,
          }}
        >
          {sub}
        </Text>
      )}
    </View>
  );
}

type ButtonKind = 'primary' | 'orange' | 'outline' | 'dark' | 'ghost';

export function AHButton({
  children,
  kind = 'primary',
  icon,
  style = {},
  onClick,
  disabled,
}: {
  children: ReactNode;
  kind?: ButtonKind;
  icon?: ReactNode;
  style?: object;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const kindStyles: Record<ButtonKind, object> = {
    primary: { backgroundColor: INK },
    orange: { backgroundColor: INK },
    outline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: LINE2 },
    dark: { backgroundColor: INK },
    ghost: { backgroundColor: 'transparent' },
  };
  const textColors: Record<ButtonKind, string> = {
    primary: '#fff',
    orange: '#fff',
    outline: INK,
    dark: '#fff',
    ghost: MUTED,
  };
  const isGhost = kind === 'ghost';
  const isLight = kind === 'outline' || kind === 'ghost';
  return (
    <Pressable
      onPress={onClick}
      disabled={disabled}
      android_ripple={isLight ? RIPPLE : RIPPLE_LIGHT}
      style={({ pressed }) => [
        styles.button,
        kindStyles[kind],
        isGhost && { minHeight: 40 },
        style,
        disabled && { opacity: 0.45 },
        pressed && Platform.OS === 'ios' ? { opacity: isLight ? 0.55 : 0.82, transform: [{ scale: 0.985 }] } : null,
      ]}
    >
      {icon && <View style={{ marginRight: 6 }}>{icon}</View>}
      <Text
        style={{
          fontSize: 15.5,
          fontWeight: '600',
          fontFamily: AH_FONT,
          color: textColors[kind],
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function AHField({
  label,
  value,
  placeholder,
  trailing,
  onPress,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  trailing?: ReactNode;
  onPress?: () => void;
}) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontSize: 13, fontWeight: '600', color: MUTED }}>
        {label}
      </Text>
      <Pressable
        onPress={onPress}
        android_ripple={RIPPLE}
        style={({ pressed }) => [
          {
            minHeight: 46,
            borderRadius: 14,
            backgroundColor: '#fff',
            borderWidth: 1.5,
            borderColor: pressed ? ACCENT : value ? INK : LINE2,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            gap: 10,
          },
          pressed && Platform.OS === 'ios' ? { backgroundColor: BG_SOFT } : null,
        ]}
      >
        <Text
          style={{ flex: 1, fontSize: 15.5, color: value ? INK : FAINT }}
        >
          {value || placeholder}
        </Text>
        {trailing}
      </Pressable>
    </View>
  );
}

export function AHOrb({
  size = 150,
  mic = true,
}: {
  size?: number;
  mic?: boolean;
}) {
  const emberSize = size * 0.28;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#232328',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 18,
        elevation: 10,
      }}
    >
      <View
        style={{
          position: 'absolute',
          right: size * 0.12,
          bottom: size * 0.14,
          width: emberSize,
          height: emberSize,
          borderRadius: emberSize / 2,
          backgroundColor: ACCENT,
          shadowColor: ACCENT,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.75,
          shadowRadius: 10,
        }}
      />
      {mic && (
        <Svg
          width={size * 0.3}
          height={size * 0.3}
          viewBox="0 0 24 24"
          fill="none"
        >
          <Rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
          <Path
            d="M6 11.5a6 6 0 0 0 12 0"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M12 17.5V21"
            stroke="#fff"
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      )}
    </View>
  );
}

export function AHWave({
  color = ACCENT,
  n = 14,
}: {
  color?: string;
  n?: number;
}) {
  const hs = [10, 18, 26, 16, 34, 22, 40, 28, 38, 18, 26, 14, 20, 10];
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center',
        height: 44,
        justifyContent: 'center',
      }}
    >
      {hs.slice(0, n).map((h, i) => (
        <View
          key={i}
          style={{
            width: 4.5,
            height: h,
            borderRadius: 99,
            backgroundColor: color,
            opacity: 0.4 + h / 60,
          }}
        />
      ))}
    </View>
  );
}

export function AHOptionCard({
  title,
  sub,
  selected,
  glyph,
  badge,
  onPress,
}: {
  title: string;
  sub?: string;
  selected?: boolean;
  glyph?: string;
  badge?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={RIPPLE}
      style={({ pressed }) => [
        {
          borderRadius: 18,
          padding: 14,
          paddingHorizontal: 16,
          backgroundColor: selected ? BG_SOFT : '#fff',
          borderWidth: 2,
          borderColor: selected ? INK : LINE2,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        },
        pressed && Platform.OS === 'ios' ? { opacity: 0.75 } : null,
      ]}
    >
      {glyph && (
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            flexShrink: 0,
            backgroundColor: selected ? INK : BG_SOFT,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 21,
              color: selected ? '#fff' : MUTED,
              fontFamily: AH_BRAND_FONT,
            }}
          >
            {glyph}
          </Text>
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: INK }}>
            {title}
          </Text>
          {badge && (
            <View
              style={{
                backgroundColor: ACCENT_SOFT,
                borderRadius: 99,
                paddingHorizontal: 9,
                paddingVertical: 3,
              }}
            >
              <Text
                style={{ fontSize: 10.5, fontWeight: '700', color: ACCENT }}
              >
                {badge}
              </Text>
            </View>
          )}
        </View>
        {sub && (
          <Text
            style={{
              fontSize: 12.5,
              color: MUTED,
              marginTop: 2,
              lineHeight: 17,
            }}
          >
            {sub}
          </Text>
        )}
      </View>
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          flexShrink: 0,
          borderWidth: selected ? 0 : 2,
          borderColor: LINE2,
          backgroundColor: selected ? INK : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {selected && (
          <Svg width={12} height={10} viewBox="0 0 12 10">
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
}

export function AHChip({
  children,
  selected,
  color,
  onPress,
}: {
  children: ReactNode;
  selected?: boolean;
  color?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      android_ripple={RIPPLE}
      style={({ pressed }) => [
        {
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 99,
          backgroundColor: selected ? INK : '#fff',
          borderWidth: 1.5,
          borderColor: selected ? INK : LINE2,
        },
        pressed && Platform.OS === 'ios' ? { opacity: 0.7 } : null,
      ]}
    >
      <Text
        style={{
          fontSize: 13.5,
          fontWeight: '600',
          color: selected ? '#fff' : color || INK,
        }}
      >
        {children}
      </Text>
    </Pressable>
  );
}

export function AHWordmark({
  size = 34,
  light = false,
}: {
  size?: number;
  light?: boolean;
}) {
  return (
    <Text
      style={{
        fontFamily: AH_BRAND_FONT,
        fontWeight: '700',
        fontSize: size,
        letterSpacing: -0.5,
        color: light ? '#fff' : INK,
      }}
    >
      {'aihoni'}
      <Text style={{ color: ACCENT }}>{'.'}</Text>
    </Text>
  );
}

export function AHCoin({ size = 22 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        flexShrink: 0,
        backgroundColor: ACCENT,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          fontFamily: AH_BRAND_FONT,
          fontWeight: '800',
          color: '#fff',
          fontSize: size * 0.52,
        }}
      >
        P
      </Text>
    </View>
  );
}

export function AHTabIcon({ id, on, size = 26 }: { id: string; on: boolean; size?: number }) {
  // Snapchat-style: all icons outline-only, accent color when active, ink when idle.
  const color = on ? ACCENT : INK;
  const sw = on ? 2.1 : 1.9;
  const stroke = {
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
  switch (id) {
    case 'chat':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M12 3.5c5 0 8.5 3.2 8.5 7.4 0 4.2-3.5 7.4-8.5 7.4-.9 0-1.8-.1-2.6-.3l-3.8 1.9c-.6.3-1.2-.3-1-.9l1-3A6.9 6.9 0 0 1 3.5 11C3.5 6.7 7 3.5 12 3.5z"
            {...stroke}
          />
        </Svg>
      );
    case 'camera':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path
            d="M4 8.5A2.5 2.5 0 0 1 6.5 6h.9l.7-1.3A1.4 1.4 0 0 1 9.3 4h5.4a1.4 1.4 0 0 1 1.2.7L16.6 6h.9A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"
            {...stroke}
          />
          <Circle cx={12} cy={12.2} r={3.3} {...stroke} />
        </Svg>
      );
    case 'reels':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.5" {...stroke} />
          <Path
            d="M10.3 9.2c-.4-.2-.9 0-.9.5v4.6c0 .5.5.7.9.5l3.7-2.3c.4-.2.4-.8 0-1z"
            {...stroke}
            fill={on ? color : 'none'}
          />
        </Svg>
      );
    case 'feed':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Rect x="3.5" y="7" width="17" height="13.5" rx="3.5" {...stroke} />
          <Path d="M7 4h10" stroke={color} strokeWidth={sw} strokeLinecap="round" opacity={0.65} />
        </Svg>
      );
    default: // profile
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Circle cx={12} cy={8} r={3.6} {...stroke} />
          <Path d="M5.2 19.5a6.8 6.8 0 0 1 13.6 0" {...stroke} />
        </Svg>
      );
  }
}

export function AHTabBar({ active = 'chat' }: { active?: string }) {
  const nav = useNav();
  const insets = useSafeAreaInsets();
  const tabs: Array<[string, ScreenId]> = [
    ['chat', 'chats'],
    ['feed', 'feed'],
    ['camera', 'snap'],
    ['reels', 'reels'],
    ['profile', 'profile'],
  ];
  return (
    <View
      style={{
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 6,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        {tabs.map(([id, target]) => {
          const on = id === active;
          return (
            <Pressable
              key={id}
              onPress={() => nav.go(target)}
              android_ripple={{ color: 'rgba(0,0,0,0.08)', borderless: true, radius: 28 }}
              style={({ pressed }) => [
                {
                  flex: 1,
                  alignItems: 'center',
                  paddingTop: 8,
                  paddingBottom: 8,
                  gap: 4,
                },
                pressed && Platform.OS === 'ios' ? { opacity: 0.55, transform: [{ scale: 0.92 }] } : null,
              ]}
            >
              <AHTabIcon id={id} on={on} size={26} />
              <View
                style={{
                  width: 18,
                  height: 3,
                  borderRadius: 2,
                  backgroundColor: on ? ACCENT : 'transparent',
                }}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function AHChatInput({
  placeholder = 'Type a message',
  reply = false,
}: {
  placeholder?: string;
  reply?: boolean;
}) {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        paddingHorizontal: 14,
        paddingBottom: 22,
        paddingTop: reply ? 6 : 8,
        gap: 7,
      }}
    >
      {reply && (
        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 14,
            padding: 9,
            paddingLeft: 18,
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 6,
            elevation: 2,
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 7,
              top: 9,
              bottom: 9,
              width: 4,
              borderRadius: 99,
              backgroundColor: ACCENT,
            }}
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, fontWeight: '800', color: ACCENT }}>
              Replying to Sunita
            </Text>
            <Text
              style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}
              numberOfLines={1}
            >
              {'राम्रो! एक केजी राख्नुहोला।'}
            </Text>
          </View>
          <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <Path
              d="M6 6l12 12M18 6L6 18"
              stroke={MUTED}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </Svg>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Pressable
          android_ripple={RIPPLE}
          style={pressedOpacity(
            {
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 9,
              backgroundColor: '#fff',
              borderRadius: 99,
              paddingHorizontal: 9,
              paddingVertical: 7,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            },
            0.75,
          )}
        >
          <Pressable
            android_ripple={RIPPLE_ICON}
            style={pressedOpacity({
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: ACCENT_SOFT,
              justifyContent: 'center',
              alignItems: 'center',
            })}
          >
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
              <Path
                d="M21 12l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13.5 4.4a3.5 3.5 0 1 1 4.9 4.9l-8.5 8.5a1.5 1.5 0 1 1-2.1-2.1L15 8"
                stroke={ACCENT}
                strokeWidth={1.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <Text style={{ flex: 1, fontSize: 14.5, color: MUTED }}>
            {placeholder}
          </Text>
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={12} r={9} stroke={FAINT} strokeWidth={1.7} />
            <Circle cx={9} cy={10} r={1.2} fill={FAINT} />
            <Circle cx={15} cy={10} r={1.2} fill={FAINT} />
            <Path
              d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"
              stroke={FAINT}
              strokeWidth={1.6}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Pressable>
        <Pressable
          android_ripple={RIPPLE_LIGHT}
          style={({ pressed }) => [
            {
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: INK,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
            },
            pressed && Platform.OS === 'ios' ? { opacity: 0.82, transform: [{ scale: 0.95 }] } : null,
          ]}
        >
          <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
            <Rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
            <Path
              d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: BG,
  },
  button: {
    minHeight: 48,
    borderRadius: 99,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    paddingHorizontal: 18,
  },
});
