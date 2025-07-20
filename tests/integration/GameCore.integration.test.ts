import {GameCore} from "../../src/core/GameCore";
import {generateComputerChoice} from "../../src/core/gameRules";
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the computer choice generation
vi.mock('../../src/core/gameRules', async () => {
    const actual = await vi.importActual('../../src/core/gameRules');
    return {
        ...actual, // Keeping all original exports
        generateComputerChoice: vi.fn() // Only mocking the function we need to control
    };
});

describe('GameCore Multi-Round Integration Test', () => {
    let gameCore: GameCore;
    const mockedGenerateComputerChoice = vi.mocked(generateComputerChoice);

    beforeEach(() => {
        gameCore = new GameCore();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    // Helper function to complete a round
    const completeRound = () => {
        gameCore.completeBetting();
        vi.advanceTimersByTime(2000);
    };

    it('should maintain state correctly across multiple rounds with different outcomes', () => {
        // Initial state verification
        let state = gameCore.getState();
        expect(state.player.balance).toBe(5000);
        expect(state.player.cumulativeWins).toBe(0);
        expect(state.isRoundComplete).toBe(false);

        // === ROUND 1 - Double Bet Win Scenario (rock beats scissors)
        mockedGenerateComputerChoice.mockReturnValue('scissors');

        gameCore.placeBet('rock'); // 500
        gameCore.placeBet('paper'); // 500

        state = gameCore.getState();
        expect(state.player.balance).toBe(4000); // 5000 - 1000 (two bets)
        expect(state.player.currentRound.bets.length).toBe(2);

        completeRound();

        state = gameCore.getState();
        // Double bet: rock wins (500 * 3), paper loses (0) = 1500 payout
        expect(state.player.balance).toBe(5500); // 4000 + 1500
        expect(state.player.cumulativeWins).toBe(1500); // Adding 1500 to cumulative wins
        expect(state.isRoundComplete).toBe(true);

        // === ROUND 2 - Double Bet Win Scenario
        gameCore.startNewRound();

        // Verify clean slate after new round
        state = gameCore.getState();
        expect(state.isRoundComplete).toBe(false);
        expect(state.player.currentRound.bets.length).toBe(0);

        mockedGenerateComputerChoice.mockReturnValue('rock');

        // Place bets: 1000 on rock (2 bets), 500 on paper (1 bet)
        gameCore.placeBet('rock'); // 500
        gameCore.placeBet('rock'); // 500
        gameCore.placeBet('paper'); // 500

        state = gameCore.getState();
        expect(state.player.balance).toBe(4000); // 5500 - 1500
        expect(state.player.currentRound.bets.length).toBe(3);

        completeRound();

        state = gameCore.getState();
        // Double bet: rock loses (-1000), paper wins (500 * 3) = 1500 payout
        expect(state.player.balance).toBe(5500); // 4000 + 1500
        expect(state.player.cumulativeWins).toBe(3000); // 1500 + 1500
        expect(state.isRoundComplete).toBe(true);

        // === ROUND 3: Single bet loss
        gameCore.startNewRound();
        mockedGenerateComputerChoice.mockReturnValue('paper');

        gameCore.placeBet('rock'); // 500

        state = gameCore.getState();
        expect(state.player.balance).toBe(5000); // 5500 - 500
        expect(state.player.currentRound.bets.length).toBe(1);

        completeRound();

        state = gameCore.getState();
        expect(state.player.balance).toBe(5000); // No winnings added (Lost 500)
        expect(state.player.cumulativeWins).toBe(3000); // Unchanged
        expect(state.isRoundComplete).toBe(true);
    });

    it('should handle tie scenario in multi-round context', () => {
        // First round: win to build up cumulative wins
        mockedGenerateComputerChoice.mockReturnValue('scissors');
        gameCore.placeBet('rock');
        completeRound();

        let state = gameCore.getState();
        // Single bet win: 500 * 14 = 7000 payout
        expect(state.player.balance).toBe(11500); // 5000 - 500 + 7000
        expect(state.player.cumulativeWins).toBe(7000);

        // Second round: tie scenario
        gameCore.startNewRound();
        mockedGenerateComputerChoice.mockReturnValue('rock');
        gameCore.placeBet('rock');
        completeRound();

        state = gameCore.getState();
        // Single bet tie: returns bet amount (500)
        expect(state.player.balance).toBe(11500); // Should remain Unchanged
        expect(state.player.cumulativeWins).toBe(7000); // Should remain unchanged
    });
});
