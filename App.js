import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';
import QuranPlayer from './screens/QuranPlayer';

const App = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <QuranPlayer />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})