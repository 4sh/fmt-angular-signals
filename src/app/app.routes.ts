import {Routes} from '@angular/router';
import {PokemonGame} from "./pages/pokemon-game/pokemon-game";

export const routes: Routes = [
    {path: '', component: PokemonGame},
    {path: 'pokemonGame', component: PokemonGame},
];

export const appRoutes = ['pokemonGame'] as const;

export type AppRoutes = (typeof appRoutes)[number];
