/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useAppContext } from './store';
import { LeftPanel } from './components/LeftPanel';
import { RightPanel } from './components/RightPanel';
import { CanvasArea } from './components/CanvasArea';

const ThemeWrapper: React.FC = () => {
  const { theme } = useAppContext();
  
  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <LeftPanel />
      <CanvasArea />
      <RightPanel />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <ThemeWrapper />
    </AppProvider>
  );
}
