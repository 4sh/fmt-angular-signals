import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {isPokemonTrainer, Person, PokemonTrainer} from "../../types/trainer";

@Component({
    selector: 'pokemon-trainer-creation',
    imports: [
        FormsModule
    ],
    templateUrl: './pokemon-trainer-creation.html',
    styleUrl: './pokemon-trainer-creation.scss',
})
export class PokemonTrainerCreation {
    @Output() newPokemonTrainer = new EventEmitter<PokemonTrainer>();

    person: Person = {firstName: '', lastName: '', wantToBePokemonTrainer: false};
    showSurprisedPikachu = false;

    onSubmit = (form: NgForm) => {
        if (form.invalid) return;

        if (isPokemonTrainer(form.value)) {
            this.showSurprisedPikachu = false;
            this.newPokemonTrainer.emit(form.value);
        } else {
            this.showSurprisedPikachu = true;
        }
    }
}
