import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function App() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch('http://10.0.2.2:4000/quotes') // Для Android эмулятора
      .then((res) => res.json())
      .then((data) => setQuotes(data));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Resonance</Text>
      <FlatList
        data={quotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.text}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20
  }
});
