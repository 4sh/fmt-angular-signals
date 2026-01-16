import pokedex from '../../assets/pokedex.json';
import types from '../../assets/types.json';

export type Pokemon = {
    id: number;
    name: string;
    level: number;
    evolution: Evolution,
    types: DetailedPokemonType[],
    image: string;
}

export type EvolutionType = 'level' | 'friendship' | 'trade' | 'stone'
export const evolutionTypeTranslation: Record<EvolutionType, string> = {
    friendship: "Amitié", level: "Niveau", stone: "Pierre", trade: "Echange"

}
export type RawEvolution = {
    prev?: string[],
    next?: string[][]
}
const POKEMON_TYPES = [
    'Normal',
    'Fighting',
    'Flying',
    'Poison',
    'Ground',
    'Rock',
    'Bug',
    'Ground',
    'Ghost',
    'Steel',
    'Fire',
    'Water',
    'Grass',
    'Electric',
    'Psychic',
    'Ice',
    'Dragon',
    'Dragon',
    'Dark'
] as const;
export type PokemonEnglishType = typeof POKEMON_TYPES[number];

const POKEMON_TYPES_FR = {
    Bug: "Insecte",
    Dark: "Ténèbres",
    Dragon: "Dragon",
    Electric: "Électrik",
    Fighting: "Combat",
    Fire: "Feu",
    Flying: "Vol",
    Ghost: "Spectre",
    Grass: "Plante",
    Ground: "Sol",
    Ice: "Glace",
    Normal: "Normal",
    Poison: "Poison",
    Psychic: "Psy",
    Rock: "Roche",
    Steel: "Acier",
    Water: "Eau"
} as const satisfies Record<PokemonEnglishType, string>;

export type PokemonType = typeof POKEMON_TYPES_FR[keyof typeof POKEMON_TYPES_FR];

export type DetailedPokemonType = {
    name: PokemonType,
    effective: PokemonType[],
    ineffective: PokemonType[],
    no_effect: PokemonType[]
}
export const pokemonTypes: DetailedPokemonType[] = types.map(t => ({
    name: POKEMON_TYPES_FR[t.english as PokemonEnglishType],
    effective: t.effective.map(e => POKEMON_TYPES_FR[e as PokemonEnglishType]),
    ineffective: t.ineffective.map(i => POKEMON_TYPES_FR[i as PokemonEnglishType]),
    no_effect: t.no_effect.map(n => POKEMON_TYPES_FR[n as PokemonEnglishType])
}));

export type DetailedPokemon = {
    id: number,
    name: {
        english: string,
        french: string
    },
    evolution: RawEvolution,
    type: string[],
    image: {
        sprite: string,
        thumbnail: string,
        hires?: string
    }
}
export const detailedPokemons: DetailedPokemon[] = pokedex;

export type SimplePokemon = {
    id: number,
    name: string,
    evolution: Evolution,
    types: DetailedPokemonType[],
    image: string,
}

export const formatEvolution = (raw: RawEvolution): Evolution => {

    const getEvolutionType = (text: string): EvolutionType => {
        const lowerText = text.toLowerCase();
        if (lowerText.includes('friendship')) {
            return 'friendship';
        }
        if (lowerText.includes('trade')) {
            return 'trade';
        }
        if (lowerText.includes('stone')) {
            return 'stone';
        }
        return 'level';
    }
    const parseLevel = (val: string): number | null => {
        const num = val.replace(/\D/g, '');
        return num ? parseInt(num, 10) : null;
    };

    return {
        prev: raw.prev ? {
            id: parseInt(raw.prev[0], 10),
            type: getEvolutionType(raw.prev[1]),
            level: parseLevel(raw.prev[1])
        } : undefined,

        next: raw.next?.map(evo => ({
            id: parseInt(evo[0], 10),
            type: getEvolutionType(evo[1]),
            level: parseLevel(evo[1])
        }))
    };
}

const simplePokemon: SimplePokemon[] = detailedPokemons.map(p => ({
    id: p.id,
    name: p.name.french,
    evolution: formatEvolution(p.evolution),
    types: p.type.map(pt => pokemonTypes.find(t => t.name === pt)!),
    image: p.image.hires || p.image.thumbnail
}))

export type Evolution = {
    prev?: {
        id: number,
        type: EvolutionType,
        level: number | null
    },
    next?: {
        id: number,
        type: EvolutionType,
        level: number | null
    }[]
}

export const simplePokemonToPokemon = (simplePokemon: SimplePokemon) => ({
    id: simplePokemon.id,
    name: simplePokemon.name,
    level: 1,
    evolution: simplePokemon.evolution,
    types: simplePokemon.types,
    image: simplePokemon.image
})

export const searchEvolvePokemon = (pokemon: Pokemon) =>
    simplePokemon.find(p => p.id === pokemon.evolution.next?.[0].id)

