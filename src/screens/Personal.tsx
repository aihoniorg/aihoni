import { View, Text } from 'react-native';
import { AHScreen, AHProgress, AHTitle, AHField, AHButton } from '../components/ui';
import { INK, BG_SOFT, MUTED } from '../theme';
import { useNav } from '../nav';
import { useAuth } from '../auth';

// 04 · Personal info — kept clearly separate from business data.
export function Personal() {
  const nav = useNav();
  const { user } = useAuth();
  // Pre-fill from the Google profile if we have one; otherwise sample placeholders.
  const prefillName = user?.name ?? 'Sunita Shrestha';
  return (
    <AHScreen>
      <AHProgress step={2} />
      <AHTitle
        np="तपाईंको बारेमा"
        en="About you"
        sub="Just the basics. Your personal details stay private — and separate from your stores."
      />
      <View style={{ flexDirection: 'column', gap: 16 }}>
        <AHField label="Full name" value={prefillName} />
        <AHField
          label="Mobile number"
          value="+977 98XXXXXXXX"
          trailing={
            <View
              style={{
                backgroundColor: BG_SOFT,
                borderRadius: 99,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{ fontSize: 12.5, fontWeight: '700', color: INK }}
              >
                Verify
              </Text>
            </View>
          }
        />
        <AHField label="District (optional)" placeholder="e.g. Lalitpur" />
      </View>
      <View
        style={{
          marginTop: 18,
          flexDirection: 'row',
          gap: 10,
          alignItems: 'flex-start',
          backgroundColor: BG_SOFT,
          borderRadius: 16,
          padding: 15,
        }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: INK,
            marginTop: 5,
            flexShrink: 0,
          }}
        />
        <Text
          style={{ fontSize: 13.5, lineHeight: 20, color: INK, flex: 1 }}
        >
          <Text style={{ fontWeight: '700' }}>{'निजी रहन्छ।'}</Text>
          {' aihoni keeps personal and business information in separate spaces.'}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={nav.next}>
        Continue
      </AHButton>
    </AHScreen>
  );
}
