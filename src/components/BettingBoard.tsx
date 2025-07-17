import type {Choice, Bet} from '../types/gameTypes.ts';
import {CHOICES, MAX_POSITIONS} from '../constants/gameConstants.ts';

interface BettingBoardProps {
    bets: Bet[];
    onPlaceBet: (position: Choice) => void;
    disabled: boolean;
}

export const BettingBoard = ({bets, onPlaceBet, disabled}: BettingBoardProps) => {
    // calculate total amount bet on a specific choice
    const getTotalBetAmount = (choice: Choice) =>
        bets.filter(bet => bet.position === choice).reduce((sum, bet) => sum + bet.amount, 0);

    // Get unique positions that have bets
    const uniquePositions = new Set(bets.map(bet => bet.position));

    // Check if a position can be bet on
    const canBetOnPosition = (choice: Choice) => {
        if (disabled) return false;

        // If we already have bets on this position, we can add more
        if (uniquePositions.has(choice)) return true;

        // If we don't have bets on this position, check if we can add a new position
        return uniquePositions.size < MAX_POSITIONS;
    };
    // Check if any betting is possible
    const canPlaceAnyBet = !disabled && CHOICES.some(choice => canBetOnPosition(choice));

    return (
        <div className="flex flex-col items-center mb-16">
            {canPlaceAnyBet && (
                <h3 className="text-lg font-semibold mb-4 text-gray-700 game-color-gold">Pick your positions</h3>
            )}
            <div className="grid grid-cols-3 gap-3">
                {CHOICES.map((choice) => {
                    const totalAmount = getTotalBetAmount(choice);
                    const canBet = canBetOnPosition(choice);

                    return (
                        <button
                            key={choice}
                            onClick={() => onPlaceBet(choice)}
                            disabled={!canBet}
                            className={`
                h-28 w-45 h-32 p-3 rounded-lg border-3 transition-all duration-200 game-choice-${choice}
                flex flex-col relative
                ${!canBet ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {totalAmount > 0 && (
                                <div className={`rounded-full w-14 h-14 border-5 border-blue-700 bg-white flex items-center justify-center shadow-md mx-auto font-bold`}>
                                    <div>{totalAmount}</div>
                                </div>
                            )}
                            <span className={`mt-auto justify-end text-2xl font-bold uppercase game-win-choice-${choice}`}>{choice}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};