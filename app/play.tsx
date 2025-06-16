import { StyleSheet, Text, View } from 'react-native';

export default function Play() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Play Screen!</Text>
      <Text style={styles.subtext}>You have successfully logged in.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
}); 