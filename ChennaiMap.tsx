import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import GoogleMapReact from 'google-map-react';
import { MapPin } from 'lucide-react-native';

// Chennai pharmacy data
const CHENNAI_PHARMACIES = [
  {
    id: '1',
    name: 'Apollo Pharmacy',
    address: '23 Mount Road, Chennai',
    coordinates: { latitude: 13.0827, longitude: 80.2707 },
  },
  {
    id: '2',
    name: 'MedPlus Pharmacy',
    address: '45 Anna Nagar, Chennai',
    coordinates: { latitude: 13.0850, longitude: 80.2750 },
  },
  {
    id: '3',
    name: 'Netmeds Pharmacy',
    address: '78 T Nagar, Chennai',
    coordinates: { latitude: 13.0810, longitude: 80.2680 },
  },
  {
    id: '4',
    name: 'Wellness Forever',
    address: '112 Adyar, Chennai',
    coordinates: { latitude: 13.0060, longitude: 80.2545 },
  },
  {
    id: '5',
    name: 'Guardian Pharmacy',
    address: '56 Mylapore, Chennai',
    coordinates: { latitude: 13.0368, longitude: 80.2676 },
  },
  {
    id: '6',
    name: 'Medikart Pharmacy',
    address: '89 Velachery, Chennai',
    coordinates: { latitude: 12.9815, longitude: 80.2180 },
  },
  {
    id: '7',
    name: 'LifeCare Pharmacy',
    address: '34 Porur, Chennai',
    coordinates: { latitude: 13.0374, longitude: 80.1575 },
  },
  {
    id: '8',
    name: 'Health & Glow',
    address: '22 Nungambakkam, Chennai',
    coordinates: { latitude: 13.0569, longitude: 80.2425 },
  }
];

// Chennai center coordinates
const CHENNAI_CENTER = {
  lat: 13.0827,
  lng: 80.2707
};

// Marker component for web
const MapMarker = ({ text, lat, lng }: { text: string, lat: number, lng: number }) => {
  const handleClick = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      style={{
        position: 'absolute',
        transform: 'translate(-50%, -100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
      }}
      onClick={handleClick}
    >
      <div style={{
        color: '#4F46E5',
        backgroundColor: 'white',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        marginBottom: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }}>
        {text}
      </div>
      <div style={{
        color: '#4F46E5',
        fontSize: '24px',
      }}>
        📍
      </div>
    </div>
  );
};

// HTML for embedded Google Maps in WebView
const getMapHTML = () => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body, html, #map {
      height: 100%;
      margin: 0;
      padding: 0;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    function initMap() {
      const chennai = { lat: 13.0827, lng: 80.2707 };
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: chennai,
      });

      // Add markers for pharmacies
      const pharmacies = [
        { position: { lat: 13.0827, lng: 80.2707 }, title: "Apollo Pharmacy" },
        { position: { lat: 13.0850, lng: 80.2750 }, title: "MedPlus Pharmacy" },
        { position: { lat: 13.0810, lng: 80.2680 }, title: "Netmeds Pharmacy" },
        { position: { lat: 13.0060, lng: 80.2545 }, title: "Wellness Forever" },
        { position: { lat: 13.0368, lng: 80.2676 }, title: "Guardian Pharmacy" },
        { position: { lat: 12.9815, lng: 80.2180 }, title: "Medikart Pharmacy" },
        { position: { lat: 13.0374, lng: 80.1575 }, title: "LifeCare Pharmacy" },
        { position: { lat: 13.0569, lng: 80.2425 }, title: "Health & Glow" }
      ];

      pharmacies.forEach(pharmacy => {
        const marker = new google.maps.Marker({
          position: pharmacy.position,
          map,
          title: pharmacy.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#4F46E5",
            fillOpacity: 1,
            strokeWeight: 0,
            scale: 8
          }
        });
        
        // Add click listener to open directions
        marker.addListener("click", () => {
          window.open(\`https://www.google.com/maps/dir/?api=1&destination=\${pharmacy.position.lat},\${pharmacy.position.lng}\`, '_blank');
        });
      });
    }
  </script>
  <script async defer src="https://maps.googleapis.com/maps/api/js?callback=initMap"></script>
</body>
</html>
`;

interface ChennaiMapProps {
  selectedPharmacy?: string;
}

const ChennaiMap: React.FC<ChennaiMapProps> = ({ selectedPharmacy }) => {
  const openMapsWithDirections = (latitude: number, longitude: number) => {
    // Create the maps URL based on platform
    let url = '';
    
    if (Platform.OS === 'ios') {
      // Apple Maps URL format
      url = `maps:?ll=${latitude},${longitude}`;
    } else if (Platform.OS === 'android') {
      // Google Maps URL format for Android
      url = `google.navigation:q=${latitude},${longitude}`;
    } else {
      // Google Maps URL for web
      url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }
    
    // Open the URL
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to Google Maps web URL if the maps app isn't available
          const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((error) => console.error('Error opening maps:', error));
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: '' }} // No API key needed for basic display
          defaultCenter={CHENNAI_CENTER}
          defaultZoom={12}
          options={{
            fullscreenControl: false,
            zoomControl: false,
          }}
        >
          {CHENNAI_PHARMACIES.map((pharmacy) => (
            <MapMarker
              key={pharmacy.id}
              lat={pharmacy.coordinates.latitude}
              lng={pharmacy.coordinates.longitude}
              text={pharmacy.name}
            />
          ))}
        </GoogleMapReact>
      </View>
    );
  } else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // For native platforms, use react-native-maps
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 13.0827,
            longitude: 80.2707,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {CHENNAI_PHARMACIES.map((pharmacy) => (
            <Marker
              key={pharmacy.id}
              coordinate={pharmacy.coordinates}
              title={pharmacy.name}
              description={pharmacy.address}
              pinColor="#4F46E5"
              onPress={() => openMapsWithDirections(pharmacy.coordinates.latitude, pharmacy.coordinates.longitude)}
            />
          ))}
        </MapView>
      </View>
    );
  } else {
    // Fallback for other platforms
    return (
      <View style={styles.container}>
        <WebView
          source={{ html: getMapHTML() }}
          style={styles.map}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default ChennaiMap;