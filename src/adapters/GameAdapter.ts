import type {Choice, GameState} from "../types/gameTypes";

/**
 * GameAdapter Interface
 *
 * Defines the contract for framework-specific game adapters, enabling the game core to be framework-agnostic.
 *
 */


export interface GameAdapter {
  getState(): GameState;
  subscribe(listener: (state: GameState) => void): () => void;
  placeBet(position: Choice): void;
  completeBetting(): void;
  startNewRound(): void;
}