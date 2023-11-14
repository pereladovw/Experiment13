/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import MainContainer from './components/Main';
import Field from './components/Field';

const DEFAULT_PARTICIPANT = {
  number: '',
  sessionNumber: '',
  gender: '',
  age: '',
};

console.disableYellowBox = true;

function App() {
  const [participant, setParticipant] = useState(DEFAULT_PARTICIPANT);
  const [stage, setStage] = useState(0);

  const saveNewParticipant = useCallback(
    newParticipant => {
      setParticipant(newParticipant);
      setStage(1);
    },
    [setStage, setParticipant],
  );

  const onExamFinish = useCallback(data => {
    console.log(data);
  }, []);

  const screen = useMemo(() => {
    switch (stage) {
      case 0:
        return <MainContainer saveNewParticipant={saveNewParticipant} />;
      case 1:
        return <Field onFinish={onExamFinish} />;
      default:
        break;
    }
  }, [saveNewParticipant, onExamFinish, stage]);

  return (
    <SafeAreaView style={[styles.mainContainer]}>
      <StatusBar hidden />
      {screen}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
