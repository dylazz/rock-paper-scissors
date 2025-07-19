interface ActionButtonProps {
  onPlay: () => void;
  onNewRound: () => void;
  isRoundComplete: boolean;
  canPlay: boolean;
}

/**
 * ActionButton Component
 *
 * Renders the main action button that changes based on game state:
 * - "PLAY" button when bets are placed and ready to play
 * - "CLEAR" button when round is complete and ready for new round
 */

 export const ActionButton = ({ onPlay, onNewRound, isRoundComplete, canPlay }: ActionButtonProps) => {
  if (isRoundComplete) {
    return (
        <div className="flex justify-center mb-6">
          <button
              onClick={onNewRound}
              className="px-13 py-5 bg-black text-lg font-semibold rounded-full border-2 game-color-gold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            CLEAR
          </button>
        </div>
    );
  }

  return (
      <div className="flex justify-center mb-6">
        <button
            onClick={onPlay}
            disabled={!canPlay}
            className="px-13 py-5 bg-black text-lg font-semibold rounded-full border-2 game-color-gold hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          PLAY
        </button>
      </div>
  );
};