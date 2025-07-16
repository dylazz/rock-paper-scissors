import {useGame} from '../hooks/useGame';
import {GameHeader} from './GameHeader';
import {BettingBoard} from './BettingBoard';

export const Game = () => {
    const {gameState, placeBet} = useGame();

    return (
        <div className="min-h-screen game-background">
            <GameHeader
                balance={gameState.player.balance}
                currentRoundBets={gameState.player.currentRound.bets}
                cumulativeWins={gameState.player.cumulativeWins}
            />

            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-6">

                <BettingBoard
                    bets={gameState.player.currentRound.bets}
                    onPlaceBet={placeBet}
                    disabled={gameState.isRoundComplete}
                />

            </div>
        </div>
    );
};