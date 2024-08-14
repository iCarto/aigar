import {vi} from "vitest";

export const useList = vi.fn(() => ({
    filter: {},
    setFilter: vi.fn(),
    // Add any other properties that useList normally returns
}));

export const useFilter = vi.fn(() => ({
    filter: {},
    handleFilterChange: vi.fn(),
    // Add any other properties that useFilter normally returns
}));
