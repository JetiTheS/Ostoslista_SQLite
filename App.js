import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button } from 'react-native';
import { useState, useEffect } from 'react';

import { PaperProvider, Appbar } from 'react-native-paper';
import Explorer from './Explorer';

export default function App() {




  return (
    <PaperProvider>
      <Appbar mode="center-aligned" elevated>
        <Appbar.Content title="Shopping list" />
      </Appbar>
      <Explorer />
      <StatusBar style="auto" />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  list: {
    marginTop: 20,
    fontWeight: "bold"


  },
  header: {
    fontSize: 20,

  },
  listitem: {

    flexDirection: "row",
  },
  deleting: {
    marginLeft: 10,
    color: '#0000ff',

  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 5,
    width: 200
  }
});
