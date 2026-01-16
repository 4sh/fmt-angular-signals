import {
    ChangeDetectionStrategy,
    Component,
    computed,
    EventEmitter,
    input, output,
    Output,
    signal,
    Signal
} from '@angular/core';
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
    trainer = input.required<PokemonTrainer>();
    leveledUp = output<Pokemon>();
    leveledUpMax= output<Pokemon>();
    evolved = output<Pokemon>();
    teamChanged = output<void>();

    myTeam = computed(() => this.trainer().currentTeam)
    myBadges = computed(() => this.trainer().badges)
    maxLevel = computed(() => this.myBadges().reduce((acc, b) => Math.max(acc,b.levelCapToUnlock), 10))
    teamPower = computed(() => this.myTeam().reduce((acc, p) => acc + p.level, 0));
    unlockedEvolutionTypes = computed(() => this.myBadges()?.map(b => b.evolutionTypeToUnlock as EvolutionType)?.filter(et => !!et) ?? [] )


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
        return this.myTeam().filter(pokemon => {
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
