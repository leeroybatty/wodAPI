import React, { useState, useEffect } from "react";
import SheetBuilder from '../components/SheetBuilder';
import { CharacterProvider } from '../hooks/CharacterContext';
import { GameProvider } from '../hooks/GameContext';


function CharacterGenerator() {

 
  return (
    <GameProvider>
      <CharacterProvider>
        <SheetBuilder />
      </CharacterProvider>
    </GameProvider>
  );
}

export default CharacterGenerator;