import { useState, useCallback } from 'react';
import type { GameState, Choice } from '../types/gameTypes.ts';
import { INITIAL_BALANCE, BET_AMOUNT, MAX_POSITIONS } from '../constants/gameConstants.ts';
import { generateComputerChoice, calculateWinnings } from '../utils/gameLogic';

export const useGame = () => {

    //Initialize game state
    const [gameState, setGameState] = useState<GameState>({
        player: {
            balance: INITIAL_BALANCE,
            currentRound: {
                bets: []
            },
            cumulativeWins: 0
        },
        isRoundComplete: false
    });

    //Function to place a bet on a specific position
    const placeBet = useCallback((position: Choice) => {
        setGameState(prev => {
            // Checking if player has enough balance or if the round is already complete
            if (prev.player.balance < BET_AMOUNT || prev.isRoundComplete) {
                return prev;
            }

            // Get unique positions that have bets
            const uniquePositions = new Set(prev.player.currentRound.bets.map(bet => bet.position));

            // Check if we're trying to bet on a new position when we already have MAX_POSITIONS
            if (!uniquePositions.has(position) && uniquePositions.size >= MAX_POSITIONS) {
                return prev; // Can't bet on more than MAX_POSITIONS different positions
            }

            // Bet Accepted: Create new state with bet added
            return {
                ...prev, // Keeping existing state
                player: {
                    ...prev.player, // Keeping existing player data
                    balance: prev.player.balance - BET_AMOUNT, // Deducting bet amount from balance
                    currentRound: {
                        ...prev.player.currentRound, // Keeping existing round data
                        bets: [...prev.player.currentRound.bets, { position, amount: BET_AMOUNT }] // Copying existing bets, adding new bet object
                    }
                }
            };
        });
    }, []);

    // Function to complete betting phase and calculate results
    const completeBetting = useCallback(() => {
        setGameState(prev => {
            if (prev.isRoundComplete || prev.player.currentRound.bets.length === 0) {
                return prev;
            }

            const computerChoice = generateComputerChoice();
            const winnings = calculateWinnings(prev.player.currentRound.bets, computerChoice);

            // Calculate how much was won this round (excluding the original bet amounts)
            const totalBetAmount = prev.player.currentRound.bets.reduce((sum, bet) => sum + bet.amount, 0);
            const netWinnings = Math.max(0, winnings - totalBetAmount);

            // Round Complete: Updating state with results
            return {
                ...prev, // Keeping existing state
                player: {
                    ...prev.player, // Keeping existing player data
                    balance: prev.player.balance + winnings, // Adding winnings to balance
                    cumulativeWins: prev.player.cumulativeWins + netWinnings, // Tracking total winnings
                    currentRound: {
                        ...prev.player.currentRound, // Keeping existing round data
                        computerChoice // Adding computer's choice to round
                    }
                },
                isRoundComplete: true
            };
        });
    }, []);

    // Function to start a new round
    const startNewRound = useCallback(() => {
        setGameState(prev => ({
            ...prev, // Keeping all existing state
            player: {
                ...prev.player, // Keeping existing player data (balance, cumulativeWins)
                currentRound: {
                    bets: [], // Clearing all bets
                    computerChoice: undefined, // Clearing computer choice
                    result: undefined // Clearing result
                }
            },
            isRoundComplete: false
        }));
    }, []);

    return {
        gameState,
        placeBet,
        completeBetting,
        startNewRound
    };
};