import {
    Component,
    computed,
    inject,
    model,
    output,
} from '@angular/core';
import {MyCurrentTeam} from "../my-current-team/my-current-team";
import {Pokemon, searchEvolvePokemon} from "../../types/pokemon";
import {MyCurrentBadges} from "../my-current-badges/my-current-badges";
import {Badge} from "../../types/badge";
import {PokemonBox} from "../pokemon-box/pokemon-box";
import {PokemonGameProgression, pokemonProgressionStore} from "../../store/pokemon-progression-store";


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
    pokemonProgressionStore = inject(pokemonProgressionStore)
    boxVisible = false;

    gameFinished = output()

    gameProgression = model.required<PokemonGameProgression>()
    currentTrainer = computed(() => this.gameProgression().pokemonTrainer)

    fightArena = (badge: Badge) => {
        this.pokemonProgressionStore.fightArena(badge);
    }

    levelUp = (pokemonToLevelUp: Pokemon) => {
        this.pokemonProgressionStore.levelUp(pokemonToLevelUp);
    }

    levelUpMax = (pokemonToLevelUp: Pokemon) => {
        this.pokemonProgressionStore.levelUpMax(pokemonToLevelUp);
    }


    evolve = (pokemonToEvolve: Pokemon) => {
        this.pokemonProgressionStore.evolve(pokemonToEvolve);
    }

    displayBox = (isVisible: boolean) => this.boxVisible = isVisible

}
