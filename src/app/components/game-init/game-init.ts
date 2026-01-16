import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PokemonTrainerCreation} from "../pokemon-trainer-creation/pokemon-trainer-creation";
import {PokemonSelection} from "../pokemon-selection/pokemon-selection";
import {PokemonTrainer} from "../../types/trainer";
import {PokemonGameProgression} from "../../store/pokemon-progression-store";

@Component({
  selector: 'game-init',
  imports: [
    PokemonTrainerCreation,
    PokemonSelection
  ],
  templateUrl: './game-init.html',
  styleUrl: './game-init.scss',
})
export class GameInit {
  @Input() gameProgression!: PokemonGameProgression
  @Output() gameStarted = new EventEmitter<void>();
  @Output() trainerCreated = new EventEmitter<PokemonTrainer>();
}
