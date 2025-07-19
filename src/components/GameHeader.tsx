import type { Bet } from '../types/gameTypes';

interface GameHeaderProps {
    balance: number;
    currentRoundBets: Bet[];
    cumulativeWins: number;
}

/**
 * GameHeader Component
 *
 * Displays the player's game statistics in a horizontal header bar:
 * - BALANCE: Current available money for betting
 * - BET: Total amount bet in the current round
 * - WINS: Cumulative winnings across all rounds
 */

export const GameHeader = ({ balance, currentRoundBets, cumulativeWins }: GameHeaderProps) => {
    const currentRoundTotal = currentRoundBets.reduce((sum, bet) => sum + bet.amount, 0);

    return (
        <div className="w-full bg-black text-white flex justify-center items-center space-x-14 game-color-gold p-1">
            {/* Player's current balance */}
            <div className="flex items-center space-x-2 color">
                <span className="text-md font-medium">BALANCE:</span>
                <span className="text-md font-bold text-white">{balance.toLocaleString()}</span>
            </div>

            {/* Current round bet total */}
            <div className="flex items-center space-x-2">
                <span className="text-md font-medium">BET:</span>
                <span className="text-md font-bold text-white">{currentRoundTotal.toLocaleString()}</span>
            </div>

            {/* Cumulative winnings across all rounds */}
            <div className="flex items-center space-x-2">
                <span className="text-md font-medium">WINS:</span>
                <span className="text-md font-bold text-white">{cumulativeWins.toLocaleString()}</span>
            </div>
        </div>
    );
}