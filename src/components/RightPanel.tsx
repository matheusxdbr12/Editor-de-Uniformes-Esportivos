import React from 'react';
import { useAppContext } from '../store';
import { Eye, EyeOff, Lock, Unlock, Trash2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import { BlendMode } from '../types';

export const RightPanel: React.FC = () => {
  const {
    layers, selectedLayerId, setSelectedLayerId,
    updateLayer, deleteLayer, duplicateLayer,
    moveLayerUp, moveLayerDown, toggleLayerVisibility, toggleLayerLock,
    updateLayerBlendMode, side
  } = useAppContext();

  const currentLayers = layers.filter(l => l.side === side).sort((a, b) => b.zIndex - a.zIndex);
  const selectedLayer = layers.find(l => l.id === selectedLayerId);

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full overflow-y-auto transition-colors">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">Camadas ({side === 'front' ? 'Frente' : 'Costas'})</h2>
      
      {/* Layer List */}
      <div className="flex-1 overflow-y-auto space-y-2 mb-6">
        {currentLayers.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            Nenhuma camada adicionada.
          </div>
        ) : (
          currentLayers.map(layer => (
            <div 
              key={layer.id}
              className={`flex items-center justify-between p-2 rounded-md border ${selectedLayerId === layer.id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'} cursor-pointer transition-colors`}
              onClick={() => setSelectedLayerId(layer.id)}
            >
              <div className="flex items-center space-x-2 overflow-hidden">
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLayerVisibility(layer.id); }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleLayerLock(layer.id); }}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {layer.locked ? <Lock size={16} /> : <Unlock size={16} />}
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate w-24">
                  {layer.name}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <button onClick={(e) => { e.stopPropagation(); moveLayerUp(layer.id); }} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><ChevronUp size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); moveLayerDown(layer.id); }} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"><ChevronDown size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); duplicateLayer(layer.id); }} className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"><Copy size={16} /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteLayer(layer.id); }} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Layer Properties */}
      {selectedLayer && (
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white">Propriedades</h3>
          
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Nome</label>
            <input 
              type="text" 
              value={selectedLayer.name}
              onChange={(e) => updateLayer(selectedLayer.id, { name: e.target.value })}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Posição X</label>
              <input type="number" value={Math.round(selectedLayer.x)} onChange={(e) => updateLayer(selectedLayer.id, { x: Number(e.target.value) })} className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Posição Y</label>
              <input type="number" value={Math.round(selectedLayer.y)} onChange={(e) => updateLayer(selectedLayer.id, { y: Number(e.target.value) })} className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Largura</label>
              <input type="number" value={Math.round(selectedLayer.width)} onChange={(e) => updateLayer(selectedLayer.id, { width: Number(e.target.value) })} className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Altura</label>
              <input type="number" value={Math.round(selectedLayer.height)} onChange={(e) => updateLayer(selectedLayer.id, { height: Number(e.target.value) })} className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Rotação (°)</label>
            <input type="range" min="0" max="360" value={selectedLayer.rotation} onChange={(e) => updateLayer(selectedLayer.id, { rotation: Number(e.target.value) })} className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Opacidade (%)</label>
            <input type="range" min="0" max="1" step="0.05" value={selectedLayer.opacity ?? 1} onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) })} className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Blend Mode</label>
            <select 
              value={selectedLayer.blendMode || 'normal'}
              onChange={(e) => updateLayerBlendMode(selectedLayer.id, e.target.value as BlendMode)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="multiply">Multiplicar</option>
              <option value="screen">Tela (Screen)</option>
              <option value="overlay">Sobrepor (Overlay)</option>
            </select>
          </div>

          {selectedLayer.type === 'text' && (
            <>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">Texto</label>
                <input type="text" value={selectedLayer.content} onChange={(e) => updateLayer(selectedLayer.id, { content: e.target.value })} className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Cor do Texto</span>
                <input type="color" value={selectedLayer.color} onChange={(e) => updateLayer(selectedLayer.id, { color: e.target.value })} className="h-6 w-12 cursor-pointer border-0 p-0" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
