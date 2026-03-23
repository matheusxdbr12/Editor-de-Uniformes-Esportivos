export type Category = 'football' | 'basketball' | 'vest';
export type Model = 'round-neck' | 'v-neck' | 'tank' | 'standard';
export type ViewSide = 'front' | 'back';
export type Pattern = 'solid' | 'stripes' | 'gradient';
export type MaterialType = 'matte' | 'glossy' | 'satin';
export type Theme = 'light' | 'dark';
export type ViewMode = '3d' | '2d' | 'split';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export interface Layer {
  id: string;
  name: string;
  type: 'text' | 'image';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  font: string;
  visible: boolean;
  locked: boolean;
  blendMode: BlendMode;
  side: ViewSide;
  zIndex: number;
  opacity: number;
}

export interface AppState {
  category: Category;
  model: Model;
  side: ViewSide;
  mainColor: string;
  secondaryColor: string;
  pattern: Pattern;
  material: MaterialType;
  theme: Theme;
  viewMode: ViewMode;
  textureScale: number;
  layers: Layer[];
  selectedLayerId: string | null;
}
