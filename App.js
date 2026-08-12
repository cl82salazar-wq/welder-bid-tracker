import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import JobListScreen from './screens/JobListScreen';
import QuoteScreen from './screens/QuoteScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import { colors } from './constants/theme';
import { loadJobs, saveJobs } from './utils/storage';
import { computeQuote } from './utils/quote';

export default function App() {
  const [ready, setReady] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [screen, setScreen] = useState('list');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const stored = await loadJobs();
      if (mounted) {
        setJobs(stored);
        setReady(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;

  const persist = useCallback(async (nextJobs) => {
    setJobs(nextJobs);
    try {
      await saveJobs(nextJobs);
    } catch (e) {
      console.warn('Failed to persist jobs', e);
    }
  }, []);

  const handleSaveQuote = async (payload) => {
    const q = computeQuote(payload);
    const job = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: payload.name,
      materialCost: q.material,
      laborHours: q.hours,
      hourlyRate: q.rate,
      markupPercent: q.markup,
      notes: payload.notes || '',
      status: 'Quoted',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await persist([job, ...jobsRef.current]);
    setScreen('list');
  };

  const handleUpdateJob = async (updated) => {
    const next = jobsRef.current.map((j) => (j.id === updated.id ? updated : j));
    await persist(next);
  };

  const handleDeleteJob = async (id) => {
    const next = jobsRef.current.filter((j) => j.id !== id);
    await persist(next);
    setSelectedId(null);
    setScreen('list');
  };

  const selectedJob = jobs.find((j) => j.id === selectedId);

  const openJob = (id) => {
    setSelectedId(id);
    setScreen('detail');
  };

  if (!ready) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safe}>
          <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading shop jobs…</Text>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
        {screen === 'list' && (
          <JobListScreen
            jobs={jobs}
            onNewQuote={() => setScreen('quote')}
            onOpenJob={openJob}
          />
        )}
        {screen === 'quote' && (
          <QuoteScreen
            onCancel={() => setScreen('list')}
            onSave={handleSaveQuote}
          />
        )}
        {screen === 'detail' && selectedJob && (
          <JobDetailScreen
            job={selectedJob}
            onBack={() => {
              setSelectedId(null);
              setScreen('list');
            }}
            onUpdate={handleUpdateJob}
            onDelete={handleDeleteJob}
          />
        )}
        {screen === 'detail' && !selectedJob && (
          <JobListScreen
            jobs={jobs}
            onNewQuote={() => setScreen('quote')}
            onOpenJob={openJob}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    color: colors.textMuted,
    marginTop: 12,
  },
});
