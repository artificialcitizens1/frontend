import { create } from "zustand";
import { devtools } from 'zustand/middleware';

interface Character {
  characterId: string;
  name: string;
  type: 'citizen' | 'candidate' | 'reporter';
  log: string;
  district: 'home' | 'office' | 'amphitheatre' | 'outside';
}

interface charactersData extends Character {
  initialDistrict: 'home' | 'office' | 'amphitheatre' | 'outside';
  targetDistrict: 'home' | 'office' | 'amphitheatre' | 'outside';
  color: number;
}
  
interface tickData {
  time: string;
  characters: Character[];
}

interface tickState {
  currentTick: number;
  totalTicks: number;
  subTick: 0 | 1 ;
  tickData: tickData[] | null;
  charactersData: Map<string, charactersData> | null;

  // Actions
  setCurrentTick: (tick: number) => void;
  setTotalTicks: (ticks: number) => void;
  setSubTick: (subTick: 0 | 1) => void;
  setTickData: (tickData: tickData) => void;
  setCharactersData: (charactersData: Character[]) => void;
  updateCharactersData: (charactersData: charactersData[]) => void;
  initializeCharacters: (characters: Character[]) => void;
  updateSystemTick: (tickNumber: number, tickData: tickData[]) => void;

  // Reset function
  reset: () => void;

}

export const useTickStore = create<tickState>()(
  devtools(
    (set, get) => ({
      currentTick: 1,
      totalTicks: 1,
      subTick: 0,
      tickData: null,
      charactersData: null,
      setCurrentTick: (tick) => {
        set({ currentTick: tick })
        set({ subTick: 0 })
      },
      setTotalTicks: (ticks) => set({ totalTicks: ticks }),
      setSubTick: (subTick) => set({ subTick: subTick }),
      setTickData: (tickData) => {
        console.log('tickData set : ', tickData);
        set({ tickData: tickData as unknown as tickData[] })
      },
      initializeCharacters: (characters: Character[]) => {
        const enrichedCharacters = characters.map(character => ({
          ...character,
          initialDistrict: character.district,
          targetDistrict: character.district,
          color: Math.random() > 0.4 ? 0x4d82f7 : 0xf7934d,
        }));
        console.log('enrichedCharacters : ', enrichedCharacters);
        set({
          charactersData: new Map(
            enrichedCharacters.map(character => [character.characterId, character])
          )
        });
      },
      setCharactersData: (charactersData) => {
        console.log('charactersData : ', charactersData);
        set(state => ({ 
        charactersData: new Map(charactersData.map(character => [
          character.characterId, {
            ...character, 
            initialDistrict: state.charactersData!.get(character.characterId)!.targetDistrict!, 
            targetDistrict: character.district,
            color: state.charactersData!.get(character.characterId)!.color,
          }
        ])) 
      }))},
      updateCharactersData: (charactersData) => {
        console.log('updateCharactersData : ', charactersData);
        set({ 
          charactersData: new Map(charactersData.map(character => [character.characterId, character])) 
        });
      },
      updateSystemTick: (tickNumber : number, tickData : tickData[]) => {
        set({ currentTick: tickNumber })
        set({ tickData: tickData })
        set({ subTick: 0 })
      },
      reset: () => 
        set({
          currentTick: 1,
          totalTicks: 1,
          subTick: 0,
        }),
    }),
    {
      name: 'TickStore',
    }
  )
);
