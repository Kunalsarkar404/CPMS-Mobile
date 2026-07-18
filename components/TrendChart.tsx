import { View, Text, useWindowDimensions, StyleSheet } from 'react-native';
import Svg, { Line, Polyline, Circle, Text as SvgText } from 'react-native-svg';

import { TREND_MONTHS, TREND_SERIES } from '@/constants/feedback360';

interface TrendChartProps {
  selectedSeriesId?: string;
}

export default function TrendChart({ selectedSeriesId }: TrendChartProps) {
  const { width: screenWidth } = useWindowDimensions();
  const visibleSeries = selectedSeriesId
    ? TREND_SERIES.filter((series) => series.id === selectedSeriesId)
    : TREND_SERIES;
  const chartWidth = Math.max(screenWidth - 48, 280);
  const chartHeight = 200;
  const paddingLeft = 28;
  const paddingRight = 12;
  const paddingTop = 16;
  const paddingBottom = 28;
  const plotWidth = chartWidth - paddingLeft - paddingRight;
  const plotHeight = chartHeight - paddingTop - paddingBottom;
  const maxY = 5;
  const minY = 0;

  const getX = (index: number) =>
    paddingLeft + (index / (TREND_MONTHS.length - 1)) * plotWidth;

  const getY = (value: number) =>
    paddingTop + ((maxY - value) / (maxY - minY)) * plotHeight;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        {[0, 1, 2, 3, 4, 5].map((tick) => {
          const y = getY(tick);
          return (
            <Line
              key={`grid-${tick}`}
              x1={paddingLeft}
              y1={y}
              x2={chartWidth - paddingRight}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth={1}
            />
          );
        })}

        {[0, 1, 2, 3, 4, 5].map((tick) => (
          <SvgText
            key={`label-${tick}`}
            x={paddingLeft - 8}
            y={getY(tick) + 4}
            fontSize="10"
            fill="#9CA3AF"
            textAnchor="end"
          >
            {tick}
          </SvgText>
        ))}

        {visibleSeries.map((series) => {
          const points = series.data
            .map((value, index) => `${getX(index)},${getY(value)}`)
            .join(' ');

          return (
            <Polyline
              key={series.id}
              points={points}
              fill="none"
              stroke={series.color}
              strokeWidth={2}
            />
          );
        })}

        {visibleSeries.map((series) =>
          series.data.map((value, index) => (
            <Circle
              key={`${series.id}-${index}`}
              cx={getX(index)}
              cy={getY(value)}
              r={3}
              fill={series.color}
            />
          ))
        )}

        {TREND_MONTHS.map((month, index) => (
          <SvgText
            key={month}
            x={getX(index)}
            y={chartHeight - 8}
            fontSize="10"
            fill="#6B7280"
            textAnchor="middle"
          >
            {month}
          </SvgText>
        ))}
      </Svg>

      <View style={styles.legend}>
        {visibleSeries.map((series) => (
          <View key={series.id} style={styles.legendItem}>
            <View
              style={[styles.legendSwatch, { backgroundColor: series.color }]}
            />
            <Text style={styles.legendLabel}>{series.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    columnGap: 16,
    rowGap: 8,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSwatch: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 8,
  },
  legendLabel: {
    fontSize: 12,
    color: '#374151',
  },
});
