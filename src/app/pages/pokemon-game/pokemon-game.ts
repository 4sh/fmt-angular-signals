import {Component, inject} from '@angular/core';
import {PokemonTrainer} from "../../types/trainer";
import {GameWon} from "../../components/game-won/game-won";
import {GameStarted} from "../../components/game-started/game-started";
import {FormsModule} from "@angular/forms";
import {GameInit} from "../../components/game-init/game-init";
import {pokemonProgressionStore} from "../../store/pokemon-progression-store";

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
    pokemonProgressionStore = inject(pokemonProgressionStore)

    createTrainer(pokemonTrainer: PokemonTrainer) {
        this.pokemonProgressionStore.createNewPokemonTrainer(pokemonTrainer);
    }

    startGame() {
        this.pokemonProgressionStore.startGame();
    }

    finishGame() {
        this.pokemonProgressionStore.finishGame();
    }

    reloadGame() {
        this.pokemonProgressionStore.reloadGame();
    }
}
