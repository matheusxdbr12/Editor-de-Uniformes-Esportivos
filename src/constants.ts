export const SHIRT_PATHS: Record<string, Record<string, any>> = {
  football: {
    'round-neck': {
      front: "M 110 20 Q 150 60 190 20 L 270 50 L 270 110 L 230 90 L 230 380 L 70 380 L 70 90 L 30 110 L 30 50 Z",
      back:  "M 110 20 Q 150 30 190 20 L 270 50 L 270 110 L 230 90 L 230 380 L 70 380 L 70 90 L 30 110 L 30 50 Z",
      collarFront: "M 110 20 Q 150 60 190 20 Q 150 75 110 20 Z",
      collarBack: "M 110 20 Q 150 30 190 20 Q 150 45 110 20 Z"
    },
    'v-neck': {
      front: "M 110 20 L 150 80 L 190 20 L 270 50 L 270 110 L 230 90 L 230 380 L 70 380 L 70 90 L 30 110 L 30 50 Z",
      back:  "M 110 20 Q 150 30 190 20 L 270 50 L 270 110 L 230 90 L 230 380 L 70 380 L 70 90 L 30 110 L 30 50 Z",
      collarFront: "M 110 20 L 150 80 L 190 20 L 150 95 Z",
      collarBack: "M 110 20 Q 150 30 190 20 Q 150 45 110 20 Z"
    }
  },
  basketball: {
    'tank': {
      front: "M 90 20 Q 150 60 210 20 L 230 20 Q 230 80 240 120 L 240 380 L 60 380 L 60 120 Q 70 80 70 20 Z",
      back:  "M 90 20 Q 150 30 210 20 L 230 20 Q 230 80 240 120 L 240 380 L 60 380 L 60 120 Q 70 80 70 20 Z",
      collarFront: "M 90 20 Q 150 60 210 20 Q 150 75 90 20 Z",
      collarBack: "M 90 20 Q 150 30 210 20 Q 150 45 90 20 Z"
    }
  },
  vest: {
    'standard': {
      front: "M 100 20 Q 150 80 200 20 L 220 30 Q 230 90 240 140 L 240 380 L 60 380 L 60 140 Q 70 90 80 30 Z",
      back:  "M 100 20 Q 150 40 200 20 L 220 30 Q 230 90 240 140 L 240 380 L 60 380 L 60 140 Q 70 90 80 30 Z",
      collarFront: "M 100 20 Q 150 80 200 20 Q 150 95 100 20 Z",
      collarBack: "M 100 20 Q 150 40 200 20 Q 150 55 100 20 Z"
    }
  }
};

export const FONTS = [
  'Arial',
  'Impact',
  'Courier New',
  'Georgia',
  'Verdana',
  'Trebuchet MS'
];
