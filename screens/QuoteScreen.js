import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Field from '../components/Field';
import QuoteSummary from '../components/QuoteSummary';
import PrimaryButton from '../components/PrimaryButton';
import { colors, spacing } from '../constants/theme';

export default function QuoteScreen({ onCancel, onSave }) {
  const [name, setName] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('75');
  const [markupPercent, setMarkupPercent] = useState('0');
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Job name required', 'Enter a job name before saving the quote.');
      return;
    }
    onSave({
      name: name.trim(),
      materialCost,
      laborHours,
      hourlyRate,
      markupPercent,
      notes: notes.trim(),
    });
  };

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
        <Text style={styles.kicker}>NEW BID</Text>
        <Text style={styles.title}>Fast Quote</Text>
        <Text style={styles.subtitle}>
          Materials + labor, optional markup. Save to track the job.
        </Text>

        <Field
          label="Job name"
          value={name}
          onChangeText={setName}
          placeholder="e.g. Shop gate repair"
        />
        <Field
          label="Material cost"
          value={materialCost}
          onChangeText={setMaterialCost}
          placeholder="0.00"
          keyboardType="decimal-pad"
          suffix="$"
        />
        <Field
          label="Labor hours"
          value={laborHours}
          onChangeText={setLaborHours}
          placeholder="0"
          keyboardType="decimal-pad"
          suffix="hrs"
        />
        <Field
          label="Hourly rate"
          value={hourlyRate}
          onChangeText={setHourlyRate}
          placeholder="75"
          keyboardType="decimal-pad"
          suffix="$/hr"
        />
        <Field
          label="Markup %"
          value={markupPercent}
          onChangeText={setMarkupPercent}
          placeholder="0"
          keyboardType="decimal-pad"
          suffix="%"
        />
        <Field
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Customer, site details, steel grade…"
          multiline
        />

        <QuoteSummary
          materialCost={materialCost}
          laborHours={laborHours}
          hourlyRate={hourlyRate}
          markupPercent={markupPercent}
        />

        <PrimaryButton title="Save Quote" onPress={handleSave} />
        <PrimaryButton
          title="Cancel"
          variant="ghost"
          onPress={onCancel}
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
    marginBottom: 4,
  },
  subtitle: {
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
});
