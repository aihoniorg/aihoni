import { View, Text, StyleSheet } from 'react-native';

export function ImageSlot({
  shape = 'rect',
  placeholder = '',
  style = {},
}: {
  shape?: 'rect' | 'circle';
  placeholder?: string;
  style?: object;
}) {
  return (
    <View
      style={[styles.base, shape === 'circle' && { borderRadius: 9999 }, style]}
    >
      {placeholder.trim() ? (
        <Text style={styles.label}>{placeholder.trim()}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#ededf0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  label: {
    color: '#9a9aa0',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
    opacity: 0.8,
  },
});
