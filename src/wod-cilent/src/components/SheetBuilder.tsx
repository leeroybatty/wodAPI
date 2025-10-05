import { useCharacterSheet } from '../hooks/CharacterContext';
import { useEffect } from 'react';
import SheetHeader from './SheetHeader';
import SheetAttributes from './SheetAttributes';
import SheetAbilities from './SheetAbilities';
import SheetAdvantages from './SheetAdvantages';
function CharacterSheet() {

  const {updateStat, stageList} = useCharacterSheet();
  
  useEffect(() => {
    const handleStatChange = (e: CustomEvent) => {
      const { name, value, element } = e.detail;
      const category = element.getAttribute('category');
      const subcategory = element.getAttribute('subcategory');
      updateStat(category, subcategory, name, { value });
    };
    document.addEventListener('stat-rating-changed', handleStatChange);
    return () => document.removeEventListener('stat-rating-changed', handleStatChange);
  }, [updateStat]);

  return (
    <form className="sheet">
      <SheetHeader />
      {stageList.template && <SheetAttributes />}
      {stageList.attributes && <SheetAbilities />}
      <SheetAdvantages />
    </form>
  )
}

export default CharacterSheet

