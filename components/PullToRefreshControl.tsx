import { RefreshControl, type RefreshControlProps } from 'react-native';

import Colors from '@/constants/Colors';

type Props = Omit<RefreshControlProps, 'colors' | 'tintColor'>;

// App-wide themed RefreshControl — single place to keep pull-to-refresh
// styling consistent across every screen. Pair with usePullToRefresh.
export default function PullToRefreshControl(props: Props) {
  return (
    <RefreshControl
      tintColor={Colors.light.tint}
      colors={[Colors.light.tint]}
      {...props}
    />
  );
}
