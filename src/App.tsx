import { Fragment } from 'react';
import { NavProvider, useNav, type ScreenId } from './nav';
import { SCREENS } from './screens';
import { IOSDevice } from './components/IOSDevice';
import { themeVars, AH_BRAND_FONT } from './theme';

const SECTIONS = ['Welcome', 'About you', 'Your businesses', 'The app'] as const;

function ScreenRail() {
  const nav = useNav();
  const ids = Object.keys(SCREENS) as ScreenId[];
  return (
    <div
      className="ah-scroll"
      style={{
        width: 230,
        flexShrink: 0,
        alignSelf: 'stretch',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#fff',
        borderRadius: 22,
        boxShadow: '0 24px 60px -30px rgba(20,20,40,0.35)',
        padding: '20px 14px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontFamily: AH_BRAND_FONT, fontWeight: 800, fontSize: 26, letterSpacing: -0.5, padding: '0 8px' }}>
        aihoni<span style={{ color: 'var(--ah-orange)' }}>.</span>
      </div>
      <div style={{ fontSize: 12, color: '#8A8A8E', padding: '2px 8px 14px' }}>Signup flow · prototype</div>

      {SECTIONS.map((section) => (
        <Fragment key={section}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#A8A8AC', padding: '12px 8px 6px' }}>
            {section}
          </div>
          {ids
            .filter((id) => SCREENS[id].section === section)
            .map((id) => {
              const on = id === nav.current;
              return (
                <div
                  key={id}
                  onClick={() => nav.go(id)}
                  style={{
                    fontSize: 13,
                    fontWeight: on ? 700 : 500,
                    color: on ? '#fff' : '#3a3a40',
                    background: on ? '#1B1B1F' : 'transparent',
                    borderRadius: 10,
                    padding: '8px 9px',
                    cursor: 'pointer',
                    marginBottom: 1,
                  }}
                >
                  {SCREENS[id].label}
                </div>
              );
            })}
        </Fragment>
      ))}
    </div>
  );
}

function DeviceStage() {
  const nav = useNav();
  const meta = SCREENS[nav.current];
  const Screen = meta.Comp;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 36 }}>
        {nav.canGoBack && (
          <button
            onClick={nav.back}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: '#fff',
              borderRadius: 99,
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: 600,
              color: '#1B1B1F',
              boxShadow: '0 6px 18px -10px rgba(20,20,40,0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M14 6l-6 6 6 6" stroke="#1B1B1F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
        )}
        <span style={{ fontSize: 13, fontWeight: 600, color: '#5a5a62' }}>
          {meta.section} · <span style={{ color: '#1B1B1F' }}>{meta.label}</span>
        </span>
      </div>
      <IOSDevice dark={meta.dark}>
        <Screen />
      </IOSDevice>
    </div>
  );
}

export default function App() {
  return (
    <NavProvider>
      <div className="ah-stage" style={{ ...(themeVars as React.CSSProperties), gap: 28 }}>
        <ScreenRail />
        <DeviceStage />
      </div>
    </NavProvider>
  );
}
