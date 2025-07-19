import type {Choice, Bet} from '../types/gameTypes';
import {gameConfig} from '../config/gameConfig';
import {getBetAmountForChoice} from "../utils/betUtils";
import {canBetOnPosition, canPlaceAnyBet} from "../utils/displayUtils";

interface BettingBoardProps {
    bets: Bet[];
    onPlaceBet: (position: Choice) => void;
    disabled: boolean;
}

/**
 * BettingBoard Component
 *
 * Renders the betting interface with buttons for each choice (rock, paper, scissors).
 * Each button shows:
 * - The choice name
 * - Current bet amount
 * - Visual feedback for enabled/disabled states
 */

export const BettingBoard = ({bets, onPlaceBet, disabled}: BettingBoardProps) => {
    const canPlaceBet = canPlaceAnyBet(bets, gameConfig.choices, disabled);

    return (
        <div className="flex flex-col items-center mb-16">
            {canPlaceBet && (
                <h3 className="text-md font-semibold mb-4 text-gray-700 game-color-gold">PICK YOUR POSITIONS</h3>
            )}
            {/* Rendering choice buttons */}
            <div className="grid grid-cols-3 gap-3">
                {gameConfig.choices.map((choice) => {
                    const totalAmount = getBetAmountForChoice(bets, choice);
                    const canBet = canBetOnPosition(bets, choice, disabled);

                    return (
                        <button
                            key={choice}
                            onClick={() => onPlaceBet(choice)}
                            disabled={!canBet}
                            className={`
                                w-42 h-32 p-4 rounded-lg border-3 transition-all duration-200 game-choice-${choice}
                                flex flex-col relative
                                ${!canBet ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            `}
                        >
                            {/* Show bet amount chip if player has bets on this choice */}
                            {totalAmount > 0 && (
                                <div
                                    className="rounded-full w-14 h-14 border-5 border-blue-700 bg-white flex items-center justify-center shadow-md mx-auto font-bold">
                                    <div>{totalAmount}</div>
                                </div>
                            )}

                            {/* Choice label (rock, paper, scissors) */}
                            <span
                                className={`mt-auto justify-end text-2xl font-bold uppercase game-win-choice-${choice}`}>
                                {choice}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}