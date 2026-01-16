import {Badge} from "./badge";
import {Pokemon} from "./pokemon";

export type Person = {
    firstName: string,
    lastName: string
    wantToBePokemonTrainer: boolean
}

export type PokemonTrainer = Person & {
    wantToBePokemonTrainer: true,
    badges: Badge[]
    currentTeam: Pokemon[]
}

export const isPokemonTrainer = (person: Person): person is PokemonTrainer => person.wantToBePokemonTrainer;