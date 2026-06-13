import type { CSSProperties } from 'react';

// Stand-in for the design tool's <image-slot> custom element. In the prototype
// these were drag-and-drop media targets; here they render a neutral
// placeholder with the original prompt text so layouts stay faithful.
export function ImageSlot({
  shape = 'rect',
  placeholder = '',
  style = {},
}: {
  shape?: 'rect' | 'circle';
  placeholder?: string;
  style?: CSSProperties;
}) {
  const label = placeholder.trim();
  return (
    <div
      style={{
        background: 'repeating-linear-gradient(45deg, #f3f3f5 0 10px, #ededf0 10px 20px)',
        color: '#9a9aa0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 600,
        padding: 8,
        boxSizing: 'border-box',
        borderRadius: shape === 'circle' ? '50%' : undefined,
        ...style,
      }}
    >
      {label && <span style={{ opacity: 0.8, lineHeight: 1.3 }}>{label}</span>}
    </div>
  );
}
