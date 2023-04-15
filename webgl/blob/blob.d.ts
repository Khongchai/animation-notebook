// POC API - subject to heavy change.
// Has just 1 beginning shape (oblong, like the ios navbar)
interface CreateBlobsFunction {
  splitConfig: {
    // Determines the amount of elements. Before the split, all elements will be clumped together
    elements: HTMLElement[];
    start: {
      // The position before the split in pixels.
      pos: { x: number; y: number };
    };
    end: {
      // The position of either each blob in pixels or everything altogether.
      // The number of individual position must match the number of provided html elements.
      pos:
        | { all: { x: number; y: number }; gap: number }
        | { x: number; y: number }[];
    };
  };
  animation: {
    // Animation easing types, easeInOut, easeIn, easeOut, spring, etc.
    ease: EaseTypes;
    durationInMilliseconds: number;
  };
  // The callback that when called, will trigger the animation.
  activateSplit: VoidFunction;
  progress: {
    onStart: VoidFunction;
    onEnd: VoidFunction;
    whileAnimating(progress: number): void;
  };
}

// Can just port stuff from Flutter
type EaseTypes =
  | "easeIn"
  | "easeOut"
  | "easeInOut"
  | "spring"
  | "linear"
  // 0 <= time <= 1
  // The output should also be between 0 and 1
  // The default is linear
  | ((time: number) => number);
