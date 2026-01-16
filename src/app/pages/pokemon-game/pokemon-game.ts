import {Component, inject} from '@angular/core';
import {PokemonProgressService} from "../../services/pokemon-progress-service";
import {PokemonTrainer} from "../../types/trainer";
import {pokemonTypes} from "../../types/pokemon";
import {AsyncPipe} from "@angular/common";
import {GameWon} from "../../components/game-won/game-won";
import {GameStarted} from "../../components/game-started/game-started";
import {FormsModule} from "@angular/forms";
import {GameInit} from "../../components/game-init/game-init";

@Component({
    selector: 'pokemon-game',
    imports: [
        GameWon,
        GameStarted,
        FormsModule,
        GameInit
    ],
    templateUrl: './pokemon-game.html',
    styleUrl: './pokemon-game.scss',
})
export class PokemonGame {
    private pokemonProgressService = inject(PokemonProgressService)
    gameProgression = this.pokemonProgressService.progression;

    createTrainer(pokemonTrainer: PokemonTrainer) {
        this.pokemonProgressService.createNewPokemonTrainer(pokemonTrainer);
    }

    startGame() {
        this.pokemonProgressService.startGame();
    }

    finishGame() {
        this.pokemonProgressService.finishGame();
    }

    reloadGame() {
        this.pokemonProgressService.reloadGame();
    }
}
