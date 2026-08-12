import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { computeQuote, formatMoney } from '../utils/quote';
import { colors, radii, spacing } from '../constants/theme';

export default function QuoteSummary({
  materialCost,
  laborHours,
  hourlyRate,
  markupPercent,
}) {
  const q = computeQuote({
    materialCost,
    laborHours,
    hourlyRate,
    markupPercent,
  });

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>Quote breakdown</Text>
      <Row label="Materials" value={formatMoney(q.material)} />
      <Row
        label={`Labor (${q.hours || 0}h × ${formatMoney(q.rate)})`}
        value={formatMoney(q.labor)}
      />
      <Row label="Subtotal" value={formatMoney(q.subtotal)} />
      {q.markup > 0 && (
        <Row
          label={`Markup (${q.markup}%)`}
          value={formatMoney(q.markupAmount)}
        />
      )}
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>TOTAL</Text>
        <Text style={styles.totalValue}>{formatMoney(q.total)}</Text>
      </View>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  heading: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
    marginBottom: spacing.sm,
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    flex: 1,
    paddingRight: 8,
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 16,
    letterSpacing: 1,
  },
  totalValue: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: 22,
  },
});
