import {Component, EventEmitter, Output, signal} from '@angular/core';
import {NgForm} from "@angular/forms";
import {isPokemonTrainer, PokemonTrainer} from "../../types/trainer";
import {apply, Field, form, minLength, required, Schema, schema} from '@angular/forms/signals';


@Component({
    selector: 'pokemon-trainer-creation',
    imports: [Field],
    templateUrl: './pokemon-trainer-creation.html',
    styleUrl: './pokemon-trainer-creation.scss',
})
export class PokemonTrainerCreation {
    @Output() newPokemonTrainer = new EventEmitter<PokemonTrainer>();

    person = signal({firstName: '', lastName: '', wantToBePokemonTrainer: false});
    form = form(this.person, path => {
        const nameSchema: Schema<string> = schema((schemaPath) =>{
            required(schemaPath, {message: 'Le champ est requis'})
            minLength(schemaPath,3, {message: 'Le champ doit faire minimum 3 caractères'})
        })

        apply(path.firstName, nameSchema)
        apply(path.lastName, nameSchema)

        required(path.wantToBePokemonTrainer)
    })

    onSubmit = () => {
        if (this.form().invalid()) return;

        const formValue = this.form().value();
        if (isPokemonTrainer(formValue)) {
            this.newPokemonTrainer.emit(formValue);
        }
    }
}
