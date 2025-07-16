import type { Bet } from '../types/gameTypes.ts';

interface GameHeaderProps {
    balance: number;
    currentRoundBets: Bet[];
    cumulativeWins: number;
}

export const GameHeader = ({ balance, currentRoundBets, cumulativeWins }: GameHeaderProps) => {
    const currentRoundTotal = currentRoundBets.reduce((sum, bet) => sum + bet.amount, 0);

    return (
        <div className="w-full bg-black text-white p-4 flex justify-center items-center space-x-8 game-color-gold">
            <div className="flex items-center space-x-2 color">
                <span className="text-sm font-medium">BALANCE:</span>
                <span className="text-lg font-bold">{balance.toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">BET:</span>
                <span className="text-lg font-bold">{currentRoundTotal.toLocaleString()}</span>
            </div>

            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">WINS:</span>
                <span className="text-lg font-bold">{cumulativeWins.toLocaleString()}</span>
            </div>
        </div>
    );
};