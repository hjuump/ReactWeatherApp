import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {API_KEY} from '@env';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

function App(): React.JSX.Element {
  const [city, setCity] = useState('Loading...');
  const [ok, setOk] = useState(true);
  const [days, setDays] = useState<any[]>([]);

  const icons: Record<string, string> = {
    Clouds: 'cloud',
    Clear: 'wb-sunny',
    Atmosphere: 'blur-on',
    Snow: 'ac-unit',
    Rain: 'cloud-rain',
    Drizzle: 'grain',
    Thunderstorm: 'flash-on',
  };

  const getWeather = async () => {
    const hasPermission = await Geolocation.requestAuthorization('whenInUse');
    if (hasPermission === 'granted') {
      Geolocation.getCurrentPosition(
        async position => {
          const {latitude, longitude} = position.coords;

          // OpenStreetMap API를 사용한 Reverse Geocoding
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`,
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
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`,
          );
          const json = await response.json();
          setDays(json.list || []);
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
    getWeather();
  }, []);

  const getDayLabel = (timestamp: number) => {
    const today = new Date();
    const date = new Date(timestamp * 1000);

    const isToday = today.toDateString() === date.toDateString();
    const isTomorrow =
      new Date(today.setDate(today.getDate() + 1)).toDateString() ===
      date.toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';

    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="tomato" />{' '}
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={styles.day}>
            <ActivityIndicator color="black" size="large" />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={styles.day_row}>
                <Text style={styles.temperture}>
                  {Math.round(day.main.temp)}
                </Text>
                <Icon
                  name={icons[day.weather[0]?.main] || 'help-outline'}
                  size={44}
                  color="black"
                />
              </View>

              <Text style={styles.description}>
                {day.weather[0]?.main || 'N/A'}
              </Text>
              <View style={styles.weatherInfo}>
                <Text style={styles.tinyText}>
                  {`${getDayLabel(day.dt)} · ${
                    day.weather[0]?.description || 'N/A'
                  }`}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
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
  },
  temperture: {
    marginTop: 50,
    marginBottom: -20,
    fontSize: 180,
    fontWeight: 600,
  },
  description: {
    fontSize: 50,
    fontWeight: 600,
    paddingLeft: 30,
  },
  weatherInfo: {
    opacity: 0.6,
  },
  tinyText: {
    fontSize: 17,
    fontWeight: 600,
    paddingLeft: 30,
  },
  day_row: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default App;
