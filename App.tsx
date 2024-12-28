import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Dimensions, ScrollView} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

function App(): React.JSX.Element {
  const [city, setCity] = useState('Loading...');
  const [ok, setOk] = useState(true);
  const getPermission = async () => {
    const hasPermission = await Geolocation.requestAuthorization('whenInUse');
    if (hasPermission === 'granted') {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

          // OpenStreetMap API를 사용한 Reverse Geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            );
            const data = await response.json();
            const cityName =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              'Unknown location';
            setCity(cityName);
          } catch (error) {
            console.error('Reverse geocoding failed:', error);
            setCity('Error fetching location');
          }
        },
        error => {
          console.error(error);
          setOk(false);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    } else {
      setOk(false);
    }
  };

  useEffect(() => {
    getPermission();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temperture}>-1</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperture}>-1</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperture}>-1</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperture}>-1</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temperture}>-1</Text>
          <Text style={styles.description}>Sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 50,
    fontWeight: 700,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temperture: {
    marginTop: 50,
    marginBottom: -30,
    fontSize: 180,
  },
  description: {
    fontSize: 50,
  },
});

export default App;
