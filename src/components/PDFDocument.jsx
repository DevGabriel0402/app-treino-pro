import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed, but for now we'll use defaults

const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#3b82f6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#020617',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 10,
    color: '#3b82f6',
    fontWeight: 'bold',
    marginTop: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 10,
    borderLeft: 3,
    borderLeftColor: '#3b82f6',
    paddingLeft: 10,
  },
  description: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 1.5,
    marginBottom: 15,
  },
  exerciseGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  exerciseCard: {
    width: '48%',
    padding: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  exerciseName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  exerciseTip: {
    fontSize: 9,
    color: '#64748b',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTop: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  }
});

const MusclePage = ({ muscle }) => (
  <Page size="A4" style={styles.page}>
    <View style={styles.header}>
      <Text style={styles.title}>Treino Pro</Text>
      <Text style={styles.subtitle}>FICHA TÉCNICA: {muscle.name.toUpperCase()}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Visão Geral</Text>
      <Text style={styles.description}>{muscle.description}</Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Divisões Anatômicas</Text>
      <Text style={{ fontSize: 10, color: '#475569', marginBottom: 10 }}>
        {muscle.anatomy.join(' • ')}
      </Text>
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Exercícios Recomendados</Text>
      <View style={styles.exerciseGrid}>
        {muscle.exercises.map((ex, index) => (
          <View key={index} style={styles.exerciseCard}>
            <Text style={styles.exerciseName}>{ex.name}</Text>
            <Text style={styles.exerciseTip}>{ex.tip}</Text>
          </View>
        ))}
      </View>
    </View>

    <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
      `Página ${pageNumber} de ${totalPages} • Gerado por Treino Pro`
    )} fixed />
  </Page>
);

const PDFDocument = ({ muscles }) => {
  const muscleList = Array.isArray(muscles) ? muscles : [muscles];
  
  return (
    <Document>
      {muscleList.map((muscle) => (
        <MusclePage key={muscle.id} muscle={muscle} />
      ))}
    </Document>
  );
};

export default PDFDocument;
