import { Injectable, signal, computed, effect } from '@angular/core';
import {Pokemon, searchEvolvePokemon, SimplePokemon, simplePokemonToPokemon} from "../types/pokemon";
import { PokemonTrainer } from "../types/trainer";
import {Badge} from "../types/badge";

type Progression = 'init' | 'started' | 'won';
export type PokemonGameProgression = {
    progress: Progression
    pokemonTrainer: PokemonTrainer,
    pokemonBox: Pokemon[]
}

const DEFAULT_STATE: PokemonGameProgression = {
    progress: 'init',
    pokemonTrainer: { firstName: '', lastName: '', badges: [], currentTeam: [], wantToBePokemonTrainer: true },
    pokemonBox: []
};

@Injectable({
    providedIn: 'root',
})
export class PokemonProgressService {
    private readonly STORAGE_KEY = 'pokemon-progress';

    private state = signal<PokemonGameProgression>(DEFAULT_STATE);
    public progression = this.state.asReadonly();

    constructor() {
        this.loadProgress();
        effect(() => {
            const currentState = this.state();
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
                progression: currentState
            }));
        });
    }

    createNewPokemonTrainer(pokemonTrainer: PokemonTrainer) {
        this.state.update(current => ({
            ...current,
            pokemonTrainer: { ...pokemonTrainer, currentTeam: [], badges: [] }
        }));
    }

    addOrRemoveFromCurrentTeam(pokemon: SimplePokemon) {
        this.state.update(current => {
            if (!current.pokemonTrainer) return current;

            const newCurrentTeam = [...current.pokemonTrainer.currentTeam];
            const newPokemonBox = [...current.pokemonBox];

            const isInTeam = newCurrentTeam.some(p => p.id === pokemon.id);

            if (isInTeam) {
                const pokemonToRemove = newCurrentTeam.find(p => p.id === pokemon.id);
                if (current.progress === 'started' && pokemonToRemove) {
                    newPokemonBox.push(pokemonToRemove);
                }
                const index = newCurrentTeam.findIndex(p => p.id === pokemon.id);
                if (index > -1) newCurrentTeam.splice(index, 1);
            }
            else if (newCurrentTeam.length < 6) {
                const boxIndex = newPokemonBox.findIndex(p => p.id === pokemon.id);
                if (boxIndex > -1) {
                    newCurrentTeam.push(newPokemonBox[boxIndex]);
                    newPokemonBox.splice(boxIndex, 1);
                } else {
                    newCurrentTeam.push(simplePokemonToPokemon(pokemon));
                }
            }

            return {
                ...current,
                pokemonBox: newPokemonBox,
                pokemonTrainer: {
                    ...current.pokemonTrainer,
                    currentTeam: newCurrentTeam
                }
            };
        });
    }
    fightArena(badge: Badge) {
        const current = this.state();
        const trainer = current.pokemonTrainer;

        if (trainer && this.canUnlockBadge(badge, trainer)) {
            this.state.update(state => ({
                ...state,
                pokemonTrainer: {
                    ...trainer,
                    badges: [...trainer.badges, badge]
                }
            }));
        }
    }

    levelUp(pokemonToLevelUp: Pokemon) {
        this.updateTeamMember(pokemonToLevelUp, (p) => ({ ...p, level: p.level + 1 }));
    }

    levelUpMax(pokemonToLevelUp: Pokemon) {
        const trainer = this.state().pokemonTrainer;
        if (!trainer) return;

        const maxLevel = trainer.badges.reduce((acc, b) => Math.max(acc, b.levelCapToUnlock), 10);

        this.updateTeamMember(pokemonToLevelUp, (p) => ({ ...p, level: maxLevel }));
    }

    evolve(pokemonToEvolve: Pokemon) {
        this.updateTeamMember(pokemonToEvolve, (p) => {
            const evolution = searchEvolvePokemon(p);
            return evolution ? { ...evolution, level: p.level } : p;
        });
    }

    startGame() {
        this.state.update(c => ({ ...c, progress: 'started' }));
    }

    finishGame() {
        this.state.update(c => ({ ...c, progress: 'won' }));
    }

    reloadGame() {
        this.state.set(DEFAULT_STATE);
    }

    private loadProgress() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.progression) {
                    // On met à jour le signal avec la valeur sauvegardée
                    this.state.set(parsed.progression);
                }
            } catch (e) {
                console.error('Erreur lecture save', e);
            }
        }
    }

    private updateTeamMember(targetPokemon: Pokemon, updateFn: (p: Pokemon) => Pokemon) {
        this.state.update(current => {
            if (!current.pokemonTrainer) return current;

            const updatedTeam = current.pokemonTrainer.currentTeam.map(p =>
                p.id === targetPokemon.id ? updateFn(p) : p
            );

            return {
                ...current,
                pokemonTrainer: { ...current.pokemonTrainer, currentTeam: updatedTeam }
            };
        });
    }

    private canUnlockBadge(badge: Badge, trainer: PokemonTrainer): boolean {
        const totalLevel = trainer.currentTeam.reduce((acc, p) => acc + p.level, 0);
        const alreadyHasBadge = trainer.badges.some(b => b.id === badge.id);

        return totalLevel >= badge.requiredTotalLevel && !alreadyHasBadge;
    }
}