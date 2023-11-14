import React, {useCallback, useMemo, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import MainContainer from './components/Main';
import EndScreen from './components/EndScreen';
import Field from './components/Field';
import moment from 'moment';

const headerString =
  'block_n,trial_n,block_type,condition,n_dist_around,' +
  'target1,target1_pos,dist_target1,' +
  'target2,target2_pos,dist_target2,' +
  'dist1,dist1_pos,dist_dist1,' +
  'dist2,dist2_pos,dist_dist2,' +
  'dist3,dist3_pos,dist_dist3,' +
  'dist4,dist4_pos,dist_dist4,' +
  'dist5,dist5_pos,dist_dist5,' +
  'dist6,dist6_pos,dist_dist6,' +
  'target_selected,pressed_position,type_selected,switch,selection_time,' +
  'participant,session,gender,age,date\n';

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
  const [resultData, setResultData] = useState(0);

  const saveNewParticipant = useCallback(
    newParticipant => {
      setParticipant(newParticipant);
      setStage(1);
    },
    [setStage, setParticipant],
  );

  // const saveStep = useCallback(
  //   data => {
  //     let stepData = data.map(i => i + ',').join('');
  //     stepData += participant.map(v => v + ',').join('');
  //     saveData += stepData;
  //   },
  //   [participant],
  // );

  const onExamFinish = useCallback(
    data => {
      const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/participant${
        participant[0]
      }_${moment().format('DD_MM_YY_hh_mm')}.csv`;
      let saveData = headerString;
      data.trialData.forEach((i, index, arr) => {
        let _switch = 0;
        if (index > 0) {
          const prevItem = arr[index - 1];
          if (
            i.trial !== 1 &&
            index > 0 &&
            i.blockNumber === prevItem.blockNumber &&
            i.typeSelected !== prevItem.typeSelected
          ) {
            _switch = i.targetSelected ? 1 : 2;
          }
        }

        let result =
          `${i.blockNumber},${i.trial},${i.blockType},${i.condition},${i.nDistAround},` +
          `${i.target1},${i.target1_pos},${i.dist_target1},` +
          `${i.target2},${i.target2_pos},${i.dist_target2},` +
          `${i.dist1},${i.dist1_pos},${i.dist_dist1},` +
          `${i.dist2},${i.dist2_pos},${i.dist_dist2},` +
          `${i.dist3},${i.dist3_pos},${i.dist_dist3},` +
          `${i.dist4},${i.dist4_pos},${i.dist_dist4},` +
          `${i.dist5},${i.dist5_pos},${i.dist_dist5},` +
          `${i.dist6},${i.dist6_pos},${i.dist_dist6},` +
          `${i.targetSelected},${i.pressedPosition},${
            i.typeSelected
          },${_switch},${i.timeForSeletion / 1000},`;
        result += participant.map(v => v + ',').join('');
        result = result.replace(/.$/, '\n');
        saveData += result;
      });
      RNFetchBlob.fs
        .writeFile(pathToWrite, saveData, 'utf8')
        .then(() => {
          setStage(2);
        })
        .catch(error => console.error(error));
      const _resultData = {
        correct: 0,
        incorrect: 0,
        time: 0,
        totalTime: data.totalTime,
      };
      data.trialData.forEach(a => {
        _resultData.time += a.timeForSeletion;
        a.targetSelected ? _resultData.correct++ : _resultData.incorrect++;
      });
      _resultData.commonTime = (
        _resultData.time / data.trialData.length
      ).toFixed(2);
      setResultData(_resultData);
    },
    [participant],
  );

  const screen = useMemo(() => {
    switch (stage) {
      case 0:
        return <MainContainer saveNewParticipant={saveNewParticipant} />;
      case 1:
        return <Field onFinish={onExamFinish} />;
      case 2:
        return (
          <EndScreen
            nextStep={() => {
              setParticipant(DEFAULT_PARTICIPANT);
              setStage(0);
            }}
            resultData={resultData}
          />
        );
      default:
        break;
    }
  }, [saveNewParticipant, onExamFinish, stage, resultData]);

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
