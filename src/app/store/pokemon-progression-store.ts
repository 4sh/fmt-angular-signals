import {PokemonTrainer} from "../types/trainer";
import {Pokemon, searchEvolvePokemon, SimplePokemon, simplePokemonToPokemon} from "../types/pokemon";
import {patchState, signalStore, withComputed, withHooks, withMethods, withState} from "@ngrx/signals";
import {computed, effect} from "@angular/core";
import {Badge} from "../types/badge";

type Progression = 'init' | 'started' | 'won';
export type PokemonGameProgression = {
    progress: Progression
    pokemonTrainer: PokemonTrainer,
    pokemonBox: Pokemon[]
}
const DEFAULT_STATE: PokemonGameProgression = {
    progress: 'init',
    pokemonTrainer: {firstName: '', lastName: '', badges: [], currentTeam: [], wantToBePokemonTrainer: true},
    pokemonBox: []
};
const STORAGE_KEY = 'pokemon-progress';

export const pokemonProgressionStore = signalStore(
    { providedIn: 'root' },
    withState(DEFAULT_STATE),
    withComputed((store) => ({
        gameProgression: computed(() => ({
            progress: store.progress(),
            pokemonTrainer: store.pokemonTrainer(),
            pokemonBox: store.pokemonBox()
        })),
        currentTeam: computed(() => store.pokemonTrainer().currentTeam),
        currentBadges: computed(() => store.pokemonTrainer().badges),
        levelCap: computed(() =>
            store.pokemonTrainer().badges.reduce((acc, b) => Math.max(acc, b.levelCapToUnlock), 10)
        ),
        teamTotalLevel: computed(() =>
            store.pokemonTrainer().currentTeam.reduce((acc, p) => acc + p.level, 0)
        )
    })),
    withMethods((store) => {
        const updateTeamMember = (target: Pokemon, updateFn: (p: Pokemon) => Pokemon) => {
            const trainer = store.pokemonTrainer();
            const updatedTeam = trainer.currentTeam.map(p => p.id === target.id ? updateFn(p) : p);

            patchState(store, {
                pokemonTrainer: { ...trainer, currentTeam: updatedTeam }
            });
        };

        return {
            createNewPokemonTrainer(pokemonTrainer: PokemonTrainer) {
                patchState(store, {
                    pokemonTrainer: { ...pokemonTrainer, currentTeam: [], badges: [] }
                });
            },

            addOrRemoveFromCurrentTeam(pokemon: SimplePokemon) {
                const currentTrainer = store.pokemonTrainer();
                const currentBox = store.pokemonBox();
                const currentProgress = store.progress();

                if (!currentTrainer) return;

                const newCurrentTeam = [...currentTrainer.currentTeam];
                const newPokemonBox = [...currentBox];

                const isInTeam = newCurrentTeam.some(p => p.id === pokemon.id);

                if (isInTeam) {
                    const pokemonToRemove = newCurrentTeam.find(p => p.id === pokemon.id);
                    if (currentProgress === 'started' && pokemonToRemove) {
                        newPokemonBox.push(pokemonToRemove);
                    }
                    const index = newCurrentTeam.findIndex(p => p.id === pokemon.id);
                    if (index > -1) newCurrentTeam.splice(index, 1);
                } else if (newCurrentTeam.length < 6) {
                    const boxIndex = newPokemonBox.findIndex(p => p.id === pokemon.id);
                    if (boxIndex > -1) {
                        newCurrentTeam.push(newPokemonBox[boxIndex]);
                        newPokemonBox.splice(boxIndex, 1);
                    } else {
                        newCurrentTeam.push(simplePokemonToPokemon(pokemon));
                    }
                }

                patchState(store, {
                    pokemonBox: newPokemonBox,
                    pokemonTrainer: { ...currentTrainer, currentTeam: newCurrentTeam }
                });
            },

            fightArena(badge: Badge) {
                const canUnlock = store.teamTotalLevel() >= badge.requiredTotalLevel &&
                    !store.currentBadges().some(b => b.id === badge.id);

                if (canUnlock) {
                    patchState(store, (state) => ({
                        pokemonTrainer: {
                            ...state.pokemonTrainer,
                            badges: [...state.pokemonTrainer.badges, badge]
                        }
                    }));
                }
            },

            levelUp(pokemon: Pokemon) {
                updateTeamMember(pokemon, p => ({ ...p, level: p.level + 1 }));
            },

            levelUpMax(pokemon: Pokemon) {
                updateTeamMember(pokemon, p => ({ ...p, level: store.levelCap() }));
            },

            evolve(pokemon: Pokemon) {
                updateTeamMember(pokemon, p => {
                    const evolution = searchEvolvePokemon(p);
                    return evolution ? { ...evolution, level: p.level } : p;
                });
            },

            startGame: () => patchState(store, { progress: 'started' }),

            reloadGame: () => patchState(store, DEFAULT_STATE),

            finishGame() {
                patchState(store, { progress: 'won' });
            },

            _loadFromStorage() {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    try {
                        const parsed = JSON.parse(saved);
                        patchState(store, parsed.progression);
                    } catch (e) { console.error(e); }
                }
            }
        };
    }),
    withHooks({
        onInit(store) {
            store._loadFromStorage();
            effect(() => {
                const snapshot = {
                    progress: store.progress(),
                    pokemonTrainer: store.pokemonTrainer(),
                    pokemonBox: store.pokemonBox()
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify({ progression: snapshot }));
            });
        }
    })
);