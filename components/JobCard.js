import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import StatusBadge from './StatusBadge';
import { computeQuote, formatMoney } from '../utils/quote';
import { colors, radii, spacing } from '../constants/theme';

export default function JobCard({ job, onPress }) {
  const q = computeQuote({
    materialCost: job.materialCost,
    laborHours: job.laborHours,
    hourlyRate: job.hourlyRate,
    markupPercent: job.markupPercent,
  });
  const created = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString()
    : '';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>
          {job.name}
        </Text>
        <Text style={styles.total}>{formatMoney(q.total)}</Text>
      </View>
      <View style={styles.meta}>
        <StatusBadge status={job.status} />
        <Text style={styles.date}>{created}</Text>
      </View>
      {!!job.notes && (
        <Text style={styles.notes} numberOfLines={1}>
          {job.notes}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    opacity: 0.85,
    borderColor: colors.accent,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  name: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  total: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '800',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    color: colors.textMuted,
    fontSize: 12,
  },
  notes: {
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 13,
  },
});
