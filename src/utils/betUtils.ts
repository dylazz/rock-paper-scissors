import type { Choice, Bet } from '../types/gameTypes';

export const getTotalBetAmount = (bets: Bet[]): number => {
    return bets.reduce((sum: number, bet: Bet) => sum + bet.amount, 0);
};

export const getBetAmountForChoice = (bets: Bet[], choice: Choice): number => {
    return bets.filter(bet => bet.position === choice).reduce((sum, bet) => sum + bet.amount, 0);
};

export const getUniqueBetPositions = (bets: Bet[]): Set<Choice> => {
    return new Set(bets.map(bet => bet.position));
};

export const groupBetsByPosition = (bets: Bet[]): {
    betsByPosition: Record<Choice, Bet[]>,
    uniquePositions: Choice[]
} => {
    const betsByPosition = bets.reduce((acc, bet) => {
        if (!acc[bet.position]) {
            acc[bet.position] = [];
        }
        acc[bet.position].push(bet);
        return acc;
    }, {} as Record<Choice, Bet[]>);

    const uniquePositions = Object.keys(betsByPosition) as Choice[];
    return { betsByPosition, uniquePositions };
};
