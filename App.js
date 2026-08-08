import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

export default function WelderBidTracker() {
  const [jobName, setJobName] = useState('');
  const [materialCost, setMaterialCost] = useState('');
  const [laborHours, setLaborHours] = useState('');
  const [hourlyRate, setHourlyRate] = useState('75');
  const [jobs, setJobs] = useState([]);

  const calculateQuote = () => {
    const mat = parseFloat(materialCost) || 0;
    const hours = parseFloat(laborHours) || 0;
    const rate = parseFloat(hourlyRate) || 75;
    const total = mat + (hours * rate);
    return total.toFixed(2);
  };

  const addJob = () => {
    if (!jobName) return;
    const newJob = {
      id: Date.now().toString(),
      name: jobName,
      quote: calculateQuote(),
      status: 'Quoted',
    };
    setJobs([...jobs, newJob]);
    setJobName('');
    setMaterialCost('');
    setLaborHours('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welder Bid Tracker</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Job Name"
        value={jobName}
        onChangeText={setJobName}
      />
      <TextInput
        style={styles.input}
        placeholder="Material Cost ($)"
        value={materialCost}
        onChangeText={setMaterialCost}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Labor Hours"
        value={laborHours}
        onChangeText={setLaborHours}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Hourly Rate ($)"
        value={hourlyRate}
        onChangeText={setHourlyRate}
        keyboardType="numeric"
      />
      
      <Button title="Generate Quote & Save Job" onPress={addJob} />
      
      <Text style={styles.subtitle}>Your Jobs</Text>
      <FlatList
        data={jobs}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobItem}>
            <Text>{item.name} - ${item.quote}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5, backgroundColor: '#fff' },
  jobItem: { padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 5 },
});