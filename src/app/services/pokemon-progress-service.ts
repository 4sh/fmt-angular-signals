import {Injectable} from '@angular/core';
import {Pokemon, SimplePokemon, simplePokemonToPokemon} from "../types/pokemon";
import {PokemonTrainer} from "../types/trainer";
import {BehaviorSubject, Observable} from "rxjs";

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

@Injectable({
    providedIn: 'root',
})
export class PokemonProgressService {

    private progressionSubject = new BehaviorSubject<PokemonGameProgression>(DEFAULT_STATE);

    public progression$: Observable<PokemonGameProgression> = this.progressionSubject.asObservable();

    private readonly STORAGE_KEY = 'pokemon-progress';

    constructor() {
        this.loadProgress();
    }

    get currentValue(): PokemonGameProgression {
        return this.progressionSubject.value;
    }

    addToBox(pokemon: Pokemon) {
        const newState = {
            ...this.currentValue,
            pokemonBox: [...this.currentValue.pokemonBox, pokemon]
        };
        this.progressionSubject.next(newState);
        this.saveProgress(newState);
    }

    createNewPokemonTrainer(pokemonTrainer: PokemonTrainer) {
        const newState = {...this.currentValue, pokemonTrainer: {...pokemonTrainer, currentTeam: [], badges: []}};
        this.progressionSubject.next(newState);
        this.saveProgress(newState);
    }

    addOrRemoveFromCurrentTeam(pokemon: SimplePokemon) {
        if (!this.currentValue.pokemonTrainer) return;

        const newCurrentTeam = this.currentValue.pokemonTrainer.currentTeam;
        const newPokemonBox = this.currentValue.pokemonBox;
        if (newCurrentTeam.map(p => p.id).includes(pokemon.id)) {
            if (this.currentValue.progress === 'started') {
                newPokemonBox.push(newCurrentTeam.find(p => p.id === pokemon.id)!)
            }
            newCurrentTeam.splice(newCurrentTeam.findIndex(p => p.id === pokemon.id), 1);
        } else if (newCurrentTeam.length < 6) {
            if (newPokemonBox.map(p => p.id).includes(pokemon.id)) {
                const pokemonIndexBox = newPokemonBox.findIndex(p => p.id === pokemon.id)
                newCurrentTeam.push(newPokemonBox[pokemonIndexBox]);
                newPokemonBox.splice(pokemonIndexBox, 1)
            } else {
                newCurrentTeam.push(simplePokemonToPokemon(pokemon));
            }
        }
        const newState = {
            ...this.currentValue,
            pokemonTrainer: {
                ...this.currentValue.pokemonTrainer,
                currentTeam: [...newCurrentTeam]
            }
        };
        this.progressionSubject.next(newState);
        this.saveProgress(newState);
    }

    levelUp(pokemonToLevelUp: Pokemon) {
        const currentTrainer = this.currentValue.pokemonTrainer;
        if (!currentTrainer) return;

        const updatedTeam = currentTrainer.currentTeam.map(p => {
            if (p === pokemonToLevelUp) {
                return {...p, level: p.level + 1};
            }
            return p;
        });

        const newState: PokemonGameProgression = {
            ...this.currentValue,
            pokemonTrainer: {
                ...currentTrainer,
                currentTeam: updatedTeam
            }
        };

        this.progressionSubject.next(newState);
        this.saveProgress(newState);
    }

    startGame() {
        const newState = {
            ...this.currentValue,
            progress: 'started' as Progression
        };
        this.progressionSubject.next(newState);
        this.saveProgress(newState);
    }

    finishGame() {
        const newState = {
            ...this.currentValue,
            progress: 'won' as Progression
        };
        this.progressionSubject.next(newState);
        this.saveProgress(newState);
    }

    reloadGame() {
        this.progressionSubject.next(DEFAULT_STATE);
        this.saveProgress(DEFAULT_STATE);
    }

    private loadProgress() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.progression) {
                    this.progressionSubject.next(parsed.progression);
                }
            } catch (e) {
                console.error('Erreur lecture save', e);
            }
        }
    }

    private saveProgress(state: PokemonGameProgression) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
            progression: state
        }));
    }
}