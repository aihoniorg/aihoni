import { useState } from 'react';
import { View, Text, Pressable, Image, TextInput, Alert } from 'react-native';
import { AHScreen, AHHeader, AHTitle, AHChip, AHButton, RIPPLE, pressedOpacity } from '../components/ui';
import { MUTED, ACCENT, ACCENT_SOFT, LINE2, BG_SOFT, INK, FAINT } from '../theme';
import { useNav } from '../nav';
import { pickAndUploadImage } from '../imageUpload';
import { api, ApiError } from '../apiClient';
import { useBusiness } from '../business';
import Svg, { Path } from 'react-native-svg';

const TYPES: string[] = [
  'किराना · Grocery',
  'कपडा · Clothing',
  'खाजा घर · Restaurant',
  'फार्मेसी · Pharmacy',
  'सैलुन · Salon',
  'मोबाइल · Mobile',
  'Electronics',
  'श्रृंगार · Cosmetics',
  'हार्डवेयर · Hardware',
  'स्टेशनरी · Stationery',
  'क्लिनिक · Clinic',
  'कृषि · Agro',
  'सेवा · Services',
  'खानेपानी · Water',
  'Other',
];

// 07 · Add a business — logo upload + name + a 15-category type grid.
export function AddBusiness() {
  const nav = useNav();
  const { setCurrentId, refresh } = useBusiness();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoKey, setLogoKey] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<string>(TYPES[0]);
  const [saving, setSaving] = useState(false);

  const pickLogo = async () => {
    setUploading(true);
    try {
      const media = await pickAndUploadImage({ aspect: [1, 1], quality: 0.85 });
      if (media) {
        setLogoUrl(media.url);
        setLogoKey(media.key);
      }
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (!name.trim()) {
      Alert.alert('Name required', 'Give your business a name.');
      return;
    }
    setSaving(true);
    try {
      const { business } = await api<{ business: { id: string } }>('/api/businesses', {
        method: 'POST',
        body: { name: name.trim(), type, logo_key: logoKey },
      });
      setCurrentId(business.id);
      void refresh();
      nav.go('businessDetails');
    } catch (e) {
      Alert.alert(
        'Could not save',
        e instanceof ApiError && e.status === 401
          ? 'Sign in to add a business.'
          : String((e as Error).message ?? e),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AHScreen pad={false}>
      <AHHeader title="Add a business" back />
      <View style={{ flex: 1, paddingHorizontal: 20, paddingBottom: 20 }}>
        <AHTitle
          np="व्यापार थप्नुहोस्"
          en="Tell us about your business"
          sub="Give it a name and a type — you can add more later."
        />
        <View style={{ flexDirection: 'column', gap: 16 }}>
          <View style={{ alignItems: 'center', marginTop: 4 }}>
            <Pressable
              onPress={pickLogo}
              disabled={uploading}
              android_ripple={RIPPLE}
              style={pressedOpacity({
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: logoUrl ? '#fff' : BG_SOFT,
                borderWidth: 1.5,
                borderColor: logoUrl ? ACCENT_SOFT : LINE2,
                borderStyle: logoUrl ? 'solid' : 'dashed',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                opacity: uploading ? 0.6 : 1,
              })}
            >
              {logoUrl ? (
                <Image source={{ uri: logoUrl }} style={{ width: '100%', height: '100%' }} />
              ) : (
                <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 7h3l2-2h6l2 2h3v12H4z"
                    stroke={ACCENT}
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Path
                    d="M12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
                    stroke={ACCENT}
                    strokeWidth={1.8}
                  />
                </Svg>
              )}
            </Pressable>
            <Text style={{ fontSize: 12, color: MUTED, marginTop: 6 }}>
              {uploading ? 'Uploading…' : logoUrl ? 'Tap to change logo' : 'Add a logo'}
            </Text>
          </View>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: MUTED }}>
              Business name
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Shrestha Kirana Pasal"
              placeholderTextColor={FAINT}
              style={{
                minHeight: 46,
                borderRadius: 14,
                backgroundColor: '#fff',
                borderWidth: 1.5,
                borderColor: name ? INK : LINE2,
                paddingHorizontal: 15,
                fontSize: 15.5,
                color: INK,
              }}
            />
          </View>
          <View style={{ flexDirection: 'column', gap: 8 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: MUTED }}>
              Business type
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {TYPES.map((t) => (
                <AHChip key={t} selected={t === type} onPress={() => setType(t)}>
                  {t}
                </AHChip>
              ))}
            </View>
          </View>
        </View>
        <View style={{ flex: 1 }} />
        <AHButton kind="primary" onClick={submit}>
          {saving ? 'Saving…' : 'Continue'}
        </AHButton>
        <AHButton kind="ghost" onClick={nav.back}>
          Cancel
        </AHButton>
      </View>
    </AHScreen>
  );
}
