import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {EvolutionType, Pokemon} from "../../types/pokemon";
import {PokemonTrainer} from "../../types/trainer";

@Component({
    selector: 'my-current-team',
    imports: [],
    templateUrl: './my-current-team.html',
    styleUrl: './my-current-team.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyCurrentTeam {

    @Output() leveledUp = new EventEmitter<Pokemon>()
    @Output() leveledUpMax = new EventEmitter<Pokemon>()
    @Output() evolved = new EventEmitter<Pokemon>()
    @Output() teamChanged = new EventEmitter<void>()

    // TODO Transformez ces variables en signaux
    maxLevel = 10;
    teamPower = 0;
    unlockedEvolutionTypes: EvolutionType[] = [];

    private _trainer!: PokemonTrainer;

    get trainer() {
        return this._trainer;
    }

    @Input() set trainer(value: PokemonTrainer) {
        this._trainer = value;
    }

    onLevelUp = (pokemon: Pokemon) => {
        this.leveledUp.emit(pokemon);
    }

    onLevelUpMax = (pokemon: Pokemon) => {
        this.leveledUpMax.emit(pokemon);
    }

    onEvolve = (pokemon: Pokemon) => {
        this.evolved.emit(pokemon);
    }

    canEvolve(pokemon: Pokemon) {
        return this.trainer.currentTeam.filter(pokemon => {
            if (!pokemon.evolution.next || pokemon.evolution.next.length === 0) {
                return false;
            }

            return pokemon.evolution.next.some(nextEvo => {
                if (!this.unlockedEvolutionTypes.includes(nextEvo.type)) {
                    return false;
                }
                if (nextEvo.type === 'level' && nextEvo.level !== null) {
                    return pokemon.level >= nextEvo.level;
                }

                return true;
            });
        }).map(p => p.id).includes(pokemon.id);
    }

}
