import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PokemonGameProgression} from "../../services/pokemon-progress-service";
import {MyCurrentTeam} from "../my-current-team/my-current-team";
import {Pokemon, searchEvolvePokemon} from "../../types/pokemon";
import {MyCurrentBadges} from "../my-current-badges/my-current-badges";
import {Badge} from "../../types/badge";
import {PokemonTrainer} from "../../types/trainer";
import {PokemonBox} from "../pokemon-box/pokemon-box";

@Component({
    selector: 'game-started',
    imports: [
        MyCurrentTeam,
        MyCurrentBadges,
        PokemonBox
    ],
    templateUrl: './game-started.html',
    styleUrl: './game-started.scss',
})
export class GameStarted {
    currentTrainer!: PokemonTrainer;
    boxVisible = false;

    @Output() gameFinished = new EventEmitter<void>();

    private _gameProgression!: PokemonGameProgression

    get gameProgression() {
        return this._gameProgression;
    }

    @Input() set gameProgression(gameProgression: PokemonGameProgression) {
        this._gameProgression = gameProgression
        this.currentTrainer = gameProgression.pokemonTrainer!
    }

    fightArena = (badge: Badge) => {
        const currentTrainer = this.gameProgression.pokemonTrainer;
        if (!currentTrainer) return;
        const updatedBadges = [...currentTrainer.badges];

        if (this.canUnlockBadge(badge)) {
            updatedBadges.push(badge);
            const newState: PokemonGameProgression = {
                ...this.gameProgression,
                pokemonTrainer: {
                    ...currentTrainer,
                    badges: updatedBadges
                }
            };
            this.gameProgression = newState;
        }
    }

    levelUp = (pokemonToLevelUp: Pokemon) => {
        const currentTrainer = this.gameProgression.pokemonTrainer;
        if (!currentTrainer) return;

        const updatedTeam = currentTrainer.currentTeam.map(p => {
            if (p === pokemonToLevelUp) {
                return {...p, level: p.level + 1};
            }
            return p;
        });

        const newState: PokemonGameProgression = {
            ...this.gameProgression,
            pokemonTrainer: {
                ...currentTrainer,
                currentTeam: updatedTeam
            }
        };

        this.gameProgression = newState;
    }

    levelUpMax = (pokemonToLevelUp: Pokemon) => {
        const currentTrainer = this.gameProgression.pokemonTrainer;
        if (!currentTrainer) return;

        const updatedTeam = currentTrainer.currentTeam.map(p => {
            if (p === pokemonToLevelUp) {
                return {...p, level: currentTrainer.badges.reduce((acc, b) => Math.max(acc, b.levelCapToUnlock), 10)};
            }
            return p;
        });

        const newState: PokemonGameProgression = {
            ...this.gameProgression,
            pokemonTrainer: {
                ...currentTrainer,
                currentTeam: updatedTeam
            }
        };

        this.gameProgression = newState;
    }


    evolve = (pokemonToEvolve: Pokemon) => {
        const currentTrainer = this.gameProgression.pokemonTrainer;
        if (!currentTrainer) return;

        const updatedTeam = currentTrainer.currentTeam.map(p => {
            if (p.id === pokemonToEvolve.id) {
                const evolution = searchEvolvePokemon(p)
                if (evolution) {
                    return {
                        ...evolution,
                        level: p.level
                    }
                }
            }
            return p;
        });

        const newState: PokemonGameProgression = {
            ...this.gameProgression,
            pokemonTrainer: {
                ...currentTrainer,
                currentTeam: updatedTeam
            }
        };

        this.gameProgression = newState;
    }

    displayBox = (isVisible: boolean) => this.boxVisible = isVisible

    private canUnlockBadge = (badge: Badge) => {
        const currentTrainer = this.gameProgression.pokemonTrainer;
        if (!currentTrainer) return;
        return currentTrainer.currentTeam.reduce((acc, p) => acc + p.level, 0) >= badge.requiredTotalLevel
            && !currentTrainer.badges.map(b => b.id).includes(badge.id);
    }

}
