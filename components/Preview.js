import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';

const Preview = ({onPress, targets, blockNumber, itemD}) => {
  const renderTargets = targets.map(t => (
    <View key={t} style={[{height: itemD, width: itemD}, styles[t]]} />
  ));

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.mainContainer}>
        <Text style={styles.title}>Block #{blockNumber}</Text>
        <View style={styles.examples}>{renderTargets}</View>
        <Text style={styles.subtitle}>
          Tap on the screen to start the block
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: -20,
    color: 'white',
    fontSize: 20,
    marginBottom: 40,
  },
  subtitle: {
    marginTop: 20,
    color: 'white',
    fontSize: 20,
  },
  examples: {
    flexDirection: 'row',
    width: 150,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  redCircle: {
    backgroundColor: 'red',
    borderRadius: 200,
  },
  greenSquare: {
    backgroundColor: 'green',
  },
  greenCircle: {
    backgroundColor: 'green',
    borderRadius: 200,
  },
  redSquare: {
    backgroundColor: 'red',
  },
  yellowCircle: {
    backgroundColor: 'yellow',
    borderRadius: 200,
  },
  blueCircle: {
    backgroundColor: 'blue',
    borderRadius: 200,
  },
});

export default Preview;
