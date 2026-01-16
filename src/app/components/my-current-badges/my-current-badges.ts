import {Component, EventEmitter, Input, Output} from '@angular/core';
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

    // TODO Transformez ces variables en signaux
    myBadges = this.trainer?.badges;
    maxLevel = 10;
    teamPower = 0;
    unlockedEvolutionTypes =
        this.myBadges?.map(b => b.evolutionTypeToUnlock as EvolutionType)
            .filter(et => !!et)
            .map(et => evolutionTypeTranslation[et]);
    get minLevelTeamPower()  {
        const ownedIds = new Set(this.myBadges?.map(b => b.id));
        const nextArena = this.badges.find(b => !ownedIds.has(b.id));
        return nextArena ? nextArena.requiredTotalLevel : Infinity;
    }
    canFightNextArena =  this.teamPower >= this.minLevelTeamPower


    private _trainer!: PokemonTrainer;

    get trainer() {
        return this._trainer;
    }

    @Input() set trainer(value: PokemonTrainer) {
        this._trainer = value;
        this.myBadges = this.trainer.badges;
    }

    @Output() fightingArena = new EventEmitter<Badge>();

    constructor() {
        // TODO ça fonctionne pas ce truc
        if (this.canFightNextArena ) {
            console.log("Vous pouvez combattre l'arène suivante !")
        }
    }

    fightTheArena = (badgeToUnlock: Badge) => {
        this.fightingArena.emit(badgeToUnlock);
    }

    hasBadge = (badge: Badge) => this.myBadges?.map(b => b.id).includes(badge.id);

}
