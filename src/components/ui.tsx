import type { CSSProperties, ReactNode } from 'react';
import { AH_BRAND_FONT, AH_FONT } from '../theme';
import { useNav, type ScreenId } from '../nav';

// ── Screen shell: padding under the status bar, flex column ──
export function AHScreen({
  children,
  pad = true,
  style = {},
}: {
  children: ReactNode;
  pad?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: pad ? '52px 20px 20px' : 0,
        fontFamily: AH_FONT,
        color: 'var(--ah-ink)',
        background: 'var(--ah-bg)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Progress dots ──
export function AHProgress({ step, total = 9 }: { step: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 12 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            height: 6,
            borderRadius: 99,
            width: i === step ? 22 : 6,
            background:
              i === step ? '#1B1B1F' : i < step ? 'rgba(27,27,31,0.45)' : 'var(--ah-line2)',
            transition: 'all .2s',
          }}
        />
      ))}
    </div>
  );
}

// ── Headline + sub ──
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
    <div style={{ textAlign: align, marginBottom: 12 }}>
      {np && (
        <div
          style={{
            fontFamily: AH_FONT,
            fontSize: 14,
            fontWeight: 600,
            color: 'var(--ah-ink)',
            marginBottom: 3,
            letterSpacing: 0.2,
          }}
        >
          {np}
        </div>
      )}
      <div style={{ fontSize: 25, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.15 }}>{en}</div>
      {sub && (
        <div style={{ fontSize: 14, lineHeight: 1.4, color: 'var(--ah-muted)', marginTop: 6 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

type ButtonKind = 'primary' | 'orange' | 'outline' | 'dark' | 'ghost';

// ── Buttons ──
export function AHButton({
  children,
  kind = 'primary',
  icon,
  style = {},
  onClick,
}: {
  children: ReactNode;
  kind?: ButtonKind;
  icon?: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  const base: CSSProperties = {
    minHeight: 48,
    borderRadius: 'var(--ah-btn-radius)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    fontSize: 15.5,
    fontWeight: 600,
    fontFamily: AH_FONT,
    cursor: 'pointer',
    boxSizing: 'border-box',
    padding: '0 18px',
    userSelect: 'none',
  };
  const kinds: Record<ButtonKind, CSSProperties> = {
    primary: { background: '#1B1B1F', color: '#fff' },
    orange: { background: '#1B1B1F', color: '#fff' },
    outline: { background: '#fff', color: 'var(--ah-ink)', border: '1.5px solid var(--ah-line2)' },
    dark: { background: '#1B1B1F', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--ah-muted)', minHeight: 40, fontWeight: 500 },
  };
  return (
    <div onClick={onClick} style={{ ...base, ...kinds[kind], ...style }}>
      {icon}
      {children}
    </div>
  );
}

// ── Text field (static mock) ──
export function AHField({
  label,
  value,
  placeholder,
  trailing,
}: {
  label: string;
  value?: string;
  placeholder?: string;
  trailing?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ah-muted)' }}>{label}</div>
      <div
        style={{
          minHeight: 46,
          borderRadius: 14,
          background: '#fff',
          border: value ? '1.5px solid #1B1B1F' : '1.5px solid var(--ah-line2)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 15px',
          gap: 10,
          fontSize: 15.5,
          color: value ? 'var(--ah-ink)' : 'var(--ah-faint)',
        }}
      >
        <span style={{ flex: 1 }}>{value || placeholder}</span>
        {trailing}
      </div>
    </div>
  );
}

// ── Voice orb — dark charcoal sphere with an accent ember ──
export function AHOrb({ size = 150, mic = true }: { size?: number; mic?: boolean }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        position: 'relative',
        background: 'radial-gradient(circle at 34% 26%, #43434B 0%, #232328 52%, #131316 100%)',
        boxShadow:
          '0 18px 44px -14px rgba(20,12,4,0.5), inset 0 -8px 24px rgba(0,0,0,0.28), inset 0 2px 3px rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {/* accent ember */}
      <div
        style={{
          position: 'absolute',
          right: '15%',
          bottom: '17%',
          width: size * 0.28,
          height: size * 0.28,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 35% 32%, color-mix(in oklch, var(--ah-orange) 55%, white), var(--ah-orange))',
          boxShadow:
            '0 0 22px color-mix(in oklch, var(--ah-orange) 75%, transparent), 0 0 0 4px color-mix(in oklch, var(--ah-orange) 18%, transparent)',
        }}
      />
      {mic && (
        <svg width={size * 0.3} height={size * 0.3} viewBox="0 0 24 24" fill="none">
          <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
          <path d="M6 11.5a6 6 0 0 0 12 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M12 17.5V21" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

// ── Sound wave bars ──
export function AHWave({ color = 'var(--ah-orange)', n = 14 }: { color?: string; n?: number }) {
  const hs = [10, 18, 26, 16, 34, 22, 40, 28, 38, 18, 26, 14, 20, 10];
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'center', height: 44, justifyContent: 'center' }}>
      {hs.slice(0, n).map((h, i) => (
        <div
          key={i}
          style={{ width: 4.5, height: h, borderRadius: 99, background: color, opacity: 0.4 + h / 60 }}
        />
      ))}
    </div>
  );
}

// ── Selectable option card ──
export function AHOptionCard({
  title,
  sub,
  selected,
  glyph,
  badge,
}: {
  title: string;
  sub?: string;
  selected?: boolean;
  glyph?: string;
  badge?: string;
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: '14px 16px',
        background: selected ? 'var(--ah-bg-soft)' : '#fff',
        border: selected ? '2px solid #1B1B1F' : '2px solid var(--ah-line2)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        position: 'relative',
      }}
    >
      {glyph && (
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 13,
            flexShrink: 0,
            background: selected ? '#1B1B1F' : 'var(--ah-bg-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 21,
            color: selected ? '#fff' : 'var(--ah-muted)',
            fontFamily: AH_BRAND_FONT,
            fontWeight: 700,
          }}
        >
          {glyph}
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          {title}
          {badge && (
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                color: 'var(--ah-orange)',
                background: 'var(--ah-orange-soft)',
                borderRadius: 99,
                padding: '3px 9px',
              }}
            >
              {badge}
            </span>
          )}
        </div>
        {sub && (
          <div style={{ fontSize: 12.5, color: 'var(--ah-muted)', marginTop: 2, lineHeight: 1.35 }}>
            {sub}
          </div>
        )}
      </div>
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          flexShrink: 0,
          border: selected ? 'none' : '2px solid var(--ah-line2)',
          background: selected ? '#1B1B1F' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {selected && (
          <svg width="12" height="10" viewBox="0 0 12 10">
            <path
              d="M1 5l3.2 3.4L11 1"
              stroke="#fff"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </div>
  );
}

// ── Small chip ──
export function AHChip({
  children,
  selected,
  color,
}: {
  children: ReactNode;
  selected?: boolean;
  color?: string;
}) {
  return (
    <div
      style={{
        padding: '8px 14px',
        borderRadius: 99,
        fontSize: 13.5,
        fontWeight: 600,
        background: selected ? '#1B1B1F' : '#fff',
        color: selected ? '#fff' : color || 'var(--ah-ink)',
        border: selected ? '1.5px solid #1B1B1F' : '1.5px solid var(--ah-line2)',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </div>
  );
}

// ── Brand wordmark ──
export function AHWordmark({ size = 34, light = false }: { size?: number; light?: boolean }) {
  return (
    <div
      style={{
        fontFamily: AH_BRAND_FONT,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: -0.5,
        color: light ? '#fff' : 'var(--ah-ink)',
        lineHeight: 1,
      }}
    >
      aihoni<span style={{ color: 'var(--ah-orange)' }}>.</span>
    </div>
  );
}

// ── Little points coin ──
export function AHCoin({ size = 22 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background:
          'linear-gradient(145deg, color-mix(in oklch, var(--ah-orange) 50%, white), var(--ah-orange))',
        boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.18), inset 0 2px 3px rgba(255,255,255,0.5)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: AH_BRAND_FONT,
        fontWeight: 800,
        color: '#fff',
        fontSize: size * 0.52,
      }}
    >
      P
    </span>
  );
}

