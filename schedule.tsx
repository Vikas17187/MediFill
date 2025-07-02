import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar as CalendarIcon, Clock, Pill, Check, X } from 'lucide-react-native';
import { useMedicineContext } from '../../context/MedicineContext';

export default function ScheduleScreen() {
  const { medicines, activeUser } = useMedicineContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState<any[]>([]);

  // Function to format date as "Monday, June 10"
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Generate schedule based on medicines and their times
  useEffect(() => {
    if (medicines.length === 0) {
      setSchedule([]);
      return;
    }

    const scheduleItems: any[] = [];
    const timeMap = new Map<string, any>();

    // Group medicines by time
    medicines.forEach(medicine => {
      if (medicine.timeToTake && medicine.timeToTake.length > 0) {
        medicine.timeToTake.forEach(time => {
          if (!timeMap.has(time)) {
            timeMap.set(time, {
              id: `time-${time}`,
              time,
              medicines: []
            });
          }
          
          timeMap.get(time).medicines.push({
            id: medicine.id,
            name: medicine.name,
            dosage: medicine.dosage,
            taken: false // Default to not taken
          });
        });
      }
    });

    // Convert map to array and sort by time
    Array.from(timeMap.values()).forEach(item => {
      scheduleItems.push(item);
    });

    // Sort by time
    scheduleItems.sort((a, b) => {
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      
      if (timeA[0] !== timeB[0]) {
        return timeA[0] - timeB[0];
      }
      return timeA[1] - timeB[1];
    });

    setSchedule(scheduleItems);
  }, [medicines]);

  // Function to handle medicine taken status toggle
  const toggleMedicineTaken = (scheduleId: string, medicineId: string) => {
    setSchedule(prevSchedule => 
      prevSchedule.map(scheduleItem => {
        if (scheduleItem.id === scheduleId) {
          return {
            ...scheduleItem,
            medicines: scheduleItem.medicines.map((medicine: any) => {
              if (medicine.id === medicineId) {
                return { ...medicine, taken: !medicine.taken };
              }
              return medicine;
            }),
          };
        }
        return scheduleItem;
      })
    );
  };

  // Function to navigate to previous day
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  // Function to navigate to next day
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  // Format time for display (e.g., "08:00" to "8:00 AM")
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Schedule</Text>
        {activeUser && (
          <Text style={styles.subtitle}>for {activeUser.name}</Text>
        )}
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={goToPreviousDay} style={styles.dateNavButton}>
          <Text style={styles.dateNavButtonText}>Previous</Text>
        </TouchableOpacity>
        
        <View style={styles.dateContainer}>
          <CalendarIcon size={20} color="#4F46E5" />
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </View>
        
        <TouchableOpacity onPress={goToNextDay} style={styles.dateNavButton}>
          <Text style={styles.dateNavButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Schedule Timeline */}
      <ScrollView style={styles.scheduleContainer}>
        {schedule.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No medicines scheduled</Text>
            <Text style={styles.emptyStateDescription}>
              Add medicines with scheduled times to see them here
            </Text>
          </View>
        ) : (
          schedule.map((scheduleItem) => (
            <View key={scheduleItem.id} style={styles.timeBlock}>
              <View style={styles.timeIndicator}>
                <View style={styles.timeIconContainer}>
                  <Clock size={20} color="#4F46E5" />
                </View>
                <Text style={styles.timeText}>{formatTime(scheduleItem.time)}</Text>
              </View>
              
              <View style={styles.medicineCards}>
                {scheduleItem.medicines.map((medicine: any) => (
                  <View key={medicine.id} style={styles.medicineCard}>
                    <View style={styles.medicineInfo}>
                      <View style={styles.medicineIconContainer}>
                        <Pill size={20} color="#4F46E5" />
                      </View>
                      <View>
                        <Text style={styles.medicineName}>{medicine.name}</Text>
                        <Text style={styles.medicineDosage}>{medicine.dosage}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={[
                        styles.statusButton,
                        medicine.taken ? styles.takenButton : styles.notTakenButton,
                      ]}
                      onPress={() => toggleMedicineTaken(scheduleItem.id, medicine.id)}
                    >
                      {medicine.taken ? (
                        <>
                          <Check size={16} color="white" />
                          <Text style={styles.takenButtonText}>Taken</Text>
                        </>
                      ) : (
                        <>
                          <X size={16} color="#6B7280" />
                          <Text style={styles.notTakenButtonText}>Not Taken</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
  },
  dateNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
  },
  dateNavButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 8,
  },
  scheduleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  timeBlock: {
    marginBottom: 20,
  },
  timeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  medicineCards: {
    marginLeft: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    paddingLeft: 28,
  },
  medicineCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicineIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  medicineDosage: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  takenButton: {
    backgroundColor: '#10B981',
  },
  notTakenButton: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  takenButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  notTakenButtonText: {
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 4,
  },
});