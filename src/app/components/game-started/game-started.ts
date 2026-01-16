import {
    Component,
    computed,
    EventEmitter,
    inject,
    input,
    Input,
    linkedSignal,
    model,
    output,
    Output
} from '@angular/core';
import {PokemonGameProgression, PokemonProgressService} from "../../services/pokemon-progress-service";
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
    private pokemonProgressService = inject(PokemonProgressService)

    boxVisible = false;

    gameFinished = output()

    gameProgression = model.required<PokemonGameProgression>()
    currentTrainer = computed(() => this.gameProgression().pokemonTrainer)

    fightArena = (badge: Badge) => {
        this.pokemonProgressService.fightArena(badge);
    }

    levelUp = (pokemonToLevelUp: Pokemon) => {
        this.pokemonProgressService.levelUp(pokemonToLevelUp);
    }

    levelUpMax = (pokemonToLevelUp: Pokemon) => {
        this.pokemonProgressService.levelUpMax(pokemonToLevelUp);
    }


    evolve = (pokemonToEvolve: Pokemon) => {
        this.pokemonProgressService.evolve(pokemonToEvolve);
    }

    displayBox = (isVisible: boolean) => this.boxVisible = isVisible

}
