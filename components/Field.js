import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {Button, StyleSheet, View, Text, Dimensions} from 'react-native';
import Snapshot from './Snapshot';
import Preview from './Preview';

const {height, width, scale: screenScale} = Dimensions.get('screen');
const scale = param => param / screenScale;
const centerX = width / 2;
const centerY = height / 2;
const itemD = scale(40);
const snapshotR = scale(90);
const snapshotWidth = snapshotR * 2 + itemD;
const rToSnapshot = scale(500);

const practiceTrialsNumber = 5;
const trialsNumber = 110;

const BLOCKS = [
  {
    condition: 1,
    distNumber: 4,
    targets: ['redCircle', 'greenSquare'],
    distractors: ['greenCircle', 'redSquare'],
    type: 'conj',
  },
  {
    condition: 2,
    distNumber: 4,
    targets: ['greenCircle', 'redSquare'],
    distractors: ['redCircle', 'greenSquare'],
    type: 'conj',
  },
  {
    condition: 3,
    distNumber: 4,
    targets: ['yellowCircle', 'blueCircle'],
    distractors: ['greenCircle', 'redCircle'],
    type: 'feat',
  },
  {
    condition: 4,
    distNumber: 4,
    targets: ['greenCircle', 'redCircle'],
    distractors: ['yellowCircle', 'blueCircle'],
    type: 'feat',
  },
  {
    condition: 5,
    distNumber: 6,
    targets: ['redCircle', 'greenSquare'],
    distractors: ['greenCircle', 'redSquare'],
    type: 'conj',
  },
  {
    condition: 6,
    distNumber: 6,
    targets: ['greenCircle', 'redSquare'],
    distractors: ['redCircle', 'greenSquare'],
    type: 'conj',
  },
  {
    condition: 7,
    distNumber: 6,
    targets: ['yellowCircle', 'blueCircle'],
    distractors: ['greenCircle', 'redCircle'],
    type: 'feat',
  },
  {
    condition: 8,
    distNumber: 6,
    targets: ['greenCircle', 'redCircle'],
    distractors: ['yellowCircle', 'blueCircle'],
    type: 'feat',
  },
];

const snapshotCenters = [
  {x: centerX + rToSnapshot, y: centerY},
  {
    x: centerX + (rToSnapshot * Math.sqrt(2)) / 2,
    y: centerY + (rToSnapshot * Math.sqrt(2)) / 2,
  },
  {x: centerX, y: centerY + rToSnapshot},
  {
    x: centerX - (rToSnapshot * Math.sqrt(2)) / 2,
    y: centerY + (rToSnapshot * Math.sqrt(2)) / 2,
  },
  {x: centerX - rToSnapshot, y: centerY},
  {
    x: centerX - (rToSnapshot * Math.sqrt(2)) / 2,
    y: centerY - (rToSnapshot * Math.sqrt(2)) / 2,
  },
  {x: centerX, y: centerY - rToSnapshot},
  {
    x: centerX + (rToSnapshot * Math.sqrt(2)) / 2,
    y: centerY - (rToSnapshot * Math.sqrt(2)) / 2,
  },
];

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

let startTime = new Date().getTime();

let trialData = [];
let trialTime = new Date().getTime();

