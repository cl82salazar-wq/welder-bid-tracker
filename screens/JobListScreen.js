import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import { STATUSES } from '../constants/statuses';
import { colors, radii, spacing } from '../constants/theme';

export default function JobListScreen({ jobs, onNewQuote, onOpenJob }) {
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    const list = filter === 'All' ? jobs : jobs.filter((j) => j.status === filter);
    return [...list].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [jobs, filter]);

  const filters = ['All', ...STATUSES];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>SHOP FLOOR</Text>
          <Text style={styles.title}>Bid Tracker</Text>
        </View>
        <PrimaryButton title="+ Quote" onPress={onNewQuote} style={styles.newBtn} />
      </View>

      <FlatList
        horizontal
        data={filters}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.filterList}
        contentContainerStyle={styles.filterContent}
        renderItem={({ item }) => {
          const active = item === filter;
          return (
            <Pressable
              onPress={() => setFilter(item)}
              style={[styles.chip, active && styles.chipActive]}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {item}
              </Text>
            </Pressable>
          );
        }}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            title={filter === 'All' ? 'No jobs yet' : `No ${filter} jobs`}
            subtitle={
              filter === 'All'
                ? 'Tap + Quote to price materials, labor, and markup.'
                : 'Try another status filter or create a new quote.'
            }
          />
        }
        renderItem={({ item }) => (
          <JobCard job={item} onPress={() => onOpenJob(item.id)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '900',
  },
  newBtn: {
    paddingHorizontal: 18,
    minWidth: 110,
  },
  filterList: {
    maxHeight: 44,
    marginBottom: spacing.sm,
  },
  filterContent: {
    paddingHorizontal: spacing.md,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: colors.accent + '22',
    borderColor: colors.accent,
  },
  chipText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  chipTextActive: {
    color: colors.accent,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    flexGrow: 1,
  },
});
