import {useGame} from '../hooks/useGame';
import {GameHeader} from './GameHeader';
import {BettingBoard} from './BettingBoard';
import {GameResult} from './GameResult';
import {ActionButton} from "./ActionButton.tsx";

export const Game = () => {
    const {gameState, placeBet, completeBetting, startNewRound} = useGame();

    return (
        <div className="min-h-screen game-background">
            <GameHeader
                balance={gameState.player.balance}
                currentRoundBets={gameState.player.currentRound.bets}
                cumulativeWins={gameState.player.cumulativeWins}
            />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">

                {gameState.isShowingAnimation && gameState.player.currentRound.computerChoice && (
                    <div className="mb-6 text-center">
                        <div className="flex items-center justify-center space-x-8 text-6xl text-white font-bold">
                            <span>{gameState.player.currentRound.computerChoice}</span>
                            <span className="text-4xl game-color-gold font-bold">VS</span>
                            <span>{gameState.player.currentRound.playerBestChoice}</span>
                        </div>
                    </div>
                )}

                {gameState.isRoundComplete && gameState.player.currentRound.computerChoice && gameState.player.currentRound.winningChoice && (
                    <GameResult
                        computerChoice={gameState.player.currentRound.computerChoice}
                        winningChoice={gameState.player.currentRound.winningChoice}
                        bets={gameState.player.currentRound.bets}
                    />
                )}
                <BettingBoard
                    bets={gameState.player.currentRound.bets}
                    onPlaceBet={placeBet}
                    disabled={gameState.isShowingAnimation || gameState.isRoundComplete}
                />
                <ActionButton
                    onPlay={completeBetting}
                    onNewRound={startNewRound}
                    isRoundComplete={gameState.isRoundComplete}
                    canPlay={!gameState.isShowingAnimation && !gameState.isRoundComplete && gameState.player.currentRound.bets.length > 0}
                />

            </div>
        </div>
    );
};