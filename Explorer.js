import { StyleSheet, View, FlatList, } from 'react-native';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SQLite from 'expo-sqlite';
import { Button, TextInput, Text, Card, Icon } from 'react-native-paper';

export default function Explorer() {

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
                label="Product"
                style={styles.input}
                onChangeText={product => setProduct(product)}
                value={product}
            />
            <TextInput
                label="Amount"
                style={styles.input}

                keyboardType='numeric'
                onChangeText={amount => setAmount(amount)}
                value={amount}
            />

            <Button style={styles.button} mode="contained" icon="content-save-outline" onPress={saveItem}>Save</Button>

            <FlatList
                style={styles.list}
                keyExtractor={item => item.id.toString()}
                data={groceries}
                renderItem={({ item }) =>

                    <Card style={styles.card}>
                        <Card.Content style={styles.listitem}>
                            <Text variant='bodyMedium'>{item.product}</Text>
                            <Text variant="bodySmall">{item.amount}</Text>

                        </Card.Content>
                        <Card.Actions>
                            <Icon style={styles.deleting} source="delete" color='red' size={30} ></Icon>
                        </Card.Actions>
                    </Card>
                }

            />
            < StatusBar style="auto" />
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },

    listitem: {

    },

    input: {
        width: "90%",
        marginBottom: 5
    },
    list: {
        marginTop: 10, width: '90%'
    },
    deleting: {
        alignItems: "center",

    },
    button: {
        width: 200
    },
    card: {
        marginBottom: 5,

    }
});