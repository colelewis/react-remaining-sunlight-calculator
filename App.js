import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SunCalc from 'suncalc';
import './assets/css/index.css';

export default function Droplet() {

  const prettyMilliseconds = require('pretty-ms');

  function formatSunsetTimeDifference(timeDifference) {
    var timeResult = Math.abs(timeDifference);
    if (timeDifference >= 0) {
      return (
        "Sunset is in " + prettyMilliseconds(timeResult) + "."
      )
    } 
    else if (timeDifference < 0) {
      return (
        "Sunset was " + prettyMilliseconds(timeResult) + " ago."
      )
    }
  }

  const utilDate = () => {
    const [now, setDate] = useState(new Date()); //use current date when triggering an update

    useEffect(() => {
      const timer = setInterval(() => {
        setDate(new Date());
      }, 1000);
      return () => {
        clearInterval(timer);
      }
    }, []);
    const timeInMs = now.getTime();
    const currentLocalDateTime = now.toTimeString();
    const currentDate = now.toUTCString();

    return {
      timeInMs,
      currentLocalDateTime,
      currentDate,
    };
  };

  function locationForm() {
    const [latitude, setLatitude] = useState(''); //initial value
    const [longitude, setLongitude] = useState('');

    var times = SunCalc.getTimes(new Date(), latitude, longitude);
    var timeDifference = times.sunset.getTime() - utilDate().timeInMs
    var currentTime = "Current time: " + utilDate().timeInMs

    if (latitude == 0 || longitude == 0) {
      return (
        <div>
          <input placeholder="latitude" onChange={e => setLatitude(e.target.value)} />
          <input placeholder="longitude" onChange={e => setLongitude(e.target.value)} />
        </div>
      );
    } else {
      return (
        <div>
          <input placeholder="latitude" onChange={e => setLatitude(e.target.value)} />
          <input placeholder="longitude" onChange={e => setLongitude(e.target.value)} />
              <View style ={styling.subcontainer}>
                <Text style={styling.subtext}>The Sun will set at {times.sunset.toUTCString()} for the given location!{"\n"}</Text>
                <Text style={styling.subtext}>This will occur at {times.sunset.toLocaleTimeString()} in your time!{"\n"}</Text>
                <Text style={styling.subtext}>
                  {formatSunsetTimeDifference(timeDifference)}
                </Text>
              </View>
          </div>
      );
    }
  }


  return (
    <View style={styling.container}>
      <Text style={styling.header}>Remaining Sunlight Calculator</Text>
      <Text style={styling.text}>The time is currently: {utilDate().currentDate}</Text>
      <Text style={styling.text}>Your local time is: {utilDate().currentLocalDateTime}</Text>
      <Text style={styling.text}>Please provide a location in decimal longitude and latitude below!</Text>
      {locationForm()}
      <StatusBar style="auto" />
    </View>
  );

}

const styling = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'papayawhip',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    marginTop: 30,
    flex: 2,
    alignItems: 'center',
    justifyContent: 'left',
  },
  text: {
    marginTop: 3,
    marginBottom: 11,
    padding: 6,
    fontFamily: 'OpenSansLight',
    fontSize: 22,
  },
  subtext: {
    fontFamily: 'OpenSansLight',
    fontSize: 19,
    padding: 20,
  },
  header: {
    fontFamily: 'OpenSansLight',
    fontSize: 55,
    marginBottom: 20,
    fontWeight: 'bold',
  },
});
