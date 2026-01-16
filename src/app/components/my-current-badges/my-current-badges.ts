import {Component, computed, effect, EventEmitter, Input, Output, signal} from '@angular/core';
import {Badge, badges} from "../../types/badge";
import {EvolutionType, evolutionTypeTranslation} from "../../types/pokemon";
import {PokemonTrainer} from "../../types/trainer";

@Component({
    selector: 'my-current-badges',
    imports: [],
    templateUrl: './my-current-badges.html',
    styleUrl: './my-current-badges.scss',
})
export class MyCurrentBadges {
    badges = badges;

    maxLevel = computed(() => this.myBadges()?.reduce((acc, b) => Math.max(acc,b.levelCapToUnlock), 10))
    teamPower = computed(() => this.myTeam()?.reduce((acc, p) => acc + p.level, 0));
    unlockedEvolutionTypes = computed(() => this.myBadges()?.map(b => evolutionTypeTranslation[b.evolutionTypeToUnlock as EvolutionType])?.filter(et => !!et) ?? [] )
    minLevelTeamPower = computed(() => {
        const ownedIds = new Set(this.myBadges()?.map(b => b.id));
        const nextArena = this.badges.find(b => !ownedIds.has(b.id));
        return nextArena ? nextArena.requiredTotalLevel : Infinity;
    });
    canFightNextArena = computed(() => this.teamPower() >= this.minLevelTeamPower());

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

    @Output() fightingArena = new EventEmitter<Badge>();

    constructor() {
        effect(() => {
            if (this.canFightNextArena() ) {
                console.log("Vous pouvez combattre l'arène suivante !")
            }
        });
    }

    fightTheArena = (badgeToUnlock: Badge) => {
        this.fightingArena.emit(badgeToUnlock);
    }

    hasBadge = (badge: Badge) => this.myBadges()?.map(b => b.id).includes(badge.id);
}
