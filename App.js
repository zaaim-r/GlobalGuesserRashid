import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Moment, Vibration, Platform, Modal, View, Text, Button, TextInput, TouchableOpacity, SafeAreaView, Image, ImageBackground, Dimensions, Switch, Alert, ViewPagerAndroidComponent, Systrace, ScrollView, Touchable, FlatList } from 'react-native';
import { React, useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapView, {Polyline} from 'react-native-maps';
import { Marker } from "react-native-maps";
import { styleProps } from 'react-native-web/dist/cjs/modules/forwardedProps';


function HomeScreen({ navigation }) {
  const [showInstructions, setShowInstructions] = useState(false);
  return (
    <ImageBackground source={require('./assets/AppPics/startPic.jpg')} resizeMode="cover" style={styles.middleEast}>
      <SafeAreaView style={styles.container1}>
        <StatusBar style="auto" />
        <View style={{ ...styles.rowTitle, ...{ marginBottom: 350 }, ...styles.titleBox }}>
          <Text style={{ ...styles.title, ...{ fontFamily: 'HoeflerText-Regular' } }}>Mosque GlobalGuesser</Text>
        </View>
        <View style={styles.rowStartButtons }>
          <TouchableOpacity
            style={styles.startButton}
            title="Start Game"
            onPress={() => navigation.navigate('Play')}
          >
            <Text style={{ ...styles.startText, ...{ fontFamily: 'HoeflerText-Regular' } }}>Start!</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.rowStartButtons}>
          <TouchableOpacity
                style={styles.instructionsButton}
                title="Start Game"
                onPress={() => setShowInstructions(!showInstructions)}
              >
                <Text style={{ ...styles.instructionsButtonText, ...{ fontFamily: 'HoeflerText-Regular' } }}>Instructions</Text>
          </TouchableOpacity>
        </View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={showInstructions}
            onRequestClose={() => {
            setShowInstructions(!showInstructions);
            }}
          >
            <View style={styles.instructions}>
              <View style={styles.instructions2}>
                <Text style={styles.instructionsText}> 
                  Once you press start, an image of a certain mosque will pop up. Using the map provided, click on the location where you believe the mosque is located. Wherever
                  you tap, a red marker will show up to reflect that input. Once you decide on a location, click the "Guess" button below and a popup will show that reveals how
                  close you were to the true location and award you points based on that. After seeing how many points you get, click "Continue" to advance to the next round. 
                </Text>
                <TouchableOpacity style={{marginVertical: 50}} onPress={() => setShowInstructions(!showInstructions)}>
                  <Text style={styles.quit}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
}

//longitude is north to south
function GameScreen({ navigation }) {
  let locations = [
    { name: "Sheikh Lotfollah Mosque", url: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Sheikh_Lotfollah_Mosque%2C_Isfahan_03.jpg", latitude: 32.6574, longitude: 51.6787 },
    { name: "Hagia Sophia", url: "https://i.natgeofe.com/n/fb2063bb-3738-48bd-9938-a20d136d0c8b/hagia-sophia-mosque-b4753j_16x9.jpg", latitude: 41.0086, longitude: 28.9802 },
    { name: "Masjid Al Haram", url: "https://www.islamicarchitecturalheritage.com/wp-content/uploads/2018/05/al-masjid-al-haram.jpg", latitude: 21.4229, longitude: 39.8257 },
    { name: "Masjid Nabawi", url: "https://www.islamiclandmarks.com/wp-content/uploads/2016/01/Masjid-e-Nabwi-740x456.jpg", latitude: 24.4672, longitude: 39.6112 },
    { name: "Sheikh Zayed Mosque", url: "https://upload.wikimedia.org/wikipedia/en/7/7d/Sheikh_Zayed_Mosque_view.jpg", latitude: 24.4128, longitude: 54.4750 },
    { name: "Masjid Al Aqsa", url: "https://images.unsplash.com/photo-1552423314-cf29ab68ad73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YWwlMjBhcXNhJTIwbW9zcXVlfGVufDB8fDB8fA%3D%3D&w=1000&q=80", latitude: 31.7761, longitude: 35.2358 },
    { name: "Blue Mosque", url: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Ymx1ZSUyMG1vc3F1ZXxlbnwwfHwwfHw%3D&w=1000&q=80", latitude: 41.0054, longitude: 28.9768 },
    { name: "Hassan II Mosque", url: "https://www.moroccoworldnews.com/wp-content/uploads/2014/10/Hassan-II-Mosque-1024x768.jpg", latitude: 33.6085, longitude: -7.6328 },
    { name: "Faisal Mosque", url: "https://images.adsttc.com/media/images/5519/17c0/e58e/ceba/3f00/024c/large_jpg/11901985876_92e185fcf9_k.jpg?1427707787", latitude: 33.7295, longitude: 73.0372 },
    { name: "Crystal Mosque", url: "https://legacy.travelnoire.com/wp-content/uploads/2021/04/GettyImages-824675992.jpg", latitude: 5.3222, longitude: 103.1207 },
  ]
  const [places, setPlaces] = useState(locations);
  const [mount, setMount] = useState(false);

  useEffect(() => {
    if (!mount){
      shufflePlaces()
      //setShowCorrectLocation(!showCorrectLocation)
      setMount(!mount)
    }
  },[]);

  function shufflePlaces() {
    setPlaces(places.sort(() => Math.random() - 0.5))
  }
  function addMarker(x) {
    setState({ marker: x.nativeEvent.coordinate });
    setGuess(false);
  }
  function checkGuess() {
    setShowCorrectLocation(!showCorrectLocation);
    setShowResult(!result);
    let temp = findDistance(
      places[round - 1].latitude, 
      places[round - 1].longitude, 
      state.marker.latitude, 
      state.marker.longitude
    );
    findMidpoint(
      deg2rad(places[round - 1].latitude), 
      deg2rad(places[round - 1].longitude), 
      deg2rad(state.marker.latitude), 
      deg2rad(state.marker.longitude)
    );
    setDistance(temp);
    setScore(score => score + Math.round((4999.91*Math.pow(0.998036, temp))))
  }

  function getScore(){
    setDistance(temp)
    setScore(score => score + Math.round((5000*Math.exp(temp/-5000))))
  }

  function backToGame() {
    setShowCorrectLocation(!showCorrectLocation)
    setShowResult(!result)
    setState({marker: null});
    setGuess(true)
    if (round == 10){
      setGameOver(!gameOver)
      return;
    }
    setRound(round + 1)
  }

  function findDistance(lat1, lon1, lat2, lon2){
    var R = 6371;
    var dLat = deg2rad(lat2-lat1);
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d;
  }
  function getScore(){
    
  }

function deg2rad(deg) {
  return deg * (Math.PI/180)
}
function rad2deg(rad){
  return rad * (180/Math.PI)
}
function findMidpoint(lat1, lon1, lat2, lon2){
  const Bx = Math.cos(lat2) * Math.cos(lon2-lon1)
  const By = Math.cos(lat2) * Math.sin(lon2-lon1);
  const lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2),
  Math.sqrt( (Math.cos(lat1)+Bx)*(Math.cos(lat1)+Bx) + By*By ) );
  const lon3 = lon1 + Math.atan2(By, Math.cos(lat1) + Bx)
  setMidpoint({
    latitude: rad2deg(lat3),
    longitude: rad2deg(lon3),
  })
}

  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [currentPlace, setCurrentPlace] = useState();
  const [showCorrectLocation, setShowCorrectLocation] = useState(false);
  const [result, setShowResult] = useState(false);
  const [guess, setGuess] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [midpoint, setMidpoint] = useState({latitude: 0, longitude: 0});
  const [distance, setDistance] = useState(0);
  const [state, setState] = useState({
    marker: null
  });

  console.log(state.marker)

  return (
    <View style={styles.container2}>
      <View style={styles.scoreBox}>
        <Text style={{ ...styles.scoreText, ...{ fontFamily: 'HoeflerText-Regular' } }}>Round: {round}/10 Score: {score}</Text>
      </View>
      <View style={styles.rowPic}>
        <Image
          style={styles.location}
          source={{uri: places[round - 1].url}}
        />
      </View>
      <View style={styles.rowMap}>
        <MapView
          initialRegion={{
            latitude: 29.2985,
            longitude: 42.5510,
            latitudeDelta: 80,
            longitudeDelta: 80,
          }}
          style={styles.map}
          onPress={(x) => addMarker(x)}
        >
          {
            state.marker &&
            <Marker coordinate={state.marker} />
          }
        </MapView>
      </View>
      <View style={styles.rowButtons}>
        <View style={styles.column}>
          <TouchableOpacity
            style={styles.guessButton}
            title="Start Game"
            onPress={checkGuess}
            disabled={guess}
          >
            <Text style={{ ...styles.guessText, ...{ fontFamily: 'HoeflerText-Regular' } }}>Guess!</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType='slide'
        visible={result}
      >
        <SafeAreaView style={styles.container2}>
          <View style={styles.rowResult}>
            <Text style={styles.locationDistance}>You were {Math.floor(distance)} km away from the location!</Text>
          </View>
          <View style={styles.rowMap2}>
            <MapView
              initialRegion={{
                longitude: midpoint.longitude,
                latitude: midpoint.latitude,
                latitudeDelta: 80,
                longitudeDelta: 80,
              }}
              style={styles.map}
              rotateEnabled={false}
            >
              {
              showCorrectLocation && 
              <Marker 
                coordinate={{
                  latitude: places[round - 1].latitude,
                  longitude: places[round - 1].longitude,
                }}
                pinColor='green'
              />
              }
              {
              showCorrectLocation &&
              <Marker
                coordinate={{
                  latitude: state.marker.latitude,
                  longitude: state.marker.longitude,
                }}
                pinColor='red'
              />
              }
              {
              showCorrectLocation &&
              <Polyline
                coordinates={[
                  { latitude: places[round - 1].latitude, longitude: places[round - 1].longitude },
                  { latitude: state.marker.latitude, longitude: state.marker.longitude },
                ]}
              />
              }
            </MapView>
          </View>
          <View style={styles.rowContinue}>
            <TouchableOpacity
              style={styles.guessButton}
              onPress={() => backToGame()}
            >
              <Text style={{ ...styles.guessText, ...{ fontFamily: 'HoeflerText-Regular' } }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
      <Modal
            animationType="slide"
            transparent={true}
            visible={gameOver}
            onRequestClose={() => {
            setGameOver(!gameOver);
            }}
          >
            <View style={styles.gameOverScreen}>
              <View style={styles.gameOverScreen2}>
                <Text style={styles.gameOverText}>Game over!</Text>
                <Text style={styles.gameOverText}>Final score: {score}</Text>
                <TouchableOpacity style={{marginVertical: 140}} onPress={() => navigation.navigate("Home")}>
                  <Text style={styles.quit}>Back to Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
    </View>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="Play"
          component={GameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    //backgroundColor: '#C2B280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container2: {
    flex: 1,
    backgroundColor: '#C2B280',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTitle: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    //height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowStartButtons: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowPic: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "42%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowMap: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "42%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowButtons: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "16%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowResult: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowMap2: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  rowContinue: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    //backgroundColor: "grey",
    height: 60,
    width: 60,
  },
  title: {
    fontSize: 70,
    textAlign: 'center',
    color: "black",
  },
  title2: {
    fontSize: 50,
    textAlign: 'center',
    color: "black",
  },
  startButton: {
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: "white",
    width: "40%",
    height: "75%",
    justifyContent: "center",
    opacity: 0.75,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  startText: {
    textAlign: "center",
    color: "black",
    fontSize: 60,
  },
  instructionsButton: {
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: "white",
    width: "25%",
    height: "50%",
    justifyContent: "center",
    opacity: 0.75,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  instructionsButtonText: {
    textAlign: "center",
    color: "black",
    fontSize: 20,
  },
  instructionsText: {
    fontSize: 20, 
    color: "white", 
    textAlign: "center", 
    marginHorizontal: 10 
  },
  gameOverText: {
    fontSize: 50, 
    color: "white", 
    textAlign: "center", 
    marginHorizontal: 10 
  },
  quitButton: {
    //borderWidth: 3,
    //borderRadius: 10,
    //backgroundColor: "white",
    width: "75%",
    height: "25%",
    justifyContent: "center",
    alignItems: "center",
    //opacity: 0.75,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  quit: {
    fontSize: 40, 
    color: "black", 
    textAlign: "center", 
    marginHorizontal: 10 
  },
  instructions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  instructions2: {
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60,
    paddingTop: 10,
    backgroundColor: 'rgba(191, 127, 44, 0.9)',
    borderRadius: 10,
  },
  instructions: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameOverScreen2: {
    width: Dimensions.get('window').width - 60,
    height: Dimensions.get('window').width - 60,
    paddingTop: 10,
    backgroundColor: 'rgba(191, 127, 44, 0.9)',
    borderRadius: 10,
  },
  guessText: {
    textAlign: "center",
    color: "black",
    fontSize: 90,
  },
  guessButton: {
    borderWidth: 3,
    borderRadius: 10,
    backgroundColor: "white",
    width: "65%",
    height: "100%",
    justifyContent: "center",
    opacity: 0.75,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  locationDistance: {
    textAlign: "center",
    color: "black",
    fontSize: 60,
  },
  middleEast: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    flexDirection: "row",
    width: Dimensions.get('window').width,
    height: "100%",
  },
  location: {
    resizeMode: "cover",
    width: Dimensions.get('window').width,
    height: "100%",
  },
  scoreBox: {
    flexDirection: "row",
    width: 120,
    height: 40,
    alignSelf: "flex-end",
    zIndex: 1,
    backgroundColor: "white",
    //borderRadius: 10,
    borderBottomLeftRadius: 100,
    borderTopLeftRadius: 10,
    marginLeft: 300,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    top: 20
  },
  scoreText: {
    textAlign: "center",
    color: "black",
    fontSize: 15,
  },
});