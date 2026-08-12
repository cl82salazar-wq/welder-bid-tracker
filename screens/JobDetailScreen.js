import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Share,
} from 'react-native';
import Field from '../components/Field';
import QuoteSummary from '../components/QuoteSummary';
import PrimaryButton from '../components/PrimaryButton';
import StatusBadge from '../components/StatusBadge';
import { NEXT_STATUS, STATUSES } from '../constants/statuses';
import { colors, radii, spacing } from '../constants/theme';
import { buildInvoiceText } from '../utils/invoice';
import { formatMoney, computeQuote } from '../utils/quote';

export default function JobDetailScreen({ job, onBack, onUpdate, onDelete }) {
  const [name, setName] = useState(job.name || '');
  const [materialCost, setMaterialCost] = useState(String(job.materialCost ?? ''));
  const [laborHours, setLaborHours] = useState(String(job.laborHours ?? ''));
  const [hourlyRate, setHourlyRate] = useState(String(job.hourlyRate ?? '75'));
  const [markupPercent, setMarkupPercent] = useState(String(job.markupPercent ?? '0'));
  const [notes, setNotes] = useState(job.notes || '');
  const [status, setStatus] = useState(job.status || 'Quoted');

  const createdLabel = useMemo(() => {
    if (!job.createdAt) return '—';
    return new Date(job.createdAt).toLocaleString();
  }, [job.createdAt]);

  const nextOptions = NEXT_STATUS[status] || [];

  const persist = (patch = {}) => {
    const next = {
      ...job,
      name: name.trim() || job.name,
      materialCost,
      laborHours,
      hourlyRate,
      markupPercent,
      notes: notes.trim(),
      status,
      ...patch,
      updatedAt: Date.now(),
    };
    onUpdate(next);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Job name required', 'Enter a job name before saving.');
      return;
    }
    persist();
    Alert.alert('Saved', 'Job updates stored on this device.');
  };

  const handleStatus = (next) => {
    setStatus(next);
    persist({ status: next });
  };

  const handleInvoice = async () => {
    const draft = {
      ...job,
      name: name.trim() || job.name,
      materialCost,
      laborHours,
      hourlyRate,
      markupPercent,
      notes: notes.trim(),
      status,
    };
    const text = buildInvoiceText(draft);
    try {
      await Share.share({ message: text, title: `Invoice — ${draft.name}` });
    } catch (e) {
      Alert.alert('Invoice summary', text);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete job?', `Remove "${job.name}" permanently?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => onDelete(job.id) },
    ]);
  };

  const q = computeQuote({
    materialCost,
    laborHours,
    hourlyRate,
    markupPercent,
  });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <PrimaryButton title="← Back" variant="ghost" onPress={onBack} style={styles.back} />

        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.kicker}>JOB DETAIL</Text>
            <Text style={styles.title} numberOfLines={2}>
              {name || 'Untitled job'}
            </Text>
          </View>
          <StatusBadge status={status} />
        </View>

        <Text style={styles.meta}>Created {createdLabel}</Text>
        <Text style={styles.meta}>Current total {formatMoney(q.total)}</Text>

        <Field label="Job name" value={name} onChangeText={setName} />
        <Field
          label="Material cost"
          value={materialCost}
          onChangeText={setMaterialCost}
          keyboardType="decimal-pad"
          suffix="$"
        />
        <Field
          label="Labor hours"
          value={laborHours}
          onChangeText={setLaborHours}
          keyboardType="decimal-pad"
          suffix="hrs"
        />
        <Field
          label="Hourly rate"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          keyboardType="decimal-pad"
          suffix="$/hr"
        />
        <Field
          label="Markup %"
          value={markupPercent}
          onChangeText={setMarkupPercent}
          keyboardType="decimal-pad"
          suffix="%"
        />
        <Field
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder="Progress notes, customer asks…"
        />

        <QuoteSummary
          materialCost={materialCost}
          laborHours={laborHours}
          hourlyRate={hourlyRate}
          markupPercent={markupPercent}
        />

        <Text style={styles.section}>Advance status</Text>
        <View style={styles.statusRow}>
          {nextOptions.length === 0 ? (
            <Text style={styles.meta}>
              {status === 'Invoiced' || status === 'Lost'
                ? 'This job is closed.'
                : 'No further status steps.'}
            </Text>
          ) : (
            nextOptions.map((s) => (
              <PrimaryButton
                key={s}
                title={`→ ${s}`}
                variant={s === 'Lost' ? 'danger' : 'secondary'}
                onPress={() => handleStatus(s)}
                style={styles.statusBtn}
              />
            ))
          )}
        </View>

        <Text style={styles.section}>Set status</Text>
        <View style={styles.statusGrid}>
          {STATUSES.map((s) => (
            <PrimaryButton
              key={s}
              title={s}
              variant={s === status ? 'primary' : 'ghost'}
              onPress={() => handleStatus(s)}
              style={styles.statusChip}
            />
          ))}
        </View>

        <PrimaryButton title="Save Changes" onPress={handleSave} />
        <PrimaryButton
          title="Share Invoice Summary"
          variant="secondary"
          onPress={handleInvoice}
          style={{ marginTop: spacing.sm }}
        />
        <PrimaryButton
          title="Delete Job"
          variant="danger"
          onPress={handleDelete}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: {
    padding: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  back: {
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    minHeight: 40,
    paddingVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  kicker: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
  },
  meta: {
    color: colors.textMuted,
    marginBottom: 4,
  },
  section: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 14,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },
  statusRow: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusBtn: {
    marginBottom: spacing.sm,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.md,
  },
  statusChip: {
    minHeight: 40,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },
});