const Field = ({onFinish, saveStep}) => {
  const [trial, setTrial] = useState(-1);
  const [blocks, setBlocks] = useState(shuffle([...BLOCKS]));
  const [block, setBlock] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isNewBlock, setIsNewBlock] = useState(false);
  const [blockNumber, setBlockNumber] = useState(0);
  const [pause, setPause] = useState(false);
  const [practiceData, setPracticeData] = useState(null);
  const [practice, setPractice] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    if (!pause) {
      trialTime = new Date().getTime();
    }
  }, [pause]);

  const nextBlock = useCallback(() => {
    const _blocks = [...blocks];
    const _block = _blocks.shift();
    setTrial(-1);
    setBlock(_block);
    setBlocks(_blocks);
    setBlockNumber(blockNumber + 1);
    setIsNewBlock(true);
  }, [blocks, setBlock, setBlocks, setBlockNumber, blockNumber]);

  const onStart = useCallback(
    isPractice => {
      setPractice(isPractice);
      nextBlock();
      setIsStarted(true);
      startTime = new Date().getTime();
    },
    [nextBlock, setIsStarted, setPractice],
  );

  const onNextStep = useCallback(() => {
    setPause(true);
    setTrial(trial + 1);
    setTimeout(() => {
      setPause(false);
      // trialTime = new Date().getTime();
    }, 500);
  }, [setPause, setTrial, trial]);

  const onStepEnd = useCallback(
    (resultData, totalTime) => {
      const maxTrials = practice ? practiceTrialsNumber : trialsNumber;
      if (trial < maxTrials - 1) {
        onNextStep();
        return;
      }
      if (blocks.length > 0) {
        nextBlock();
        return;
      }
      if (practice) {
        setPracticeData(resultData);
        setBlocks(shuffle([...BLOCKS]));
        setBlock(null);
        setPause(false);
        setIsStarted(false);
        setBlockNumber(0);
        setIsNewBlock(false);
        setPractice(false);
        setTrial(-1);
      } else {
        onFinish({totalTime, trialData: resultData});
      }
      trialData = [];
    },
    [onNextStep, onFinish, blocks, nextBlock, practice, trial],
  );

  const onSnapshotPress = useCallback(
    itemIndex => {
      if (trial >= 0) {
        const items = {};
        let distrCounter = 0;
        centerItems.forEach((i, index) => {
          switch (i) {
            case block.targets[0]:
              items.target1 = block.targets[0];
              items.target1_pos = index;
              items.dist_target1 = aroundDistractorItems[index];
              break;
            case block.targets[1]:
              items.target2 = block.targets[1];
              items.target2_pos = index;
              items.dist_target2 = aroundDistractorItems[index];
              break;
            default:
              distrCounter++;
              items[`dist${distrCounter}`] = i;
              items[`dist${distrCounter}_pos`] = index;
              items[`dist_dist${distrCounter}`] = aroundDistractorItems[index];
              break;
          }
        });
        const data = {
          blockNumber,
          blockType: block.condition,
          condition: block.type,
          trial: trial + 1,
          nDistAround: block.distNumber,
          pressedPosition: itemIndex,
          timeForSeletion: new Date().getTime() - trialTime,
          typeSelected: centerItems[itemIndex],
          ...items,
          targetSelected: block.targets.includes(centerItems[itemIndex]),
        };
        trialData.push(data);
      }
      const totalTime = new Date().getTime() - startTime;
      if (trial >= 0 && !block.targets.includes(centerItems[itemIndex])) {
        setErrorMessage(true);
        setTimeout(() => {
          setErrorMessage(false);
          onStepEnd(trialData, totalTime);
        }, 300);
      } else {
        onStepEnd(trialData, totalTime);
      }
    },
    [onStepEnd, trial, block, blockNumber, centerItems, aroundDistractorItems],
  );

  const centerItems = useMemo(
    () =>
      shuffle([
        block?.targets[0],
        block?.targets[1],
        block?.distractors[Math.round(Math.random())],
        block?.distractors[Math.round(Math.random())],
        block?.distractors[Math.round(Math.random())],
        block?.distractors[Math.round(Math.random())],
        block?.distractors[Math.round(Math.random())],
        block?.distractors[Math.round(Math.random())],
      ]),
    [block, trial],
  );

  const aroundDistractorItems = useMemo(
    () => [
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
      block?.distractors[Math.round(Math.random())],
    ],
    [block, trial],
  );

  const showData = useMemo(() => {
    if (practiceData) {
      const result = {correct: 0, incorrect: 0, time: 0};
      practiceData.forEach(a => {
        result.time += a.timeForSeletion;
        a.targetSelected ? result.correct++ : result.incorrect++;
      });
      result.commonTime = (result.time / practiceData.length).toFixed(2);
      return result;
    } else {
      return null;
    }
  }, [practiceData]);

  const snapshots = snapshotCenters.map((s, index) => (
    <Snapshot
      key={'yx' + s.y + s.x}
      index={index}
      y={s.y - snapshotWidth / 2}
      x={s.x - snapshotWidth / 2}
      width={snapshotWidth}
      r={snapshotR}
      itemD={itemD}
      number={block?.distNumber}
      distractor={aroundDistractorItems[index]}
      centerItem={centerItems[index]}
      onPress={() => onSnapshotPress(index)}
    />
  ));

  if (errorMessage) {
    return (
      <View style={styles.mainContainer}>
        <Text style={styles.text}>Wrong answer!</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      {pause ? null : isStarted ? (
        isNewBlock ? (
          <View style={styles.preview}>
            <Preview
              onPress={() => {
                setIsNewBlock(false);
                onSnapshotPress();
              }}
              targets={block.targets}
              blockNumber={blockNumber}
              itemD={itemD}
            />
          </View>
        ) : (
          snapshots
        )
      ) : (
        <View style={styles.buttonBottom}>
          <View style={styles.button}>
            <Button
              title={'Start Practice'}
              color={'white'}
              onPress={() => onStart(true)}
            />
          </View>
          <View style={styles.button}>
            <Button
              title={'Start Experiment'}
              color={'white'}
              onPress={() => onStart(false)}
            />
          </View>
          {/* <View style={styles.button}>
            <Button
              title={'New Participant'}
              color={'white'}
              onPress={onNewParticipant}
            />
          </View> */}
        </View>
      )}
      <Text style={styles.centerCross}>+</Text>

      {!isStarted && showData && (
        <View style={styles.testResult}>
          <Text style={styles.text}>Correct answers: {showData.correct}</Text>
          <Text style={styles.text}>
            Incorrect answers: {showData.incorrect}
          </Text>
          <Text style={styles.text}>
            Time per answer: {showData.commonTime}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonBottom: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
  },
  preview: {position: 'absolute', width: '100%', height: '100%'},
  centerCross: {
    marginLeft: 3,
    marginTop: -3,
    color: 'white',
    fontSize: 30,
  },
  testResult: {position: 'absolute', top: 50, right: 50},
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 20,
  },
});

export default Field;
