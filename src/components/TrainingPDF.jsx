import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const createStyles = (themeColor = '#000000') => StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#334155',
  },
  header: {
    borderBottom: 2,
    borderBottomColor: themeColor,
    paddingBottom: 15,
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  systemName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: themeColor,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  trainingName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 2,
  },
  dateText: {
    fontSize: 8,
    color: '#64748b',
  },
  studentInfo: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  infoLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  exerciseList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  exerciseCard: {
    borderWidth: 1,
    borderColor: '#f1f5f9',
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 12,
  },
  exerciseHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 6,
  },
  exerciseTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  exerciseCategory: {
    fontSize: 8,
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exerciseDetails: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  detailLabel: {
    fontSize: 7,
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
  },
  mobilityBadge: {
    backgroundColor: '#ecfdf5',
    color: '#059669',
    fontSize: 8,
    fontWeight: 'bold',
    padding: '4px 8px',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  substitutesContainer: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  substitutesLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  substitutesList: {
    fontSize: 8,
    color: '#64748b',
    fontStyle: 'italic',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#94a3b8',
    fontSize: 7,
  },
  footerText: {
    fontStyle: 'italic',
  }
});

const TrainingPDF = ({ student, name, exercises, systemName = 'TREINO PRO', themeColor = '#000000' }) => {
  const styles = createStyles(themeColor);
  const currentDate = new Date().toLocaleDateString('pt-BR');

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.systemName}>{systemName}</Text>
            <Text style={styles.trainingName}>{name}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>Gerado em {currentDate}</Text>
          </View>
        </View>

        {/* Student Info Box */}
        <View style={styles.studentInfo}>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Aluno</Text>
            <Text style={styles.infoValue}>{student?.name || 'Não informado'}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Objetivo</Text>
            <Text style={styles.infoValue}>{student?.goal || 'Não informado'}</Text>
          </View>
          <View style={styles.infoCol}>
            <Text style={styles.infoLabel}>Ficha de Treino</Text>
            <Text style={styles.infoValue}>Ativa</Text>
          </View>
        </View>

        {/* Exercises list */}
        <Text style={styles.sectionTitle}>Exercícios da Ficha</Text>
        <View style={styles.exerciseList}>
          {exercises.map((ex, index) => {
            const isMobility = ex.category?.toLowerCase().trim() === 'mobilidade e alongamento';
            return (
              <View key={index} style={styles.exerciseCard} wrap={false}>
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseTitle}>
                    {index + 1}. {ex.title}
                  </Text>
                  <Text style={styles.exerciseCategory}>{ex.category}</Text>
                </View>

                {isMobility ? (
                  <Text style={styles.mobilityBadge}>🧘 Mobilidade e Alongamento Livre</Text>
                ) : (
                  <View style={styles.exerciseDetails}>
                    {!ex.isDuration && (
                      <>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Séries</Text>
                          <Text style={styles.detailValue}>{ex.series || '-'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>Repetições</Text>
                          <Text style={styles.detailValue}>{ex.reps || '-'}</Text>
                        </View>
                      </>
                    )}
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>
                        {ex.isDuration ? 'Duração' : 'Descanso'}
                      </Text>
                      <Text style={styles.detailValue}>
                        {ex.rest ? (ex.isDuration ? `${ex.rest} min` : `${ex.rest}s`) : '-'}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Substitutes */}
                {ex.substitutes?.length > 0 && (
                  <View style={styles.substitutesContainer}>
                    <Text style={styles.substitutesLabel}>Opções de Substituição:</Text>
                    <Text style={styles.substitutesList}>
                      {ex.substitutes.map(sub => sub.title).join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Foco na constância. Seu progresso é o que importa! 💪</Text>
          <Text render={({ pageNumber, totalPages }) => `Página ${pageNumber} de ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default TrainingPDF;
