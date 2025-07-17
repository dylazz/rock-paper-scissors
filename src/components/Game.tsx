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
                    disabled={gameState.isRoundComplete}
                />
                <ActionButton
                    onPlay={completeBetting}
                    onNewRound={startNewRound}
                    isRoundComplete={gameState.isRoundComplete}
                    canPlay={!gameState.isRoundComplete && gameState.player.currentRound.bets.length > 0}
                />

            </div>
        </div>
    );
};