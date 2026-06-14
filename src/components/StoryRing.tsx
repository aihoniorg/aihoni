import { View, Text } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { LINE2, ACCENT, AH_BRAND_FONT } from '../theme';

export function AHStoryRing({
  size = 62,
  glyph,
  color,
  add,
  kind = 'person',
  seen,
}: {
  size?: number;
  glyph?: string;
  color?: string;
  add?: boolean;
  kind?: 'person' | 'business';
  seen?: boolean;
  label?: string;
  photo?: string;
}) {
  const ringColor = add ? '#C9C9CE' : seen ? LINE2 : ACCENT;
  const ringWidth = seen ? 2 : 1.5;
  const innerSize = size - 8;
  const fontSize = Math.round(innerSize * 0.38);

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        padding: 3,
        borderWidth: ringWidth,
        borderStyle: add ? 'dashed' : 'solid',
        borderColor: ringColor,
        flexShrink: 0,
      }}
    >
      <View
        style={{
          width: '100%',
          height: '100%',
          borderRadius: size / 2,
          backgroundColor: glyph && color ? color + '30' : '#F1F1F2',
          alignItems: 'center',
          justifyContent: glyph && !add ? 'center' : 'flex-end',
          overflow: 'hidden',
        }}
      >
        {glyph && !add ? (
          <Text style={{ color: color || ACCENT, fontFamily: AH_BRAND_FONT, fontWeight: '800', fontSize }}>
            {glyph}
          </Text>
        ) : kind === 'business' ? (
          <Svg width="56%" height="56%" viewBox="0 0 24 24" fill="none">
            <Path
              d="M4 9l1.5-4h13L20 9v1.5a2.4 2.4 0 0 1-4 1.8 2.4 2.4 0 0 1-4 0 2.4 2.4 0 0 1-4 0 2.4 2.4 0 0 1-4-1.8zM5.5 12.5V20h13v-7.5"
              stroke="#C4C4C8"
              strokeWidth={1.7}
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        ) : (
          <Svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
            <Circle cx={12} cy={8.5} r={4} fill="#C4C4C8" />
            <Path d="M4.5 20.5a7.5 7.5 0 0 1 15 0z" fill="#C4C4C8" />
          </Svg>
        )}
      </View>
      {add && (
        <View
          style={{
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#1B1B1F',
            borderWidth: 2.5,
            borderColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: '600',
              lineHeight: 16,
            }}
          >
            +
          </Text>
        </View>
      )}
    </View>
  );
}
