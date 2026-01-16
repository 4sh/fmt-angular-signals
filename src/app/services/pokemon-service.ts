import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DetailedPokemon, detailedPokemons, formatEvolution, pokemonTypes} from "../types/pokemon";
import {map, of, shareReplay} from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    http = inject(HttpClient);
    private allBasePokemons$ = of(detailedPokemons).pipe(
        map(pList => pList
            .map(p => ({
                id: p.id,
                name: p.name.french,
                evolution: formatEvolution(p.evolution),
                types: p.type.map(pt => pokemonTypes.find(t => t.name === pt)!),
                image: p.image.hires || p.image.thumbnail
            })).filter(p => !p.evolution.prev || p.name === "Pikachu")
        ),
        shareReplay(1)
    );

    getBasePokemons(query: string) {
        const normalizedQuery = query.toLowerCase().trim();

        if (!normalizedQuery) return this.allBasePokemons$;

        return this.allBasePokemons$.pipe(
            map(pList => pList.filter(p =>
                p.name.toLowerCase().includes(normalizedQuery)
            ))
        );
    }
}

