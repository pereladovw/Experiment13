import React from 'react';
import {Alert, Button, StyleSheet, View} from 'react-native';
import {STAGES} from '../constants';

const NewParticipant = ({selectExperiment, selectNewParticipant}) => {
  const handleNewParticipant = () => {
    Alert.alert('New Participant?', null, [
      {text: 'No', style: 'cancel'},
      {text: 'Yes', onPress: () => selectExperiment(STAGES.NEW_PURTICIPANT)},
    ]);
  };
  const handleExpOne = () => {
    Alert.alert('Start Experiment One?', null, [
      {text: 'No', style: 'cancel'},
      {text: 'Yes', onPress: () => selectExperiment(STAGES.EXP_ONE)},
    ]);
  };
  const handleExpTwo = () => {
    Alert.alert('Start Experiment Two?', null, [
      {text: 'No', style: 'cancel'},
      {text: 'Yes', onPress: () => selectExperiment(STAGES.EXP_TWO)},
    ]);
  };
  return (
    <View style={styles.mainContainer}>
      <Button
        style={styles.button}
        title="Experiment One"
        color={'white'}
        onPress={handleExpOne}
      />
      <Button
        style={styles.button}
        title="Experiment Two"
        color={'white'}
        onPress={handleExpTwo}
      />
      <Button
        style={styles.button}
        title="New Participant"
        color={'white'}
        onPress={handleNewParticipant}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: 'white',
    color: 'white',
    width: 200,
    borderRadius: 8,
    borderWidth: 2,
    padding: 6,
    fontSize: 20,
    marginBottom: 25,
  },
  button: {
    height: 30,
  },
});

export default NewParticipant;
