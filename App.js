import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, FlatList, Button } from 'react-native';
import { useState, useEffect } from 'react';
import * as SQLite from 'expo-sqlite';

export default function App() {

  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [groceries, setGroceries] = useState([]);

  const db = SQLite.openDatabaseSync('groceriesdb');

  const initialize = async () => {
    try {
      await db.execAsync(`
      CREATE TABLE IF NOT EXISTS groceries (id INTEGER PRIMARY KEY NOT NULL, amount INT, product TEXT);
    `);
      await updateList();
    } catch (error) {
      console.error('Could not open database', error);
    }
  }

  const saveItem = async () => {
    try {
      await db.runAsync('INSERT INTO groceries VALUES (?, ?, ?)', null, amount, product);
      await updateList();
      setAmount("")
      setProduct("")
    } catch (error) {
      console.error('Could not add item', error);
    }
  };

  const updateList = async () => {
    try {
      const list = await db.getAllAsync('SELECT * from groceries');
      setGroceries(list);
    } catch (error) {
      console.error('Could not get items', error);
    }
  }

  const deleteItem = async (id) => {
    console.log('deleteItem')
    try {
      await db.runAsync('DELETE FROM groceries WHERE id=?', id);
      await updateList();
    }
    catch (error) {
      console.error('Could not delete item', error);
    }
  }

  useEffect(() => { initialize() }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product}
      />
      <TextInput
        style={styles.input}
        placeholder='Amount'
        keyboardType='numeric'
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      <Button onPress={saveItem} title='Save' />

      <FlatList
        style={styles.list}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<Text style={styles.header}>Shopping list</Text>}
        renderItem={({ item }) =>
          <View style={styles.listitem}>
            <Text >{item.product + ", "}</Text>
            <Text>{item.amount} </Text>
            <Text style={styles.deleting} onPress={() => deleteItem(item.id)}>Bought</Text>
          </View>}
        data={groceries}
      />
      <StatusBar style="auto" />
    </View>
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
