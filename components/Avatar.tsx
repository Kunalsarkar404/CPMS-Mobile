import { Image, Text, View, StyleSheet, type ImageSourcePropType } from 'react-native';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  name?: string;
  uri?: string | null;
  source?: ImageSourcePropType;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  sm: 36,
  md: 48,
  lg: 64,
  xl: 80,
};

function getInitials(name?: string) {
  if (!name?.trim()) return '?';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Avatar({
  name,
  uri,
  source,
  size = 'md',
  backgroundColor = '#5B8C3E',
  textColor = '#FFFFFF',
}: AvatarProps) {
  const dimension = SIZE_MAP[size];
  const fontSize = Math.round(dimension * 0.36);
  const imageSource = source ?? (uri ? { uri } : undefined);

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: imageSource ? '#E5E7EB' : backgroundColor,
        },
      ]}
    >
      {imageSource ? (
        <Image
          source={imageSource}
          style={{
            width: dimension,
            height: dimension,
            borderRadius: dimension / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <Text style={[styles.initials, { fontSize, color: textColor }]}>
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initials: {
    fontWeight: '700',
  },
});
