import {renderHook, act} from "@testing-library/react";
import {usePaymentUI} from "../src/payment/hooks";
import {describe, it, expect} from "vitest";

describe("usePaymentUI", () => {
    it("initializes with default values", () => {
        const {result} = renderHook(() => usePaymentUI());
        expect(result.current.isModalOpen).toBe(false);
        expect(result.current.selectedMemberForModal).toBe(null);
    });

    it("handles view member click correctly", () => {
        const {result} = renderHook(() => usePaymentUI());
        act(() => {
            result.current.handleClickViewMember("123");
        });
        expect(result.current.isModalOpen).toBe(true);
        expect(result.current.selectedMemberForModal).toBe("123");
    });

    it("handles cancel view member click correctly", () => {
        const {result} = renderHook(() => usePaymentUI());
        act(() => {
            result.current.handleClickViewMember("123");
        });
        act(() => {
            result.current.handleClickCancelViewMember();
        });
        expect(result.current.isModalOpen).toBe(false);
        expect(result.current.selectedMemberForModal).toBe(null);
    });
});
