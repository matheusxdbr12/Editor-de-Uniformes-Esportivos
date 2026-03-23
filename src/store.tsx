import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, Layer, Category, Model, ViewSide, Pattern, MaterialType, Theme, ViewMode, BlendMode } from './types';

interface AppContextType extends AppState {
  setCategory: (c: Category) => void;
  setModel: (m: Model) => void;
  setSide: (s: ViewSide) => void;
  setMainColor: (c: string) => void;
  setSecondaryColor: (c: string) => void;
  setPattern: (p: Pattern) => void;
  setMaterial: (m: MaterialType) => void;
  setTheme: (t: Theme) => void;
  setViewMode: (v: ViewMode) => void;
  setTextureScale: (s: number) => void;
  addLayer: (layer: Omit<Layer, 'id' | 'zIndex'>) => void;
  updateLayer: (id: string, updates: Partial<Layer>) => void;
  deleteLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  setSelectedLayerId: (id: string | null) => void;
  moveLayerUp: (id: string) => void;
  moveLayerDown: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  updateLayerBlendMode: (id: string, blendMode: BlendMode) => void;
  loadState: (state: AppState) => void;
}

const initialState: AppState = {
  category: 'football',
  model: 'round-neck',
  side: 'front',
  mainColor: '#1e3a8a',
  secondaryColor: '#ffffff',
  pattern: 'solid',
  material: 'matte',
  theme: 'dark',
  viewMode: '3d',
  textureScale: 10,
  layers: [],
  selectedLayerId: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialState);

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const addLayer = (layerData: Omit<Layer, 'id' | 'zIndex'>) => {
    const newLayer: Layer = {
      ...layerData,
      id: Math.random().toString(36).substr(2, 9),
      zIndex: state.layers.length,
      locked: false,
      blendMode: 'normal',
    };
    updateState({ layers: [...state.layers, newLayer], selectedLayerId: newLayer.id });
  };

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    updateState({
      layers: state.layers.map(l => l.id === id ? { ...l, ...updates } : l)
    });
  };

  const deleteLayer = (id: string) => {
    updateState({
      layers: state.layers.filter(l => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId
    });
  };

  const duplicateLayer = (id: string) => {
    const layerToCopy = state.layers.find(l => l.id === id);
    if (!layerToCopy) return;
    const newLayer: Layer = {
      ...layerToCopy,
      id: Math.random().toString(36).substr(2, 9),
      x: layerToCopy.x + 10,
      y: layerToCopy.y + 10,
      zIndex: state.layers.length,
    };
    updateState({ layers: [...state.layers, newLayer], selectedLayerId: newLayer.id });
  };

  const moveLayerUp = (id: string) => {
    const layerIndex = state.layers.findIndex(l => l.id === id);
    if (layerIndex < state.layers.length - 1) {
      const newLayers = [...state.layers];
      const temp = newLayers[layerIndex].zIndex;
      newLayers[layerIndex].zIndex = newLayers[layerIndex + 1].zIndex;
      newLayers[layerIndex + 1].zIndex = temp;
      newLayers.sort((a, b) => a.zIndex - b.zIndex);
      updateState({ layers: newLayers });
    }
  };

  const moveLayerDown = (id: string) => {
    const layerIndex = state.layers.findIndex(l => l.id === id);
    if (layerIndex > 0) {
      const newLayers = [...state.layers];
      const temp = newLayers[layerIndex].zIndex;
      newLayers[layerIndex].zIndex = newLayers[layerIndex - 1].zIndex;
      newLayers[layerIndex - 1].zIndex = temp;
      newLayers.sort((a, b) => a.zIndex - b.zIndex);
      updateState({ layers: newLayers });
    }
  };

  const toggleLayerVisibility = (id: string) => {
    updateState({
      layers: state.layers.map(l => l.id === id ? { ...l, visible: !l.visible } : l)
    });
  };

  const toggleLayerLock = (id: string) => {
    updateState({
      layers: state.layers.map(l => l.id === id ? { ...l, locked: !l.locked } : l)
    });
  };

  const updateLayerBlendMode = (id: string, blendMode: BlendMode) => {
    updateState({
      layers: state.layers.map(l => l.id === id ? { ...l, blendMode } : l)
    });
  };

  const loadState = (newState: AppState) => {
    setState(newState);
  };

  return (
      <AppContext.Provider value={{
      ...state,
      setCategory: (c) => updateState({ category: c, model: c === 'football' ? 'round-neck' : c === 'basketball' ? 'tank' : 'standard' }),
      setModel: (m) => updateState({ model: m }),
      setSide: (s) => updateState({ side: s, selectedLayerId: null }),
      setMainColor: (c) => updateState({ mainColor: c }),
      setSecondaryColor: (c) => updateState({ secondaryColor: c }),
      setPattern: (p) => updateState({ pattern: p }),
      setMaterial: (m) => updateState({ material: m }),
      setTheme: (t) => updateState({ theme: t }),
      setViewMode: (v) => updateState({ viewMode: v }),
      setTextureScale: (s) => updateState({ textureScale: s }),
      addLayer,
      updateLayer,
      deleteLayer,
      duplicateLayer,
      setSelectedLayerId: (id) => updateState({ selectedLayerId: id }),
      moveLayerUp,
      moveLayerDown,
      toggleLayerVisibility,
      toggleLayerLock,
      updateLayerBlendMode,
      loadState
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
