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

const practiceTrialsNumber = 3;
const trialsNumber = 180;

const BLOCKS = [
  {
    condition: 1,
    distNumber: 4,
    targets: ['redCircle', 'greenSquare'],
    distractors: ['greenCircle', 'redSquare'],
  },
  {
    condition: 2,
    distNumber: 4,
    targets: ['greenCircle', 'redSquare'],
    distractors: ['redCircle', 'greenSquare'],
  },
  {
    condition: 3,
    distNumber: 4,
    targets: ['yellowCircle', 'blueCircle'],
    distractors: ['greenCircle', 'redCircle'],
  },
  {
    condition: 4,
    distNumber: 4,
    targets: ['greenCircle', 'redCircle'],
    distractors: ['yellowCircle', 'blueCircle'],
  },
  {
    condition: 5,
    distNumber: 6,
    targets: ['redCircle', 'greenSquare'],
    distractors: ['greenCircle', 'redSquare'],
  },
  {
    condition: 6,
    distNumber: 6,
    targets: ['greenCircle', 'redSquare'],
    distractors: ['redCircle', 'greenSquare'],
  },
  {
    condition: 7,
    distNumber: 6,
    targets: ['yellowCircle', 'blueCircle'],
    distractors: ['greenCircle', 'redCircle'],
  },
  {
    condition: 8,
    distNumber: 6,
    targets: ['greenCircle', 'redCircle'],
    distractors: ['yellowCircle', 'blueCircle'],
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

const trialData = [];
let trialTime = new Date().getTime();

const Field = ({onFinish}) => {
  const [trial, setTrial] = useState(-1);
  const [blocks, setBlocks] = useState(shuffle([...BLOCKS]));
  const [block, setBlock] = useState(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isNewBlock, setIsNewBlock] = useState(false);
  const [blockNumber, setBlockNumber] = useState(0);
  const [pause, setPause] = useState(false);
  const [practiceData, setPracticeData] = useState(null);
  const [practice, setPractice] = useState(false);

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

  const onSnapshotPress = useCallback(
    itemIndex => {
      if (trial >= 0) {
        const data = {
          blockNumber,
          blockType: block.condition,
          trial: trial + 1,
          pressedPosition: itemIndex,
          timeForSeletion: new Date().getTime() - trialTime,
          target1: block.targets[0],
          target2: block.targets[1],
          position1: centerItems[0],
          position2: centerItems[1],
          position3: centerItems[2],
          position4: centerItems[3],
          position5: centerItems[4],
          position6: centerItems[5],
          position7: centerItems[6],
          position8: centerItems[7],
          distractor1: aroundDistractorItems[0],
          distractor2: aroundDistractorItems[1],
          distractor3: aroundDistractorItems[2],
          distractor4: aroundDistractorItems[3],
          distractor5: aroundDistractorItems[4],
          distractor6: aroundDistractorItems[5],
          distractor7: aroundDistractorItems[6],
          distractor8: aroundDistractorItems[7],
          targetSelected: block.targets.includes(centerItems[itemIndex]),
        };
        trialData.push(data);
      }
      const maxTrials = practice ? practiceTrialsNumber : trialsNumber;
      if (trial < maxTrials - 1) {
        onNextStep();
        return;
      }
      if (blocks.length > 0) {
        nextBlock();
        return;
      }
      const totalTime = new Date().getTime() - startTime;
      if (practice) {
        setPracticeData(trialData);
        setBlocks(shuffle([...BLOCKS]));
        setBlock(null);
        setPause(false);
        setIsStarted(false);
        setBlockNumber(1);
        setIsNewBlock(false);
        setPractice(false);
        setTrial(-1);
      } else {
        onFinish({totalTime, trialData});
      }
    },
    [
      onNextStep,
      trial,
      onFinish,
      nextBlock,
      blocks,
      blockNumber,
      centerItems,
      block,
      practice,
      aroundDistractorItems,
    ],
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
      result.commonTime = result.time / practiceData.length;
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
