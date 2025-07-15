import type {Choice, Bet, GameResult} from '../types/gameTypes.ts';
import { CHOICES, DOUBLE_BET_MULTIPLIER, SINGLE_BET_MULTIPLIER } from '../constants/gameConstants.ts';

export const generateComputerChoice = (): Choice => {
    const randomIndex = Math.floor(Math.random() * CHOICES.length);
    return CHOICES[randomIndex];
};

export const determineWinner = (playerChoice: Choice, computerChoice: Choice): GameResult => {
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

export const calculateWinnings = (bets: Bet[], computerChoice: Choice): number => {
    let winnings = 0;

    // Group bets by position using reduce
    const betsByPosition = bets.reduce((acc, bet) => {
        // If this position dosen't exist in our accumulator yet, create an empty array
        if (!acc[bet.position]) {
            acc[bet.position] = [];
        }
        // Add this bet to the array for the position
        acc[bet.position].push(bet);
        // Return the updated accumulator for the next iteration
        return acc;
    }, {} as Record<Choice, Bet[]>);

    // Get all positions that have bets and convert to Choice array
    const uniquePositions = Object.keys(betsByPosition) as Choice[];

    // If only one position has bets, use single bet multiplier
    if (uniquePositions.length === 1) {
        const position = uniquePositions[0];
        // Get all bets for this position
        const positionBets = betsByPosition[position];
        const result = determineWinner(position, computerChoice);

        if (result === 'tie') {
            // Return total bet amount on tie
            return positionBets.reduce((sum, bet) => sum + bet.amount, 0);
        }
        if (result === 'win') {
            // Return total bet amount * single multiplier
            return positionBets.reduce((sum, bet) => sum + bet.amount, 0) * SINGLE_BET_MULTIPLIER;
        }
    }
    // If two positions have bets, use double bet multiplier
    else if (uniquePositions.length === 2) {
        uniquePositions.forEach(position => {
            // Get all bets for this position
            const positionBets = betsByPosition[position];
            const result = determineWinner(position, computerChoice);

            if (result === 'win') {
                // Add total bet amount for this position * double multiplier
                winnings += positionBets.reduce((sum, bet) => sum + bet.amount, 0) * DOUBLE_BET_MULTIPLIER;
            }
            // In case of two positions, ties are lost as per requirements
        });
    }

    return winnings;
};