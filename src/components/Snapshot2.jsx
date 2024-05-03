import React, {useMemo} from 'react';
import {StyleSheet, View, TouchableWithoutFeedback} from 'react-native';

const degOfIndex = [
  '0deg',
  '45deg',
  '90deg',
  '135deg',
  '180deg',
  '225deg',
  '270deg',
  '315deg',
];

const Snapshot2 = ({
  x,
  y,
  width,
  distractor,
  centerItem,
  index,
  r,
  itemD,
  onPress,
}) => {
  const center = useMemo(() => width / 2, [width]);
  const coords = useMemo(
    () => [
      {x: center + r, y: center},
      {x: center + r / 2, y: center + (r * Math.sqrt(3)) / 2},
      {x: center + r / 2, y: center - (r * Math.sqrt(3)) / 2},
    ],
    [center, r],
  );
  const items = coords.map(c => (
    <View
      key={'xy' + c.y + c.x}
      style={[
        styles.item,
        {
          top: c.y - itemD / 2,
          left: c.x - itemD / 2,
          height: itemD,
          width: itemD,
        },
        {transform: [{rotate: `-${degOfIndex[index]}`}]},
        styles[distractor],
      ]}
    />
  ));
  items.push(
    <View
      key={'xy' + center}
      style={[
        styles.item,
        {
          top: center - itemD / 2,
          left: center - itemD / 2,
          height: itemD,
          width: itemD,
        },
        styles[centerItem],
        {transform: [{rotate: `-${degOfIndex[index]}`}]},
      ]}
    />,
  );
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          styles.mainContainer,
          {
            top: y,
            left: x,
            height: width,
            width,
            transform: [{rotate: degOfIndex[index]}],
          },
        ]}>
        {items}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
  },
  item: {
    position: 'absolute',
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

export default Snapshot2;
