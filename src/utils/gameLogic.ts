import type {Choice, Bet, GameResult} from '../types/gameTypes.ts';
import { CHOICES, DOUBLE_BET_MULTIPLIER, SINGLE_BET_MULTIPLIER } from '../constants/gameConstants.ts';

//Helper function - This function takes an array of bets and groups them by position (rock, paper, scissors)
const groupBetsByPosition = (bets: Bet[]) => {
    // Transform the array into an object
    const betsByPosition = bets.reduce((acc, bet) => {
        // If position dosen't exist in the accumulator yet, create an empty array and add it.
        if (!acc[bet.position]) {
            acc[bet.position] = [];
        }
        acc[bet.position].push(bet);
        return acc;
    }, {} as Record<Choice, Bet[]>);

    const uniquePositions = Object.keys(betsByPosition) as Choice[];

    return { betsByPosition, uniquePositions };
};

const getTotalBetAmount = (bets: Bet[]): number => {
    return bets.reduce((sum: number, bet: Bet) => sum + bet.amount, 0);
};

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

// Function to determine the actual winning choice in the round
export const getRoundWinner = (bets: Bet[], computerChoice: Choice): Choice => {
    // Check each bet position to see if any won or tied
    for (const bet of bets) {
        const result = determineWinner(bet.position, computerChoice);
        if (result === 'win' || result === 'tie') {
            return bet.position;
        }
    }
    // If no player choice won or tied, computer wins
    return computerChoice;
};

export const calculateWinnings = (bets: Bet[], computerChoice: Choice): number => {
    let winnings = 0;

    const { betsByPosition, uniquePositions } = groupBetsByPosition(bets);

    // If only one position has bets, use single bet multiplier
    if (uniquePositions.length === 1) {
        const position = uniquePositions[0];
        // Get all bets for this position
        const positionBets = betsByPosition[position];
        const result = determineWinner(position, computerChoice);

        const totalBetAmount = getTotalBetAmount(positionBets);

        if (result === 'tie') {
            return totalBetAmount;
        }
        if (result === 'win') {
            return totalBetAmount * SINGLE_BET_MULTIPLIER;
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
                const totalBetAmount = getTotalBetAmount(positionBets);
                winnings += totalBetAmount * DOUBLE_BET_MULTIPLIER;
            }
            // In case of two positions, ties are lost as per requirements
        });
    }
    return winnings;
};

export const getGameResultText = (bets: Bet[], computerChoice: Choice): string => {
    if (bets.length === 0) return '';

    // Group bets by position to get unique positions
    const { uniquePositions } = groupBetsByPosition(bets);

    let hasWin = false;
    let hasTie = false;

    uniquePositions.forEach(position => {
        const result = determineWinner(position, computerChoice);
        if (result === 'win') {
            hasWin = true;
        } else if (result === 'tie') {
            hasTie = true;
        }
    });

    // Determine result text based on number of positions and outcomes
    if (uniquePositions.length === 1) {
        if (hasWin) return 'YOU WIN';
        if (hasTie) return 'TIE';
        return 'YOU LOSE';
    } else {
        if (hasWin) return 'YOU WIN';
        return 'YOU LOSE';
    }
};