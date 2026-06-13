import { AHScreen, AHProgress, AHTitle, AHField, AHChip, AHButton } from '../components/ui';
import { useNav } from '../nav';

// 07 · Add your first business — name + a 15-category type grid.
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
    <AHScreen>
      <AHProgress step={4} />
      <AHTitle
        np="पहिलो व्यापार थप्नुहोस्"
        en="Add your first business"
        sub="Give it a name and a type — you can add more businesses anytime."
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <AHField label="Business name" value="Shrestha Kirana Pasal" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ah-muted)' }}>Business type</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {types.map(([t, sel]) => (
              <AHChip key={t} selected={sel}>
                {t}
              </AHChip>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <AHButton kind="primary" onClick={nav.next}>
        Add business
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        Skip for now
      </AHButton>
    </AHScreen>
  );
}
