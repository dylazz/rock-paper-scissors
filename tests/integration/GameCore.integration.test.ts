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

    it('should handle multi-round scenario with varying bet amounts and outcomes', () => {
        // Initial state verification
        expect(gameCore.getState().player.balance).toBe(5000);
        expect(gameCore.getState().player.cumulativeWins).toBe(0);

        // === ROUND 1 - Win Scenario : Player bets 500 on rock + 500 on paper, wins
        mockedGenerateComputerChoice.mockReturnValue('scissors');

        gameCore.placeBet('rock');
        gameCore.placeBet('paper');

        let state = gameCore.getState();
        expect(state.player.balance).toBe(4000); // 5000 - 1000 (two bets)
        expect(state.player.currentRound.bets.length).toBe(2);

        // Complete betting and fast-forward animation
        gameCore.completeBetting();
        vi.advanceTimersByTime(2000);

        state = gameCore.getState();
        expect(state.player.balance).toBe(5500); // 4000 + 1500 (rock wins vs scissors)
        expect(state.player.cumulativeWins).toBe(1500); // Adding 1500 to cumulative wins
        expect(state.isRoundComplete).toBe(true);

        // === ROUND 2: Player bets 1000+500, wins on 500 (Balance remains the same)
        gameCore.startNewRound();
        mockedGenerateComputerChoice.mockReturnValue('rock');

        // Place bets: 1000 on rock (2 bets), 500 on paper (1 bet)
        gameCore.placeBet('rock');
        gameCore.placeBet('rock');
        gameCore.placeBet('paper');

        state = gameCore.getState();
        expect(state.player.balance).toBe(4000);
        expect(state.player.currentRound.bets.length).toBe(3);

        // Complete betting and fast-forward animation
        gameCore.completeBetting();
        vi.advanceTimersByTime(2000);

        state = gameCore.getState();
        expect(state.player.balance).toBe(5500);
        expect(state.player.cumulativeWins).toBe(3000);
        expect(state.isRoundComplete).toBe(true);

        // === ROUND 3: Player bets 500, loses
        gameCore.startNewRound();
        mockedGenerateComputerChoice.mockReturnValue('paper');

        // Place single bet: 500 on rock
        gameCore.placeBet('rock');

        state = gameCore.getState();
        expect(state.player.balance).toBe(5000);
        expect(state.player.currentRound.bets.length).toBe(1);

        // Complete betting and fast-forward animation
        gameCore.completeBetting();
        vi.advanceTimersByTime(2000);

        // Final state verification
        state = gameCore.getState();
        expect(state.player.balance).toBe(5000);
        expect(state.player.cumulativeWins).toBe(3000);
        expect(state.isRoundComplete).toBe(true);
    });
});