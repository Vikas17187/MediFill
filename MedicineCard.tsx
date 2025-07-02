import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Pill, CircleAlert as AlertCircle, Calendar, Trash2 } from 'lucide-react-native';
import { Medicine, useMedicineContext } from '../context/MedicineContext';

interface MedicineCardProps {
  medicine: Medicine;
}

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const { deleteMedicine } = useMedicineContext();

  // Calculate days until expiry
  const daysUntilExpiry = () => {
    const expiryDate = new Date(medicine.expiryDate);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Calculate percentage of medicine remaining
  const percentageRemaining = () => {
    return (medicine.currentQuantity / medicine.totalQuantity) * 100;
  };

  const isExpiringSoon = daysUntilExpiry() <= 30 && daysUntilExpiry() > 0;
  const isRunningLow = percentageRemaining() <= 20;
  const hasInteractions = medicine.interactions && medicine.interactions.length > 0;

  // Handle delete medicine
  const handleDelete = () => {
    Alert.alert(
      "Delete Medicine",
      `Are you sure you want to delete ${medicine.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => deleteMedicine(medicine.id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Pill size={24} color="#4F46E5" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{medicine.name}</Text>
          <Text style={styles.subtitle}>{medicine.dosage}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Trash2 size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Frequency</Text>
          <Text style={styles.infoValue}>{medicine.frequency}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Quantity</Text>
          <Text style={styles.infoValue}>
            {medicine.currentQuantity} / {medicine.totalQuantity}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${percentageRemaining()}%` },
            isRunningLow ? styles.progressBarLow : {}
          ]} 
        />
      </View>

      <View style={styles.alertContainer}>
        {isExpiringSoon && (
          <View style={styles.alert}>
            <Calendar size={16} color="#B91C1C" />
            <Text style={styles.alertText}>
              Expires in {daysUntilExpiry()} days
            </Text>
          </View>
        )}
        
        {isRunningLow && (
          <View style={styles.alert}>
            <AlertCircle size={16} color="#B91C1C" />
            <Text style={styles.alertText}>
              Running low ({Math.round(percentageRemaining())}% left)
            </Text>
          </View>
        )}
        
        {hasInteractions && (
          <View style={styles.alert}>
            <AlertCircle size={16} color="#B91C1C" />
            <Text style={styles.alertText}>
              Interacts with: {medicine.interactions?.join(', ')}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 3,
  },
  progressBarLow: {
    backgroundColor: '#EF4444',
  },
  alertContainer: {
    marginTop: 8,
  },
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  alertText: {
    fontSize: 12,
    color: '#B91C1C',
    marginLeft: 6,
  },
});

export default MedicineCard;