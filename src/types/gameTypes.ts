import {gameConfig} from "../config/gameConfig";

export type Choice = typeof gameConfig.choices[number];

export interface Bet {
    position: Choice;
    amount: number;
}

export interface GameRound {
    bets: Bet[];
    computerChoice?: Choice;
    playerBestChoice?: Choice;
    winningChoice?: Choice;
}

export interface Player {
    balance: number;
    currentRound: GameRound;
    cumulativeWins: number;
}

export interface GameState {
    player: Player;
    isRoundComplete: boolean;
    isShowingAnimation: boolean;
}