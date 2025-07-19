import { useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { ReactGameAdapter } from '../adapters/ReactGameAdapter';
import { GameHeader } from './GameHeader';
import { BettingBoard } from './BettingBoard';
import { GameResult } from './GameResult';
import { ActionButton } from './ActionButton';

interface GameProps {
    gameAdapter?: ReactGameAdapter;
}

/**
 * Main Game Component
 *
 * Main component that builds the entire game UI. Manages:
 * - Game adapter lifecycle and state subscription
 * - Conditional rendering based on game phase (betting, animation, results)
 * - Layout and composition of all sub-components
 */

 export const Game = ({ gameAdapter }: GameProps) => {
    // Memoized adapter creation to prevent unnecessary re-instantiation
    const memoizedAdapter = useMemo(() => gameAdapter || new ReactGameAdapter(), [gameAdapter]);
    // useGameState subscribes to state changes from adapter. Returns current game state and methods for interaction
    const { gameState, placeBet, completeBetting, startNewRound } = useGameState(memoizedAdapter);

    return (
        <div className="min-h-screen game-background">
            {/* Always visible header with player stats */}
            <GameHeader
                balance={gameState.player.balance}
                currentRoundBets={gameState.player.currentRound.bets}
                cumulativeWins={gameState.player.cumulativeWins}
            />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">
                {/* Animation phase: Show computer vs player choices */}
                {gameState.isShowingAnimation && gameState.player.currentRound.computerChoice && (
                    <div className="mb-6 text-center">
                        <div className="flex items-center justify-center space-x-8 text-6xl text-white font-bold">
                            <span>{gameState.player.currentRound.computerChoice}</span>
                            <span className="text-4xl game-color-gold font-bold">VS</span>
                            <span>{gameState.player.currentRound.playerBestChoice}</span>
                        </div>
                    </div>
                )}

                {/* Results phase: Show round outcome */}
                {gameState.isRoundComplete && gameState.player.currentRound.computerChoice && gameState.player.currentRound.winningChoice && (
                    <GameResult
                        computerChoice={gameState.player.currentRound.computerChoice}
                        winningChoice={gameState.player.currentRound.winningChoice}
                        bets={gameState.player.currentRound.bets}
                    />
                )}

                {/* Always visible betting board (disabled during animation/results) */}
                <BettingBoard
                    bets={gameState.player.currentRound.bets}
                    onPlaceBet={placeBet}
                    disabled={gameState.isShowingAnimation || gameState.isRoundComplete}
                />

                {/* Context-sensitive action button (PLAY or CLEAR) */}
                <ActionButton
                    onPlay={completeBetting}
                    onNewRound={startNewRound}
                    isRoundComplete={gameState.isRoundComplete}
                    canPlay={!gameState.isShowingAnimation && !gameState.isRoundComplete && gameState.player.currentRound.bets.length > 0}
                />
            </div>
        </div>
    );
}