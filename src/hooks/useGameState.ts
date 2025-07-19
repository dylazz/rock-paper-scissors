import { useState, useEffect } from 'react';
import type { GameState, Choice } from '../types/gameTypes';
import { ReactGameAdapter } from '../adapters/ReactGameAdapter';

/**
 * React Hook: useGameState
 *
 * Manages game state synchronization between React components and the GameAdapter.
 * Provides reactive state updates and game action methods through observer pattern.
 *
 * @param gameAdapter - The ReactGameAdapter instance to subscribe to
 * @returns Object containing current game state and action methods
 */

export const useGameState = (gameAdapter: ReactGameAdapter) => {
    // Initializing React state with current game state
    const [gameState, setGameState] = useState<GameState>(gameAdapter.getState());

    useEffect(() => {
        // Subscribing to state changes from the game adapter
        // When the game state changes in the core, this callback updates React state
        const unsubscribe = gameAdapter.subscribe((newState: GameState) => {
            setGameState(newState);
        });
        // Cleanup: Unsubscribe whe component unmounts or adapter changes
        return unsubscribe;
    }, [gameAdapter]);

    return {
        gameState,
        // Exposing game actions as functions that delegate to the adapter
        placeBet: (position: Choice) => gameAdapter.placeBet(position),
        completeBetting: () => gameAdapter.completeBetting(),
        startNewRound: () => gameAdapter.startNewRound()
    };
};