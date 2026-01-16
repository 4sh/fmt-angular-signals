import {EvolutionType} from "./pokemon";

export type Badge = {
    id: number;
    requiredTotalLevel: number;
    levelCapToUnlock: number;
    evolutionTypeToUnlock?: EvolutionType
    image: string;
}

export const badges: Badge[] = [
    {
        id: 1,
        requiredTotalLevel: 30,
        levelCapToUnlock: 20,
        evolutionTypeToUnlock: "level",
        image: "/assets/badge1.png"
    },
    {
        id: 2,
        requiredTotalLevel: 60,
        levelCapToUnlock: 30,
        evolutionTypeToUnlock: "friendship",
        image: "/assets/badge2.png"
    },
    {
        id: 3,
        requiredTotalLevel: 120,
        levelCapToUnlock: 40,
        evolutionTypeToUnlock: "stone",
        image: "/assets/badge3.png"
    },
    {
        id: 4,
        requiredTotalLevel: 200,
        levelCapToUnlock: 50,
        evolutionTypeToUnlock: "trade",
        image: "/assets/badge4.png"
    },
    {
        id: 5,
        requiredTotalLevel: 250,
        levelCapToUnlock: 70,
        image: "/assets/badge5.png"
    },
    {
        id: 6,
        requiredTotalLevel: 350,
        levelCapToUnlock: 99,
        image: "/assets/badge6.png"
    },
]