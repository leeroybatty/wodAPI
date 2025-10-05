import { createContext, useContext, useState, ReactNode } from 'react';

const vampireTheMasquerade20thBooks = [
  'vampire: the masquerade 20th anniversary core',
  'anarchs unbound',
  'lore of the clans',
  'lore of the bloodlines',
  'ghouls and revenants',
  'The Black Hand: A Guide To The Tal\'Mahe\'Ra',
  'Vampire: Dark Ages 20th Anniversary Core'
];

type GameContextType = {
  gameName: string;
  year: number;
  books: string[];
  setGameName: (name: string) => void;
  setYear: (year: number) => void;
  setBooks: (books: string[]) => void;
  houseRules: {
    singleCustomAbility: boolean
  }
};

const defaultHouseRules = {
  singleCustomAbility: true,
  // G&R In The Master's Footsteps - can learn 2 of sire's clan disciplines, not Potence, p 120
  ghoulsAndRevenantsMastersFootsteps: false
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [year, setYear] = useState<number | null>(1100);
  const [books, setBooks] = useState<string[] | null>([vampireTheMasquerade20thBooks]);
  const [gameName, setGameName] = useState<string | null>('Modern Nights');
  const [houseRules, setHouseRules] = useState<Record<string, unknown>>(defaultHouseRules)

  return (
    <GameContext.Provider value={{
      gameName,
      setGameName,
      year,
      setYear,
      books,
      setBooks,
      houseRules,
      setHouseRules
    }}>
      <div className='navbar'>
        {gameName}
      </div>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}