// ── Smooth rounded tab icons ──
export function AHTabIcon({ id, on }: { id: string; on: boolean }) {
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  const fill = { fill: 'currentColor' };
  switch (id) {
    case 'chat':
      return on ? (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 3.5c5 0 8.5 3.2 8.5 7.4 0 4.2-3.5 7.4-8.5 7.4-.9 0-1.8-.1-2.6-.3l-3.8 1.9c-.6.3-1.2-.3-1-.9l1-3A6.9 6.9 0 0 1 3.5 11C3.5 6.7 7 3.5 12 3.5z"
            {...fill}
          />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 3.8c5 0 8.2 3.1 8.2 7.1s-3.2 7.1-8.2 7.1c-.9 0-1.8-.1-2.6-.3l-3.6 1.7 1-3A6.7 6.7 0 0 1 3.8 11C3.8 6.9 7 3.8 12 3.8z"
            {...stroke}
          />
        </svg>
      );
    case 'reels':
      return on ? (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="6" {...fill} />
          <path d="M10.2 8.7c-.5-.3-1.2 0-1.2.6v5.4c0 .6.7 1 1.2.6l4.3-2.7c.5-.3.5-1 0-1.3z" fill="#fff" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="6" {...stroke} />
          <path d="M10.3 9.2c-.4-.2-.9 0-.9.5v4.6c0 .5.5.7.9.5l3.7-2.3c.4-.2.4-.8 0-1z" {...fill} />
        </svg>
      );
    case 'feed':
      return on ? (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="7" width="18" height="14" rx="3.5" {...fill} />
          <rect x="6" y="3.5" width="12" height="2.4" rx="1.2" fill="currentColor" opacity="0.45" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <rect x="3.5" y="7" width="17" height="13.5" rx="3.5" {...stroke} />
          <path d="M7 4h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </svg>
      );
    case 'profile':
    default:
      return on ? (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" {...fill} />
          <path d="M4.5 20a7.5 7.5 0 0 1 15 0 1.2 1.2 0 0 1-1.2 1.2H5.7A1.2 1.2 0 0 1 4.5 20z" {...fill} />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="3.6" {...stroke} />
          <path d="M5.2 19.5a6.8 6.8 0 0 1 13.6 0" {...stroke} />
        </svg>
      );
  }
}

