import type { Choice, Bet } from '../types/gameTypes';
import {gameConfig} from "../config/gameConfig";
import {determineRoundResult} from "./gameRules";
import {getTotalBetAmount, groupBetsByPosition} from "../utils/betUtils";

/**
 * Determines the player's best choice based on their bets and the computer's choice
 *
 * Strategy: Prioritize choices in order of preference:
 * 1. Winning choice (if player has one)
 * 2. Tie choice (if player has one)
 * 3. Losing choice (fallback)
 * 4. First available choice (final fallback)
 */
 export const getPlayerBestChoice = (bets: Bet[], computerChoice: Choice): Choice => {
    const { uniquePositions } = groupBetsByPosition(bets);

    let winningChoice: Choice | null = null;
    let tieChoice: Choice | null = null;
    let losingChoice: Choice | null = null;

    // Check each unique position and categorize by result
    uniquePositions.forEach(position => {
        const result = determineRoundResult(position, computerChoice);

        if (result === 'win' && !winningChoice) {
            winningChoice = position;
        } else if (result === 'tie' && !tieChoice) {
            tieChoice = position;
        } else if (result === 'lose' && !losingChoice) {
            losingChoice = position;
        }
    });

    // Return in priority order: Win > Tie > Loss
    return winningChoice || tieChoice || losingChoice || uniquePositions[0];
};

/**
 * Determines which choice wins the overall round
 */
 export const getRoundWinningChoice = (bets: Bet[], computerChoice: Choice): Choice => {
    const playerBestChoice = getPlayerBestChoice(bets, computerChoice);
    const result = determineRoundResult(playerBestChoice, computerChoice);

    if (result === 'win' || result === 'tie') {
        return playerBestChoice;
    }

    // If player's best choice didn't win or tie, computer wins
    return computerChoice;
};

/**
 * Calculates total winnings based on player bets and computer choice
 *
 * Payout rules:
 * - Single position betting: 14x multiplier for wins, full refund for ties
 * - Multiple position betting: 3x multiplier for wins, no ties possible
 * - No payout for losses
 */
 export const calculateWinnings = (bets: Bet[], computerChoice: Choice): number => {
    let winnings = 0;
    const { betsByPosition, uniquePositions } = groupBetsByPosition(bets);

    // If only one position has bets, use single bet multiplier
    if (uniquePositions.length === 1) {
        const position = uniquePositions[0];
        const positionBets = betsByPosition[position];
        const result = determineRoundResult(position, computerChoice);
        const totalBetAmount = getTotalBetAmount(positionBets);

        if (result === 'tie') {
            return totalBetAmount;
        }
        if (result === 'win') {
            return totalBetAmount * gameConfig.singleBetMultiplier;
        }
    }
    // If two positions have bets, use double bet multiplier
    else if (uniquePositions.length === 2) {
        uniquePositions.forEach(position => {
            const positionBets = betsByPosition[position];
            const result = determineRoundResult(position, computerChoice);

            if (result === 'win') {
                const totalBetAmount = getTotalBetAmount(positionBets);
                winnings += totalBetAmount * gameConfig.doubleBetMultiplier;
            }
            // No ties with multiple positions - ties lose
        });
    }
    return winnings;
};