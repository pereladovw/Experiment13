import React from 'react';
import {
  Button,
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
} from 'react-native';

const EndScreen = ({nextStep, resultData}) => {
  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior={'padding'}>
      <Text style={styles.message}>Data saved. Thank You!</Text>

      <Button title="New Session" color={'white'} onPress={nextStep} />

      <View style={styles.testResult}>
        <Text style={styles.text}>
          Correct answers:{' '}
          {(
            (resultData.correct / (resultData.correct + resultData.incorrect)) *
            100
          ).toFixed(2)}
          %
        </Text>

        <Text style={styles.text}>
          Time per answer: {resultData.commonTime} ms
        </Text>
        <Text style={styles.text}>
          Total time: {(resultData.totalTime / 1000).toFixed(2)} s
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    borderColor: 'white',
    color: 'white',

    fontSize: 20,
    marginBottom: 140,
  },
  testResult: {position: 'absolute', top: 50, right: 50},
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default EndScreen;
