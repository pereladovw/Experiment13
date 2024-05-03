import React, {useState} from 'react';
import {
  Button,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import moment from 'moment';

const NewParticipant = ({saveNewParticipant, isDataSaved}) => {
  const [number, setNumber] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  return (
    <KeyboardAvoidingView style={styles.mainContainer} behavior={'padding'}>
      <TextInput
        value={number}
        onChangeText={setNumber}
        style={styles.input}
        placeholder="Participant number"
      />
      <TextInput
        value={gender}
        onChangeText={setGender}
        style={styles.input}
        placeholder="Gender"
      />
      <TextInput
        value={age}
        onChangeText={setAge}
        style={styles.input}
        placeholder="Age"
      />

      <Button
        title="New Participant"
        color={'white'}
        onPress={() =>
          saveNewParticipant([number, gender, age, moment().format()])
        }
      />
    </KeyboardAvoidingView>
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
});

export default NewParticipant;
