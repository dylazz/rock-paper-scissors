import { CHOICES } from '../constants/gameConstants.ts';

export type Choice = typeof CHOICES[number];
export type GameResult = 'win' | 'lose' | 'tie';

export interface Bet {
    position: Choice;
    amount: number;
}

export interface GameRound {
    bets: Bet[];
    computerChoice?: Choice;
    winningChoice?: Choice;
    result?: GameResult;
}

export interface Player {
    balance: number;
    currentRound: GameRound;
    cumulativeWins: number;
}

export interface GameState {
    player: Player;
    isRoundComplete: boolean;
}