import './index.css';
import SheetBuilder from './components/SheetBuilder';
import { CharacterProvider } from './hooks/CharacterContext';
import { GameProvider } from './hooks/GameContext';

function App() {

  return (
    <div id="app">
      <GameProvider>
        <CharacterProvider>
          <SheetBuilder />
        </CharacterProvider>
      </GameProvider>
    </div>
  );
}

export default App;