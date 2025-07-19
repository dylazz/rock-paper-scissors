import type {Bet, Choice} from "../types/gameTypes";
import {getUniqueBetPositions, groupBetsByPosition} from "./betUtils";
import {determineRoundResult} from "../core/gameRules";
import {gameConfig} from "../config/gameConfig";

// Determines the round result text
export const getRoundResultText = (bets: Bet[], computerChoice: Choice): string => {
    if (bets.length === 0) return '';

    const { uniquePositions } = groupBetsByPosition(bets);
    let hasWin = false;
    let hasTie = false;

    uniquePositions.forEach(position => {
        const result = determineRoundResult(position, computerChoice);
        if (result === 'win') {
            hasWin = true;
        } else if (result === 'tie') {
            hasTie = true;
        }
    });

    if (uniquePositions.length === 1) {
        if (hasWin) return 'YOU WIN';
        if (hasTie) return 'TIE';
        return 'YOU LOSE';
    } else {
        if (hasWin) return 'YOU WIN';
        return 'YOU LOSE';
    }
};

// Determines if a bet can be placed on a specific position
export const canBetOnPosition = (bets: Bet[], choice: Choice, disabled: boolean): boolean => {
    if (disabled) return false;
    const uniquePositions = getUniqueBetPositions(bets);
    if (uniquePositions.has(choice)) return true;
    return uniquePositions.size < gameConfig.maxPositions;
};

// Determines if a bet can currently be placed
export const canPlaceAnyBet = (bets: Bet[], choices: readonly Choice[], disabled: boolean): boolean => {
    return !disabled && choices.some(choice => canBetOnPosition(bets, choice, disabled));
};
