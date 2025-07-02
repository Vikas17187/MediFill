import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Search, ExternalLink } from 'lucide-react-native';
import ChennaiMap from '../../components/ChennaiMap';

// Chennai pharmacy data
const CHENNAI_PHARMACIES = [
  {
    id: '1',
    name: 'Apollo Pharmacy',
    address: '23 Mount Road, Chennai',
    distance: '0.5 km',
    rating: 4.5,
    hours: '8:00 AM - 10:00 PM',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
  },
  {
    id: '2',
    name: 'MedPlus Pharmacy',
    address: '45 Anna Nagar, Chennai',
    distance: '1.2 km',
    rating: 4.2,
    hours: '9:00 AM - 9:00 PM',
    coordinates: { latitude: 13.0850, longitude: 80.2750 },
  },
  {
    id: '3',
    name: 'Netmeds Pharmacy',
    address: '78 T Nagar, Chennai',
    distance: '2.0 km',
    rating: 4.7,
    hours: '24 hours',
    coordinates: { latitude: 13.0810, longitude: 80.2680 },
  },
  {
    id: '4',
    name: 'Wellness Forever',
    address: '112 Adyar, Chennai',
    distance: '3.5 km',
    rating: 4.3,
    hours: '8:00 AM - 11:00 PM',
    coordinates: { latitude: 13.0060, longitude: 80.2545 },
  },
  {
    id: '5',
    name: 'Guardian Pharmacy',
    address: '56 Mylapore, Chennai',
    distance: '2.8 km',
    rating: 4.1,
    hours: '9:00 AM - 10:00 PM',
    coordinates: { latitude: 13.0368, longitude: 80.2676 },
  },
  {
    id: '6',
    name: 'Medikart Pharmacy',
    address: '89 Velachery, Chennai',
    distance: '5.2 km',
    rating: 4.0,
    hours: '8:30 AM - 9:30 PM',
    coordinates: { latitude: 12.9815, longitude: 80.2180 },
  },
  {
    id: '7',
    name: 'LifeCare Pharmacy',
    address: '34 Porur, Chennai',
    distance: '7.1 km',
    rating: 4.4,
    hours: '8:00 AM - 10:00 PM',
    coordinates: { latitude: 13.0374, longitude: 80.1575 },
  },
  {
    id: '8',
    name: 'Health & Glow',
    address: '22 Nungambakkam, Chennai',
    distance: '1.8 km',
    rating: 4.6,
    hours: '9:00 AM - 11:00 PM',
    coordinates: { latitude: 13.0569, longitude: 80.2425 },
  }
];

export default function PharmacyScreen() {
  const [pharmacies, setPharmacies] = useState(CHENNAI_PHARMACIES);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  const handlePharmacySelect = (id: string) => {
    setSelectedPharmacy(id);
  };

  const openMapsWithDirections = (pharmacy: typeof CHENNAI_PHARMACIES[0]) => {
    const { coordinates, name, address } = pharmacy;
    const { latitude, longitude } = coordinates;
    
    // Create the maps URL based on platform
    let url = '';
    
    if (Platform.OS === 'ios') {
      // Apple Maps URL format
      url = `maps:?q=${name}&ll=${latitude},${longitude}`;
    } else if (Platform.OS === 'android') {
      // Google Maps URL format for Android
      url = `geo:${latitude},${longitude}?q=${encodeURIComponent(name + ', ' + address)}`;
    } else {
      // Google Maps URL for web
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}&query_place_id=${latitude},${longitude}`;
    }
    
    // Open the URL
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web URL if the maps app isn't available
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((error) => console.error('Error opening maps:', error));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chennai Pharmacies</Text>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <ChennaiMap selectedPharmacy={selectedPharmacy || undefined} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TouchableOpacity style={styles.searchBar}>
          <Text style={styles.searchText}>Search pharmacies in Chennai...</Text>
        </TouchableOpacity>
      </View>

      {/* Pharmacy List */}
      <ScrollView style={styles.pharmacyList}>
        {pharmacies.map((pharmacy) => (
          <TouchableOpacity
            key={pharmacy.id}
            style={[
              styles.pharmacyCard,
              selectedPharmacy === pharmacy.id && styles.selectedPharmacyCard,
            ]}
            onPress={() => handlePharmacySelect(pharmacy.id)}
          >
            <View style={styles.pharmacyIconContainer}>
              <MapPin size={24} color="#4F46E5" />
            </View>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>{pharmacy.name}</Text>
              <Text style={styles.pharmacyAddress}>{pharmacy.address}</Text>
              <Text style={styles.pharmacyDetails}>
                {pharmacy.distance} • {pharmacy.hours}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.directionsButton}
              onPress={() => openMapsWithDirections(pharmacy)}
            >
              <ExternalLink size={20} color="#4F46E5" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
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
  mapContainer: {
    height: 200,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
  },
  webMapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4B5563',
    marginTop: 10,
  },
  webMapSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
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
  searchText: {
    color: '#6B7280',
  },
  pharmacyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  pharmacyCard: {
    flexDirection: 'row',
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
  selectedPharmacyCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  pharmacyIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  pharmacyAddress: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  pharmacyDetails: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  directionsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});