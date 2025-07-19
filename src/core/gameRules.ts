import type {Choice} from "../types/gameTypes";
import {gameConfig} from "../config/gameConfig";

// Determines the outcome of a Rock-Paper-Scissors round
export const determineRoundResult = (playerChoice: Choice, computerChoice: Choice) => {
    if (playerChoice === computerChoice) return 'tie';
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }
    return 'lose';
};

// Generates the computer's choice
export const generateComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * gameConfig.choices.length);
    return gameConfig.choices[randomIndex];
};
