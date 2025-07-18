import {useState, useCallback} from 'react';
import type {GameState, Choice} from '../types/gameTypes.ts';
import {INITIAL_BALANCE, BET_AMOUNT, MAX_POSITIONS} from '../constants/gameConstants.ts';
import {generateComputerChoice, calculateWinnings, getPlayerBestChoice, getRoundWinningChoice} from '../utils/gameLogic';

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
            isRoundComplete: false,
            isShowingAnimation: false
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
                            bets: [...prev.player.currentRound.bets, {position, amount: BET_AMOUNT}] // Copying existing bets, adding new bet object
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
                const playerBestChoice = getPlayerBestChoice(prev.player.currentRound.bets, computerChoice);
                const winningChoice = getRoundWinningChoice(prev.player.currentRound.bets, computerChoice)

                // PHASE 1: Show positions
                return {
                    ...prev,
                    player: {
                        ...prev.player,
                        currentRound: {
                            ...prev.player.currentRound,
                            computerChoice,
                            playerBestChoice,
                            winningChoice
                        }
                    },
                    isShowingAnimation: true
                };
            });
            setTimeout(() => {
                setGameState(prev => {
                    const winnings = calculateWinnings(prev.player.currentRound.bets, prev.player.currentRound.computerChoice!);
                    const totalBetAmount = prev.player.currentRound.bets.reduce((sum, bet) => sum + bet.amount, 0);
                    const actualWinnings = winnings > totalBetAmount ? winnings : 0;
                    // Phase 2: Show
                    return {
                        ...prev, // Keeping existing state
                        player: {
                            ...prev.player, // Keeping existing player datac
                            balance: prev.player.balance + winnings, // Adding winnings to balance
                            cumulativeWins: prev.player.cumulativeWins + actualWinnings,
                            // Ensuring cumulative wins never go below 0
                            currentRound: {
                                ...prev.player.currentRound, // Keeping existing round data
                            }
                        },
                        isRoundComplete: true,
                        isShowingAnimation: false
                    };
                });
            }, 2000);
        }, []);


        // Function to start a new round
        const startNewRound = useCallback(() => {
            setGameState(prev => ({
                ...prev, // Keeping all existing state
                player: {
                    ...prev.player, // Keeping existing player data (balance, cumulativeWins)
                    // Clearing round data
                    currentRound: {
                        bets: [],
                        computerChoice: undefined,
                        result: undefined,
                        playerBestChoice: undefined
                    }
                },
                isRoundComplete: false,
                isShowingAnimation: false
            }));
        }, []);

        return {
            gameState,
            placeBet,
            completeBetting,
            startNewRound
        };
    }
;