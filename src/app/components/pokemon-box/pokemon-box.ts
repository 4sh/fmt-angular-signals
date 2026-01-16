import {Component, EventEmitter, Input, Output} from '@angular/core';
import {PokemonSelection} from "../pokemon-selection/pokemon-selection";
import {PokemonTrainer} from "../../types/trainer";
import {Pokemon} from "../../types/pokemon";

@Component({
  selector: 'pokemon-box',
    imports: [
        PokemonSelection
    ],
  templateUrl: './pokemon-box.html',
  styleUrl: './pokemon-box.scss',
})
export class PokemonBox {
  @Input() trainer!: PokemonTrainer;
  @Input() pokemonBox!: Pokemon[];
  @Output() closeBox = new EventEmitter<void>();

}
