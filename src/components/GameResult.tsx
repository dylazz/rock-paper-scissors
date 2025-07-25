import type {Choice, Bet} from '../types/gameTypes';
import {calculatePayout} from '../core/gameLogic';
import {getRoundResultText} from "../utils/displayUtils";

interface GameResultProps {
    computerChoice: Choice;
    winningChoice: Choice;
    bets: Bet[];
}

/**
 * GameResult Component
 *
 * Displays the outcome of a completed round
 */

export const GameResult = ({computerChoice, winningChoice, bets}: GameResultProps) => {

    const totalWinnings = calculatePayout(bets, computerChoice);
    const resultText = getRoundResultText(bets, computerChoice);
    const hasWin = resultText === 'YOU WIN';

    return (
        <div className="text-center mb-6">
            {/* Show which choice won the round */}
            <h3 className={`text-5xl font-bold game-win-choice-${winningChoice} mb-2`}>
                {winningChoice.toUpperCase()} WON
            </h3>

            {/* Show player result and winnings */}
            <div className="text-2xl font-bold mb-1">
                <span className="text-white game-color-gold">{resultText}</span>
                {hasWin && (
                    <span className={"text-white"}> {totalWinnings}</span>
                )}
            </div>
        </div>
    );
};
