import {ChangeDetectionStrategy, Component, computed, EventEmitter, Input, Output, signal, Signal} from '@angular/core';
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

    maxLevel = computed(() => this.myBadges().reduce((acc, b) => Math.max(acc,b.levelCapToUnlock), 10))
    teamPower = computed(() => this.myTeam().reduce((acc, p) => acc + p.level, 0));
    unlockedEvolutionTypes = computed(() => this.myBadges()?.map(b => b.evolutionTypeToUnlock as EvolutionType)?.filter(et => !!et) ?? [] )

    myTeam = signal(this.trainer?.currentTeam)
    myBadges = signal(this.trainer?.badges)

    private _trainer!: PokemonTrainer;

    get trainer() {
        return this._trainer;
    }

    @Input() set trainer(value: PokemonTrainer) {
        this._trainer = value;
        this.myTeam.set(value.currentTeam);
        this.myBadges.set(value.badges);
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
                if (!this.unlockedEvolutionTypes().includes(nextEvo.type)) {
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
