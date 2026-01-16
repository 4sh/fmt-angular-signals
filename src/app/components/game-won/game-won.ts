import {Component, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'game-won',
    imports: [],
    templateUrl: './game-won.html',
    styleUrl: './game-won.scss',
})
export class GameWon {
    @Output() newGame = new EventEmitter();
}
