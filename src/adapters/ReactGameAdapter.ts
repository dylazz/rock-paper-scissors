// src/adapters/ReactGameAdapter.ts
import { GameCore, type GameCoreInterface } from '../core/GameCore';
import type { GameAdapter } from "./GameAdapter";
import type { GameState, Choice } from '../types/gameTypes';

/**
 * React-specific implementation of the GameAdapter interface
 * Acts as a bridge between the framework-agnostic GameCore and React Components.
 * The current implementation delegates all operations to GameCore, but provides
 * a place to add React-specific optimizations, tools, middleware in the future.
 */

 export class ReactGameAdapter implements GameAdapter {
    private gameCore: GameCoreInterface;

    constructor(gameCore: GameCoreInterface = new GameCore()) {
        this.gameCore = gameCore;
    }

    public getState(): GameState {
        return this.gameCore.getState();
    }

    public subscribe(listener: (state: GameState) => void): () => void {
        return this.gameCore.subscribe(listener);
    }

    public placeBet(position: Choice): void {
        this.gameCore.placeBet(position);
    }

    public completeBetting(): void {
        this.gameCore.completeBetting();
    }

    public startNewRound(): void {
        this.gameCore.startNewRound();
    }
}