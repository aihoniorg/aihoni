import { View, Text } from 'react-native';
import { AHScreen, AHHeader, AHTitle, AHField, AHChip, AHButton } from '../components/ui';
import { MUTED } from '../theme';
import { useNav } from '../nav';

// 07 · Add a business — name + a 15-category type grid.
export function AddBusiness() {
  const nav = useNav();
  const types: Array<[string, boolean]> = [
    ['किराना · Grocery', true],
    ['कपडा · Clothing', false],
    ['खाजा घर · Restaurant', false],
    ['फार्मेसी · Pharmacy', false],
    ['सैलुन · Salon', false],
    ['मोबाइल · Mobile', false],
    ['Electronics', false],
    ['श्रृंगार · Cosmetics', false],
    ['हार्डवेयर · Hardware', false],
    ['स्टेशनरी · Stationery', false],
    ['क्लिनिक · Clinic', false],
    ['कृषि · Agro', false],
    ['सेवा · Services', false],
    ['खानेपानी · Water', false],
    ['Other', false],
  ];

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
        <AHField label="Business name" value="Shrestha Kirana Pasal" />
        <View style={{ flexDirection: 'column', gap: 8 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '600', color: MUTED }}>
            Business type
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {types.map(([t, sel]) => (
              <AHChip key={t} selected={sel} onPress={() => {}}>
                {t}
              </AHChip>
            ))}
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={() => nav.go('businessDetails')}>
        Continue
      </AHButton>
      <AHButton kind="ghost" onClick={nav.back}>
        Cancel
      </AHButton>
      </View>
    </AHScreen>
  );
}
