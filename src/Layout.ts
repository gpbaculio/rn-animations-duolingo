import Animated from "react-native-reanimated";

export type SharedValues<
  T extends Record<string, string | number | boolean>
> = {
  [K in keyof T]: Animated.SharedValue<T[K]>;
};

export type Offset = SharedValues<{
  order: number;
  width: number;
  height: number;
  x: number;
  y: number;
  originalX: number;
  originalY: number;
}>;

const isNotInWordBank = (offset: Offset) => {
  "worklet";
  return offset.order.value !== -1;
};

const byOrder = (a: Offset, b: Offset) => {
  "worklet";
  return a.order.value > b.order.value ? 1 : -1;
};

export const calculateLayout = (input: Offset[], containerWidth: number) => {
  "worklet";
  const offsets = input.filter(isNotInWordBank).sort(byOrder);
  if (offsets.length === 0) return;
  const height = offsets[0].height.value;
  let lineNumber = 0;
  let lineBreak = 0;
  offsets.forEach((offset, index) => {
    const total = offsets.slice(lineBreak, index).reduce((acc, o) => {
      return acc + o.width.value;
    }, 0);
    if (total + offset.width.value > containerWidth) {
      lineNumber += 1;
      lineBreak = index;
      offset.x.value = 0;
    } else {
      offset.x.value = total;
    }
    offset.y.value = height * lineNumber;
  });
};

export const move = <T>(input: T[], from: number, to: number) => {
  "worklet";
  const offsets = input.slice();
  while (from < 0) {
    from += offsets.length;
  }
  while (to < 0) {
    to += offsets.length;
  }
  if (to >= offsets.length) {
    let k = to - offsets.length;
    while (k-- + 1) {
      offsets.push();
    }
  }
  offsets.splice(to, 0, offsets.splice(from, 1)[0]);
  return offsets;
};

export const reOrder = (input: Offset[], from: number, to: number) => {
  "worklet";
  const offsets = input.filter(isNotInWordBank).sort(byOrder);
  const newOffset = move(offsets, from, to);
  newOffset.map((o, i) => (o.order.value = i));
};

export const lastOrder = (input: Offset[]) => {
  "worklet";
  return input.filter(isNotInWordBank).length;
};

export const remove = (input: Offset[], index: number) => {
  "worklet";
  const offsets = input
    .filter((_, i) => i !== index)
    .filter(isNotInWordBank)
    .sort(byOrder);
  offsets.map((o, i) => (o.order.value = i));
};
