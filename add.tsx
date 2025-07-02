import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Calendar, Clock, Pill, Package, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useMedicineContext } from '../../context/MedicineContext';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '../../components/DateTimePicker';

export default function AddMedicineScreen() {
  const { addMedicine } = useMedicineContext();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [totalQuantity, setTotalQuantity] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [timesToTake, setTimesToTake] = useState<string[]>(['08:00']);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [errors, setErrors] = useState({
    name: false,
    dosage: false,
    frequency: false,
    totalQuantity: false,
    currentQuantity: false,
    expiryDate: false,
  });

  const handleImagePick = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }
    }

    try {
      // For web, we'll just show a success message since camera isn't available
      if (Platform.OS === 'web') {
        Alert.alert(
          "Image Capture Simulated",
          "In a real app on a mobile device, we would use the camera to capture medicine details.",
          [{ text: "OK" }]
        );
        return;
      }
      
      // For native platforms, use the camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        // Here we would normally process the image with OCR
        // For demo purposes, we'll just show a success message
        Alert.alert(
          "Image Captured",
          "In a real app, we would use OCR to extract medicine details from this image.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was an error capturing the image.");
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      dosage: !dosage.trim(),
      frequency: !frequency.trim(),
      totalQuantity: !totalQuantity.trim() || isNaN(Number(totalQuantity)),
      currentQuantity: !currentQuantity.trim() || isNaN(Number(currentQuantity)) || 
                      Number(currentQuantity) > Number(totalQuantity),
      expiryDate: false,
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleAddTimeToTake = () => {
    setTimesToTake([...timesToTake, '12:00']);
  };

  const handleRemoveTimeToTake = (index: number) => {
    const newTimes = [...timesToTake];
    newTimes.splice(index, 1);
    setTimesToTake(newTimes);
  };

  const handleTimeChange = (index: number, time: string) => {
    const newTimes = [...timesToTake];
    newTimes[index] = time;
    setTimesToTake(newTimes);
  };

  const handleTimePickerOpen = (index: number) => {
    setCurrentTimeIndex(index);
    setShowTimePicker(true);
  };

  const handleTimePickerChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      handleTimeChange(currentTimeIndex, timeString);
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newMedicine = {
      id: Date.now().toString(),
      name,
      dosage,
      frequency,
      totalQuantity: Number(totalQuantity),
      currentQuantity: Number(currentQuantity),
      expiryDate: expiryDate.toISOString(),
      notes,
      timeToTake: timesToTake,
      createdAt: new Date().toISOString(),
    };

    addMedicine(newMedicine);
    
    // Show success message
    if (Platform.OS === 'web') {
      alert('Medicine added successfully!');
    } else {
      Alert.alert(
        "Success",
        "Medicine added successfully!",
        [{ text: "OK", onPress: () => router.navigate('/') }]
      );
    }

    // Reset form
    setName('');
    setDosage('');
    setFrequency('');
    setTotalQuantity('');
    setCurrentQuantity('');
    setExpiryDate(new Date());
    setNotes('');
    setTimesToTake(['08:00']);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Medicine</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.formContainer}>
          {/* Scan Button */}
          <TouchableOpacity style={styles.scanButton} onPress={handleImagePick}>
            <Camera size={24} color="#4F46E5" />
            <Text style={styles.scanButtonText}>Scan Medicine</Text>
          </TouchableOpacity>

          {/* Medicine Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Medicine Name*</Text>
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              placeholder="Enter medicine name"
              value={name}
              onChangeText={setName}
            />
            {errors.name && (
              <Text style={styles.errorText}>Medicine name is required</Text>
            )}
          </View>

          {/* Dosage */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Dosage*</Text>
            <TextInput
              style={[styles.input, errors.dosage && styles.inputError]}
              placeholder="e.g., 500mg, 5ml"
              value={dosage}
              onChangeText={setDosage}
            />
            {errors.dosage && (
              <Text style={styles.errorText}>Dosage is required</Text>
            )}
          </View>

          {/* Frequency */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Frequency*</Text>
            <TextInput
              style={[styles.input, errors.frequency && styles.inputError]}
              placeholder="e.g., Once daily, Twice daily"
              value={frequency}
              onChangeText={setFrequency}
            />
            {errors.frequency && (
              <Text style={styles.errorText}>Frequency is required</Text>
            )}
          </View>

          {/* Times to Take */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Times to Take*</Text>
            { timesToTake.map((time, index) => (
              <View key={`time-${index}`} style={styles.timeInputRow}>
                <TouchableOpacity 
                  style={styles.timePickerButton}
                  onPress={() => handleTimePickerOpen(index)}
                >
                  <Clock size={20} color="#6B7280" />
                  <Text style={styles.timePickerButtonText}>{time}</Text>
                </TouchableOpacity>
                
                {timesToTake.length > 1 && (
                  <TouchableOpacity 
                    style={styles.removeTimeButton}
                    onPress={() => handleRemoveTimeToTake(index)}
                  >
                    <Text style={styles.removeTimeButtonText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            
            <TouchableOpacity 
              style={styles.addTimeButton}
              onPress={handleAddTimeToTake}
            >
              <Text style={styles.addTimeButtonText}>+ Add Another Time</Text>
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={(() => {
                  const [hours, minutes] = timesToTake[currentTimeIndex].split(':').map(Number);
                  const date = new Date();
                  date.setHours(hours, minutes, 0, 0);
                  return date;
                })()}
                mode="time"
                display="default"
                onChange={handleTimePickerChange}
              />
            )}
          </View>

          {/* Total Quantity */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Total Quantity*</Text>
            <TextInput
              style={[styles.input, errors.totalQuantity && styles.inputError]}
              placeholder="e.g., 30 tablets"
              value={totalQuantity}
              onChangeText={setTotalQuantity}
              keyboardType="numeric"
            />
            {errors.totalQuantity && (
              <Text style={styles.errorText}>Valid total quantity is required</Text>
            )}
          </View>

          {/* Current Quantity */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Current Quantity*</Text>
            <TextInput
              style={[styles.input, errors.currentQuantity && styles.inputError]}
              placeholder="e.g., 28 tablets"
              value={currentQuantity}
              onChangeText={setCurrentQuantity}
              keyboardType="numeric"
            />
            {errors.currentQuantity && (
              <Text style={styles.errorText}>
                Valid current quantity is required (must be less than or equal to total)
              </Text>
            )}
          </View>

          {/* Expiry Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expiry Date*</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Calendar size={20} color="#6B7280" />
              <Text style={styles.datePickerButtonText}>
                {expiryDate.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={expiryDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setExpiryDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          {/* Notes */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Notes (Optional)</Text>
             <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Add any additional notes"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Add Medicine</Text>
          </TouchableOpacity>
        </View>
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
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  scanButtonText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
  },
  datePickerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },
  timeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timePickerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    padding: 12,
  },
  timePickerButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#111827',
  },
  removeTimeButton: {
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  removeTimeButtonText: {
    color: '#B91C1C',
    fontWeight: '600',
  },
  addTimeButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
  },
  addTimeButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});