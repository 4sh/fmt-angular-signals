import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Badge, badges} from "../../types/badge";
import {EvolutionType, evolutionTypeTranslation} from "../../types/pokemon";

@Component({
    selector: 'my-current-badges',
    imports: [],
    templateUrl: './my-current-badges.html',
    styleUrl: './my-current-badges.scss',
})
export class MyCurrentBadges {
    badges = badges;

    private _myBadges: Badge[] = [];

    get myBadges() {
        return this._myBadges;
    }

    @Input() set myBadges(value: Badge[]) {
        this._myBadges = value;
    }
    maxLevel = 10;
    @Output() fightingArena = new EventEmitter<Badge>();

    fightTheArena = (badgeToUnlock: Badge) => {
        this.fightingArena.emit(badgeToUnlock);
    }

    hasBadge = (badge: Badge) => this.myBadges.map(b => b.id).includes(badge.id);
    evolutionTypes =
        this.myBadges.map(b => b.evolutionTypeToUnlock as EvolutionType)
            .filter(et => !!et)
            .map(et => evolutionTypeTranslation[et])
}
