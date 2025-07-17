import type {Choice, Bet} from '../types/gameTypes.ts';
import {calculateWinnings, getGameResultText} from '../utils/gameLogic';

interface GameResultProps {
    computerChoice: Choice;
    winningChoice: Choice;
    bets: Bet[];
}

export const GameResult = ({computerChoice, winningChoice, bets}: GameResultProps) => {

    const totalWinnings = calculateWinnings(bets, computerChoice);
    const resultText = getGameResultText(bets, computerChoice);
    const hasWin = resultText === 'YOU WIN';

    return (
        <div className="text-center mb-6">
            <h3 className={`text-4xl font-bold game-win-choice-${winningChoice} mb-2`}>
                {winningChoice.toUpperCase()} WON
            </h3>
            <div className="text-2xl font-bold text-white mb-1">
                {resultText}
            </div>
            {hasWin && (
                <div className="text-xl text-white">
                    ${totalWinnings}
                </div>
            )}
        </div>
    );
};