// ── Refined tab bar — flat bottom nav + floating center camera ──
export function AHTabBar({ active = 'chat' }: { active?: string }) {
  const nav = useNav();
  const tabs: Array<[string, string, ScreenId]> = [
    ['chat', 'Chat', 'chats'],
    ['feed', 'Feed', 'feed'],
    ['camera', '', 'snap'],
    ['reels', 'Reels', 'reels'],
    ['profile', 'Profile', 'profile'],
  ];
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: 24,
        background: '#fff',
        borderTop: '1px solid var(--ah-line)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
        {tabs.map(([id, label, target]) => {
          const on = id === active;
          const isCenter = id === 'camera';
          if (isCenter) {
            return (
              <div
                key={id}
                onClick={() => nav.go(target)}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  cursor: 'pointer',
                }}
              >
                <div
                  style={{
                    marginTop: -18,
                    width: 54,
                    height: 54,
                    borderRadius: '50%',
                    background: '#1B1B1F',
                    border: '3px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 20px -6px rgba(20,20,25,0.38)',
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 8.5A2.5 2.5 0 0 1 6.5 6h.9l.7-1.3A1.4 1.4 0 0 1 9.3 4h5.4a1.4 1.4 0 0 1 1.2.7L16.6 6h.9A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z"
                      stroke="#fff"
                      strokeWidth="1.9"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12.2" r="3.3" stroke="#fff" strokeWidth="1.9" />
                  </svg>
                </div>
              </div>
            );
          }
          return (
            <div
              key={id}
              onClick={() => nav.go(target)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                paddingTop: 10,
                cursor: 'pointer',
                color: on ? 'var(--ah-orange)' : 'var(--ah-faint)',
              }}
            >
              <AHTabIcon id={id} on={on} />
              <span style={{ fontSize: 10.5, fontWeight: on ? 700 : 500, letterSpacing: 0.1 }}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Shared chat input (soft-circle clip · emoji · mic) ──
export function AHChatInput({
  placeholder = 'Type a message',
  reply = false,
}: {
  placeholder?: string;
  reply?: boolean;
}) {
  return (
    <div
      style={{
        background: 'var(--ah-bg-solid)',
        padding: reply ? '6px 14px 22px' : '8px 14px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 7,
      }}
    >
      {reply && (
        <div
          style={{
            position: 'relative',
            background: '#fff',
            borderRadius: 14,
            padding: '9px 12px 9px 18px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            boxShadow: '0 2px 8px -4px rgba(20,20,25,0.15)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 7,
              top: 9,
              bottom: 9,
              width: 4,
              borderRadius: 99,
              background: 'var(--ah-orange)',
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--ah-orange)' }}>Replying to Sunita</div>
            <div
              style={{
                fontSize: 12.5,
                color: 'var(--ah-muted)',
                marginTop: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              राम्रो! एक केजी राख्नुहोला।
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="var(--ah-muted)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 9,
            background: '#fff',
            borderRadius: 99,
            padding: '7px 9px',
            boxShadow: '0 3px 12px -6px rgba(20,20,25,0.2)',
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: 'var(--ah-orange-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12l-8.5 8.5a5.5 5.5 0 0 1-7.8-7.8L13.5 4.4a3.5 3.5 0 1 1 4.9 4.9l-8.5 8.5a1.5 1.5 0 1 1-2.1-2.1L15 8"
                stroke="var(--ah-orange)"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span style={{ flex: 1, fontSize: 14.5, color: 'var(--ah-muted)' }}>{placeholder}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginRight: 4 }}>
            <circle cx="12" cy="12" r="9" stroke="var(--ah-faint)" strokeWidth="1.7" />
            <circle cx="9" cy="10" r="1.2" fill="var(--ah-faint)" />
            <circle cx="15" cy="10" r="1.2" fill="var(--ah-faint)" />
            <path
              d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"
              stroke="var(--ah-faint)"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: '#1B1B1F',
            boxShadow: '0 8px 18px -8px rgba(20,20,25,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="3" width="6" height="11" rx="3" fill="#fff" />
            <path d="M6 11.5a6 6 0 0 0 12 0M12 17.5V21" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
}
