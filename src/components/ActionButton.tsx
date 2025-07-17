interface ActionButtonProps {
  onPlay: () => void;
  onNewRound: () => void;
  isRoundComplete: boolean;
  canPlay: boolean;
}

export const ActionButton = ({ onPlay, onNewRound, isRoundComplete, canPlay }: ActionButtonProps) => {
  if (isRoundComplete) {
    return (
        <div className="flex justify-center mb-6">
          <button
              onClick={onNewRound}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
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
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          PLAY
        </button>
      </div>
  );
};