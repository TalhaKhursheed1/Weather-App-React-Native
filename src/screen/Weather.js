import {
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ImageBackground,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { TextInput } from "react-native-paper";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { debounce, get } from "lodash";
import { fetchLocations, fetchWeatherForecast } from "./api/WeatherApi";
import { getData, storeData } from "./utils/asyncStorage";


const Weather = (navigation) => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weathers, setWeathers] = useState({});

  const handleLocation = (loc) => {
    console.log("location: ", loc);
    setLocations([]);
    toggleSearch(false);
    fetchWeatherForecast({
      cityName: loc.name,
      days: "7",
    }).then((data) => {
      setWeathers(data);
      storeData('city', loc.name); 
      console.log("got forecast:", data);
    });
  };
 

  const handleSearch = (value) => {
    if (value.length > 2) {
      fetchLocations({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };

  useEffect(()=>{
        fetchMyWeatherData();
  },[])

  const fetchMyWeatherData = async()=>{
    let myCity = await getData('city');
    let cityName = 'Gujranwala';
    if (myCity) cityName = myCity;
    fetchWeatherForecast({
      cityName,
      days: '7'
    }).then(data=>{
      setWeathers(data);
      
    })
  }
  const handleTextDebounce = useCallback(debounce(handleSearch, 1200, []));
  const { current, location } = weathers;

  return (
    <View>
      <ImageBackground
        style={{
          height: 700,
          width: 800,
        }}
        source={{
          uri: "https://c4.wallpaperflare.com/wallpaper/847/397/235/blurred-colorful-vertical-portrait-display-wallpaper-preview.jpg",
        }}
      >
        <View>
          {showSearch ? (
            <TextInput
              style={{
                // margin:10,
                marginLeft: 20,
                width: 350,
                borderRadius: 50,
                borderTopStartRadius: 50,
                borderTopEndRadius: 50,
                padding: 5,
                height: 40,
                marginTop: 30,
                color: "white",
              }}
              onChangeText={handleTextDebounce}
              placeholderTextColor={"gray"}
              placeholder="Search City"
              underlineColor="transparent"
            />
          ) : null}

          <TouchableOpacity
            style={{
              height: 55,
              width: 55,
            }}
            onPress={() => toggleSearch(!showSearch)}
          >
            <Image
              source={{
                url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkCFtLQ9ogwxn_MFETJb8Kq35UHRZFz9ovNQ&usqp=CAU",
              }}
              style={{
                height: 40,
                width: 40,
                marginBottom: 50,
                marginLeft: 330,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </View>

        {locations.length > 0 && showSearch ? (
          <View
            style={{
              borderRadius: 20,
              backgroundColor: "white",
              marginLeft: 10,
              width: 360,
              borderTopEndRadius: 20,
            }}
          >
            {locations.map((loc, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    paddingHorizontal: 30,
                    padding: 5,
                    alignItems: "center",
                  }}
                  onPress={() => handleLocation(loc)}
                >
                  <Image
                    source={require("../images/computer-icons-location-clip-art-location-icon.jpg")}
                    style={{
                      marginRight: 300,
                      height: 20,
                      width: 20,
                      backgroundColor: "grey",
                    }}
                  />
                  <Text
                    style={{
                      bottom: 20,
                      marginRight: 25,
                      fontSize: 18,
                    }}
                  >
                    {loc?.name}, {loc?.country}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}

        <View
          style={{
            marginTop: 2,
            bottom: 10,
          }}
        >
          <Text
            style={{
              fontSize: 35,
              padding: 30,
              fontWeight: "bold",
              marginLeft: 75,
              color: "white",
              bottom: 20,
            }}
          >
            {location?.name},
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                color: "black",
              }}
            >
              {" " + location?.country}
            </Text>
          </Text>
          <View
            style={{
              bottom: 20,
            }}
          >
            <Image
              source={{ uri: "https:" + current?.condition?.icon }}
              style={{
                marginLeft: 80,
                bottom: 20,
                height: 200,
                width: 200,
              }}
            />
            <Text
              style={{
                fontSize: 60,
                bottom: 20,
                marginLeft: 150,
                margin: "1%",
                color: "white",
              }}
            >
              {current?.temp_c}&#176;
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginLeft: 140,
                margin: "1%",
                color: "white",
                bottom: 30,
              }}
            >
              {current?.condition?.text}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
              style={{
                marginTop: 10,
                width: 350,
              }}
            >
            {
              weathers?.forecast?.forecastday?.map((Item, index)=> {
                let date = new Date(Item.date);
                let options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);

                return(
                  
                  <View
                style={{
                  borderRadius: 10,
                  margin: 4,
                  borderTopStartRadius: 10,
                  borderTopEndRadius: 10,
                  padding: 10,
                  padding: 10,
                  marginRight: 10,
                  borderWidth: 1,
                  width: 120,
                  borderColor: "#ccc",
                  alignItems: "center",
                }}
                key={index}
              >
              
                <Image
                  source={{ uri: "https:" +Item?.day?.condition?.icon}}
                  style={{
                    marginTop: 1,
                    height: 45,
                    width: 45,
                  }}
                />
                <Text
                  style={{
                    alignContent: "center",
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {dayName}
                </Text>
                <Text
                  style={{
                    alignContent: "center",
                    textAlign: "center",
                    fontSize: 15,
                  }}
                >
                  {Item?.day?.avgtemp_c}&#176;
                </Text>
              </View>
                )

              })
            }

            </ScrollView>
          </View>
          {/* <View>
          <ScrollView horizontal contentContainerStyle={styles.container}
          showsHorizontalScrollIndicator={false}
          
         >
         {forecastData.map((data, index) => (
        <View style={styles.day} key={index}>
          <Text style={styles.dayText}>{data.day}</Text>
          <Image source={data.image} style={styles.weatherImage} />
          <Text>{current?.temp_c}</Text>
          <Text>{data.condition}</Text>
        </View>
      ))}
        </ScrollView>
   </View> */}

          <View
            style={{
              marginLeft: 0,
              bottom: 110,
            }}
          >
            <Image
              source={require("../images/calendar.png")}
              style={{
                marginLeft: 10,
                bottom: 65,
                height: 30,
                width: 30,
              }}
            />
            <Text
              style={{
                alignContent: "center",
                marginLeft: 50,
                bottom: 85,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              Daily Forecast
            </Text>
          </View>

          <View
            style={{
              bottom: 30,
            }}
          >
            <View
              style={{
                bottom: 10,
              }}
            >
              <Image
                source={require("../images/wind.png")}
                style={{
                  marginLeft: 20,
                  marginTop: 1,
                  height: 40,
                  width: 40,
                }}
              />
              <Text
                style={{
                  alignContent: "center",
                  marginLeft: 70,
                  bottom: 30,
                  fontSize: 15,
                }}
              >
                {current?.wind_kph}km
              </Text>
            </View>
            <View
              style={{
                marginLeft: 120,
                bottom: 70,
              }}
            >
              <Image
                source={require("../images/water.png")}
                style={{
                  marginLeft: 20,
                  height: 40,
                  width: 40,
                }}
              />
              <Text
                style={{
                  alignContent: "center",
                  marginLeft: 70,
                  bottom: 30,
                  fontSize: 15,
                }}
              >
                {current?.humidity}%
              </Text>
            </View>
            <View
              style={{
                marginLeft: 240,
                bottom: 128,
              }}
            >
              <Image
                source={require("../images/sun.png")}
                style={{
                  marginLeft: 20,
                  height: 40,
                  width: 40,
                }}
              />
              <Text
                style={{
                  alignContent: "center",
                  marginLeft: 70,
                  bottom: 30,
                  fontSize: 15,
                }}
              >
                {weathers?.forecast?.forecastday[0]?.astro?.sunrise}
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default Weather;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  day: {
    width: 150,
    padding: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  dayText: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  weatherImage: {
    width: 30,
    height: 30,
    marginBottom: 10,
  },
});
