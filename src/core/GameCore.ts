import type {Choice, Bet, GameState} from '../types/gameTypes';
import {gameConfig} from '../config/gameConfig';
import {
    getPlayerBestChoice,
    getRoundWinningChoice,
    calculateWinnings
} from './gameLogic.ts';
import {getTotalBetAmount, getUniqueBetPositions} from "../utils/betUtils.ts";
import {generateComputerChoice} from "./gameRules.ts";

export interface GameCoreInterface {
    getState(): GameState;
    subscribe(listener: (state: GameState) => void): () => void;
    placeBet(position: Choice): void;
    completeBetting(): void;
    startNewRound(): void;
}

/**
 * GameCore - Pure game logic implementation
 *
 * Core responsibilities:
 * - Manages game state immutably
 * - Implements game rules and betting logic
 * - Provides observer pattern for state changes
 * - Handles game flow (betting -> animation -> results -> new round)
 * - Validates all player actions
 *
 * Framework-agnostic design enables use with any UI framework through adapters.
 */
export class GameCore implements GameCoreInterface {
    private state: GameState;
    private listeners: Set<(state: GameState) => void> = new Set(); // Storing all listener callback functions

    constructor() {
        this.state = this.createInitialState();
    }

    // Creates the initial game state when game starts
    private createInitialState(): GameState {
        return {
            player: {
                balance: gameConfig.initialBalance,
                cumulativeWins: 0,
                currentRound: {
                    bets: []
                }
            },
            isShowingAnimation: false,
            isRoundComplete: false
        };
    }

    // Returns a copy of current state
    public getState(): GameState {
        return {...this.state};
    }

    /**
     * Subscribes a listener to game state changes (Observer pattern)
     * @param listener - Callback function invoked when state changes
     * @returns Unsubscribe function to remove the listener
     */
    public subscribe(listener: (state: GameState) => void): () => void {
        this.listeners.add(listener);   // Adds the listener function to the set (subscribe)
        return () => this.listeners.delete(listener);   // Removes the listener function from the set (unsubscribe)
    }

    /**
     * Notifies all subscribers of state changes
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.getState()));
    }

    public placeBet(position: Choice): void {
        // Preventing betting during animation or completed rounds
        if (this.state.isShowingAnimation || this.state.isRoundComplete) {
            return;
        }

        // Checking if player has enough balance
        const betAmount = gameConfig.betAmount;
        if (this.state.player.balance < betAmount) {
            return;
        }

        // Check MAX_POSITIONS constraint
        const currentBets = this.state.player.currentRound.bets;
        const uniquePositions = getUniqueBetPositions(currentBets);

        // If this is a new position and we've already reached the max, don't allow the bet
        if (!uniquePositions.has(position) && uniquePositions.size >= gameConfig.maxPositions) {
            return;
        }

        // Creating the new bet
        const newBet: Bet = {
            position,
            amount: betAmount
        };

        this.state = {
            ...this.state,
            player: {
                ...this.state.player,
                balance: this.state.player.balance - betAmount,
                currentRound: {
                    ...this.state.player.currentRound,
                    bets: [...this.state.player.currentRound.bets, newBet]
                }
            }
        };
        // Notifying subscribers of the state change
        this.notifyListeners();
    }

    // Completes betting phase and initiates the game round
    public completeBetting(): void {
        // Validation
        if (this.state.isShowingAnimation || this.state.isRoundComplete || this.state.player.currentRound.bets.length === 0) {
            return;
        }

        // Generate choices immediately when animation starts
        const computerChoice = generateComputerChoice();
        const playerBestChoice = getPlayerBestChoice(this.state.player.currentRound.bets, computerChoice);
        const winningChoice = getRoundWinningChoice(this.state.player.currentRound.bets, computerChoice);

        // Starting the animation phase with computed choices
        this.state = {
            ...this.state,
            isShowingAnimation: true,
            player: {
                ...this.state.player,
                currentRound: {
                    ...this.state.player.currentRound,
                    computerChoice,
                    playerBestChoice,
                    winningChoice
                }
            }
        };

        this.notifyListeners();

        // Completing round after animation delay
        setTimeout(() => {
            const winnings = calculateWinnings(this.state.player.currentRound.bets, computerChoice);
            const totalBetAmount = getTotalBetAmount(this.state.player.currentRound.bets);

            // Checking if this is an actual win
            const isActualWin = winnings > totalBetAmount;

            this.state = {
                ...this.state,
                player: {
                    ...this.state.player,
                    balance: this.state.player.balance + winnings,
                    // Adding the full winnings amount to cumulative wins only if it's an actual win
                    cumulativeWins: this.state.player.cumulativeWins + (isActualWin ? winnings : 0)
                },
                isShowingAnimation: false,
                isRoundComplete: true
            };

            this.notifyListeners();
        }, gameConfig.animationDuration);
    }

    //Resetting round while keeping balance & cumulative wins
    public startNewRound(): void {
        this.state = {
            ...this.state,
            player: {
                ...this.state.player,
                currentRound: {
                    // Clearing all bets for new round
                    bets: []
                }
            },
            isShowingAnimation: false,
            isRoundComplete: false
        };
        this.notifyListeners();
    }
}