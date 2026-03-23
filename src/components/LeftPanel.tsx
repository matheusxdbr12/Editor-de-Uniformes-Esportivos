import React from 'react';
import { useAppContext } from '../store';
import { Category, Model, Pattern, MaterialType, Theme } from '../types';
import { Upload, Type, Download, Save, FolderOpen, Moon, Sun } from 'lucide-react';

export const LeftPanel: React.FC = () => {
  const {
    category, setCategory,
    model, setModel,
    mainColor, setMainColor,
    secondaryColor, setSecondaryColor,
    pattern, setPattern,
    material, setMaterial,
    theme, setTheme,
    addLayer, side,
    ...state
  } = useAppContext();

  const handleAddText = () => {
    addLayer({
      name: 'Novo Texto',
      type: 'text',
      content: 'TEXTO',
      x: 100,
      y: 150,
      width: 100,
      height: 30,
      rotation: 0,
      color: '#ffffff',
      font: 'Arial',
      visible: true,
      locked: false,
      blendMode: 'normal',
      side: side,
      opacity: 1,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.height / img.width;
        const width = 80;
        const height = width * ratio;
        
        addLayer({
          name: 'Imagem',
          type: 'image',
          content: event.target?.result as string,
          x: 110,
          y: 150,
          width,
          height,
          rotation: 0,
          color: '#ffffff',
          font: 'Arial',
          visible: true,
          locked: false,
          blendMode: 'normal',
          side: side,
          opacity: 1,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reset
  };

  const exportToPNG = () => {
    if (state.viewMode === '3d' || state.viewMode === 'split') {
      // Export 3D Canvas
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `uniforme-3d-${side}.png`;
        a.click();
      }
    } else {
      // Export 2D SVG
      const svgElement = document.getElementById('shirt-svg');
      if (!svgElement) return;
      
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = 600;
        canvas.height = 800;
        if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const pngUrl = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = pngUrl;
            a.download = `uniforme-2d-${side}.png`;
            a.click();
            URL.revokeObjectURL(url);
        }
      };
      img.src = url;
    }
  };

  const saveProject = () => {
    const data = JSON.stringify({
      category, model, mainColor, secondaryColor, pattern, material, theme, layers: state.layers
    });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projeto-uniforme.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        state.loadState({ ...data, side: 'front', selectedLayerId: null });
      } catch (err) {
        alert('Arquivo de projeto invÃ¡lido');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col h-full overflow-y-auto transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">ConfiguraÃ§Ãµes</h2>
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
      
      <div className="space-y-6 flex-grow">
        {/* Modalidade e Modelo */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Modalidade</label>
          <select 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            <option value="football">Futebol</option>
            <option value="basketball">Basquete</option>
            <option value="vest">Colete</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Modelo</label>
          <select 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={model}
            onChange={(e) => setModel(e.target.value as Model)}
          >
            {category === 'football' && (
              <>
                <option value="round-neck">Gola Redonda</option>
                <option value="v-neck">Gola V</option>
              </>
            )}
            {category === 'basketball' && (
              <option value="tank">Regata</option>
            )}
            {category === 'vest' && (
              <option value="standard">PadrÃ£o</option>
            )}
          </select>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Cores e PadrÃµes */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cores</label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Principal</span>
            <input 
              type="color" 
              value={mainColor} 
              onChange={(e) => setMainColor(e.target.value)}
              className="h-8 w-16 cursor-pointer border-0 p-0"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">Detalhes (Gola)</span>
            <input 
              type="color" 
              value={secondaryColor} 
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="h-8 w-16 cursor-pointer border-0 p-0"
            />
          </div>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">PadrÃ£o</label>
          <select 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={pattern}
            onChange={(e) => setPattern(e.target.value as Pattern)}
          >
            <option value="solid">SÃ³lido</option>
            <option value="stripes">Listras Verticais</option>
            <option value="gradient">Gradiente</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Material (3D)</label>
          <select 
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            value={material}
            onChange={(e) => setMaterial(e.target.value as MaterialType)}
          >
            <option value="matte">Fosco (Matte)</option>
            <option value="satin">Acetinado (Satin)</option>
            <option value="glossy">Brilhante (Glossy)</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-3">Escala da Textura (3D)</label>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={state.textureScale}
              onChange={(e) => state.setTextureScale(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">{state.textureScale}</span>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Adicionar Elementos */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Adicionar Elementos ({side === 'front' ? 'Frente' : 'Costas'})</label>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={handleAddText}
              className="flex flex-col items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
            >
              <Type size={20} className="mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium">Texto</span>
            </button>
            <label className="flex flex-col items-center justify-center p-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer text-gray-900 dark:text-white">
              <Upload size={20} className="mb-1 text-gray-600 dark:text-gray-400" />
              <span className="text-xs font-medium">Imagem</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </div>

      {/* AÃ§Ãµes de Projeto */}
      <div className="mt-6 space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={exportToPNG}
          className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download size={16} className="mr-2" />
          Exportar PNG
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={saveProject}
            className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Save size={16} className="mr-2" />
            Salvar
          </button>
          <label className="flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
            <FolderOpen size={16} className="mr-2" />
            Abrir
            <input type="file" accept=".json" className="hidden" onChange={loadProject} />
          </label>
        </div>
      </div>
    </div>
  );
};
