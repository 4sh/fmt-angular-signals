import {Component, inject, Input} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {Pokemon, SimplePokemon} from "../../types/pokemon";
import {PokemonService} from "../../services/pokemon-service";
import {pokemonProgressionStore} from "../../store/pokemon-progression-store";

@Component({
    selector: 'pokemon-selection',
    imports: [
        FormsModule
    ],
    templateUrl: './pokemon-selection.html',
    styleUrl: './pokemon-selection.scss',
})
export class PokemonSelection {
    private pokemonService = inject(PokemonService)
    private pokemonProgressionStore = inject(pokemonProgressionStore)
    @Input() public currentTeam: Pokemon[] = [];
    @Input() public pokemonBox: Pokemon[] = [];
    @Input() public isPokemonBox = false
    public query = '';
    public isLoading = false;
    public pokemonList: SimplePokemon[] = []

    public search = () => {
        if (!!this.query.trim()) {
            this.isLoading = true
            this.pokemonService.getBasePokemons(this.query).subscribe(pList => {
                this.pokemonList = pList;
                this.isLoading = false;
            });
        } else {
            this.pokemonList = []
        }
    }

    public resetSearch = () => {
        this.pokemonList = [];
        this.query = '';
    }

    public addOrRemove = (pokemon: SimplePokemon) => {
        this.pokemonProgressionStore.addOrRemoveFromCurrentTeam(pokemon)
    }

    public hasPokemonInTeam = (pokemon: SimplePokemon) => this.currentTeam.some(p => p.id === pokemon.id)
}
