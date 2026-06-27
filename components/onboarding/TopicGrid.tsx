import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { TOPICS } from '../../constants/topics';
import { TopicPill } from '../preferences/TopicPill';

interface TopicGridProps {
  selected: string[];
  onToggle: (id: string) => void;
  compact?: boolean;
}

export function TopicGrid({ selected, onToggle, compact }: TopicGridProps) {
  return (
    <FlatList
      data={TOPICS}
      keyExtractor={(item) => item.id}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={styles.row}
      contentContainerStyle={[styles.container, compact && styles.compact]}
      renderItem={({ item }) => (
        <View style={styles.pillWrapper}>
          <TopicPill
            label={item.label}
            icon={item.icon}
            selected={selected.includes(item.id)}
            onPress={() => onToggle(item.id)}
            small={compact}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  compact: {
    gap: 6,
  },
  row: {
    gap: 10,
  },
  pillWrapper: {
    flex: 1,
  },
});
