import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, TextInput, Alert as RNAlert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Bell, CircleAlert as AlertCircle, Pill, Calendar, Package, Clock } from 'lucide-react-native';
import { useMedicineContext } from '../../context/MedicineContext';
import MedicineCard from '../../components/MedicineCard';
import { Platform } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { medicines, alerts, loadMedicines, markAlertAsRead, activeUser } = useMedicineContext();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState(medicines);
  const [showSearch, setShowSearch] = useState(false);
  const [showAllAlerts, setShowAllAlerts] = useState(false);

  useEffect(() => {
    // Filter medicines based on search query
    if (searchQuery.trim() === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMedicines();
    setRefreshing(false);
  };

  // Get unread alerts
  const unreadAlerts = alerts.filter(alert => !alert.read);

  // Handle alert press
  const handleAlertPress = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (!alert) return;

    // Show alert details
    RNAlert.alert(
      alert.title,
      alert.description,
      [
        { 
          text: "View Details", 
          onPress: () => {
            // Navigate to the medicine details if it's a single medicine alert
            if (alert.medicineIds.length === 1) {
              // In a real app, you would navigate to a medicine detail screen
              // For now, we'll just mark it as read
              markAlertAsRead(alertId);
            }
          } 
        },
        { 
          text: "Dismiss", 
          onPress: () => markAlertAsRead(alertId),
          style: "cancel"
        }
      ]
    );
  };

  // Get alert icon based on type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'expiry':
        return <Calendar size={20} color="#EF4444" />;
      case 'stock':
        return <Package size={20} color="#EF4444" />;
      case 'interaction':
        return <AlertCircle size={20} color="#EF4444" />;
      case 'reminder':
        return <Clock size={20} color="#EF4444" />;
      default:
        return <AlertCircle size={20} color="#EF4444" />;
    }
  };

  // Get alerts to display based on showAllAlerts flag
  const alertsToDisplay = showAllAlerts ? alerts : unreadAlerts;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello there,</Text>
          <Text style={styles.title}>
            {activeUser ? activeUser.name : 'MediFill'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => setShowAllAlerts(!showAllAlerts)}
        >
          <Bell size={24} color="#4F46E5" />
          {unreadAlerts.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {unreadAlerts.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          {showSearch ? (
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              onBlur={() => {
                if (searchQuery === '') {
                  setShowSearch(false);
                }
              }}
            />
          ) : (
            <TouchableOpacity 
              style={styles.searchBar}
              onPress={() => setShowSearch(true)}
            >
              <Text style={styles.searchText}>Search medicines...</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Alerts Section */}
        {(unreadAlerts.length > 0 || showAllAlerts) && (
          <View style={styles.alertsContainer}>
            <View style={styles.alertHeader}>
              <AlertCircle size={20} color="#EF4444" />
              <Text style={styles.alertTitle}>Alerts</Text>
              {alerts.length > unreadAlerts.length && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => setShowAllAlerts(!showAllAlerts)}
                >
                  <Text style={styles.viewAllButtonText}>
                    {showAllAlerts ? 'Show Unread' : 'View All'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            
            {alertsToDisplay.map((alert) => (
              <TouchableOpacity 
                key={alert.id} 
                style={[styles.alertCard, alert.read && styles.alertCardRead]}
                onPress={() => handleAlertPress(alert.id)}
              >
                <View style={styles.alertCardHeader}>
                  {getAlertIcon(alert.type)}
                  <Text style={styles.alertCardTitle}>{alert.title}</Text>
                </View>
                <Text style={styles.alertCardDescription}>
                  {alert.description}
                </Text>
                <Text style={styles.alertCardTime}>
                  {new Date(alert.createdAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* My Medicines Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>My Medicines</Text>
          
          {medicines.length === 0 ? (
            <View style={styles.emptyState}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }} 
                style={styles.emptyStateImage} 
              />
              <Text style={styles.emptyStateTitle}>No medicines added yet</Text>
              <Text style={styles.emptyStateDescription}>
                Add your first medicine by tapping the Add button below
              </Text>
            </View>
          ) : (
            <View style={styles.medicineList}>
              {filteredMedicines.map((medicine) => (
                <MedicineCard key={medicine.id} medicine={medicine} />
              ))}
            </View>
          )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20, 
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  searchIcon: {
    position: 'absolute',
    left: 30,
    zIndex: 1,
  },
  searchBar: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 40,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 10,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchText: {
    color: '#6B7280',
  },
  alertsContainer: {
    margin: 20,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginLeft: 10,
    flex: 1,
  },
  viewAllButton: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  viewAllButtonText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '600',
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  alertCardRead: {
    opacity: 0.7,
  },
  alertCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#B91C1C',
    marginLeft: 8,
  },
  alertCardDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 5,
  },
  alertCardTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
    textAlign: 'right',
  },
  sectionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  medicineList: {
    gap: 15,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyStateImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
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
});