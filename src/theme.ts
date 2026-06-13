// theme.ts — aihoni design tokens.
// These mirror the CSS variables the original prototype set on its canvas
// wrapper (driven by the design tool's "Tweaks" panel). The system is:
// white background w/ a subtle dot pattern, Poppins type, charcoal #1B1B1F
// primaries, neutral greys, and a single blue accent (#3B76EF).

export const ACCENT = '#3B76EF';

export const AH_FONT =
  "'Poppins', -apple-system, system-ui, 'Helvetica Neue', sans-serif";
export const AH_BRAND_FONT = "'Baloo 2', -apple-system, system-ui, sans-serif";

// CSS custom properties applied to the app root so var()/color-mix() resolve.
// Typed loosely because custom properties aren't part of React.CSSProperties.
export const themeVars: Record<string, string> = {
  '--ah-blue': ACCENT,
  '--ah-orange': ACCENT, // historically two tokens; both resolve to the accent
  '--ah-ink': '#1B1B1F',
  '--ah-muted': '#8A8A8E',
  '--ah-bg':
    'radial-gradient(circle at 1px 1px, rgba(20,20,25,0.045) 1px, transparent 0) 0 0 / 17px 17px, #FFFFFF',
  '--ah-bg-solid': '#FFFFFF',
  '--ah-bg-pattern2':
    'radial-gradient(circle at 1px 1px, rgba(20,20,25,0.06) 1px, transparent 0) 0 0 / 17px 17px, #F6F6F6',
  '--ah-bg-soft': '#F6F6F6',
  '--ah-card': '#FFFFFF',
  '--ah-line': '#EFECEC',
  '--ah-line2': '#E6E6E6',
  '--ah-faint': '#A8A8AC',
  '--ah-blue-soft': '#F6F6F6',
  '--ah-blue-soft2': '#E6E6E6',
  '--ah-orange-soft': `color-mix(in oklch, ${ACCENT} 12%, white)`,
  '--ah-shadow-sm': '0 1px 3px rgba(20,20,25,0.06)',
  '--ah-shadow-md': '0 6px 18px -10px rgba(20,20,25,0.14)',
  '--ah-shadow-lg': '0 14px 34px -16px rgba(20,20,25,0.18)',
  '--ah-btn-radius': '99px',
};
