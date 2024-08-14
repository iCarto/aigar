import {renderHook, act} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {usePaymentData} from "../src/payment/hooks/";
import {InvoicingMonthService} from "monthlyinvoicing/service";
import {MemberService} from "member/service";
import {LoadDataValidatorService} from "validation/service";
import {useFilterMonthlyData} from "monthlyinvoicing/hooks";

vi.mock("monthlyinvoicing/hooks");
vi.mock("monthlyinvoicing/service");
vi.mock("member/service");
vi.mock("validation/service");

describe("usePaymentData", () => {
    const mockProps = {
        invoicingMonthId: "123",
        payments: [],
        onChangePayments: vi.fn(),
        onValidateStep: vi.fn(),
        setFilteredPayments: vi.fn(),
        filter: {textSearch: "", showOnlyErrors: false},
    };

    beforeEach(() => {
        vi.resetAllMocks();
        useFilterMonthlyData.mockReturnValue({
            filterMonthlyData: (items, filter) => items,
        });
    });

    it("initializes with loading state", () => {
        InvoicingMonthService.getInvoicingMonthInvoices.mockResolvedValue([]);
        MemberService.getMember.mockResolvedValue({});
        LoadDataValidatorService.validatePaymentEntry.mockReturnValue([]);
        const {result} = renderHook(() => usePaymentData(mockProps));
        expect(result.current.loading).toBe(true);
    });

    it("fetches invoices and reviews payments", async () => {
        InvoicingMonthService.getInvoicingMonthInvoices.mockResolvedValue([]);
        MemberService.getMember.mockResolvedValue({});
        LoadDataValidatorService.validatePaymentEntry.mockReturnValue([]);

        const {result, waitForNextUpdate} = renderHook(() => usePaymentData(mockProps));

        await waitForNextUpdate();

        expect(result.current.loading).toBe(false);
        expect(InvoicingMonthService.getInvoicingMonthInvoices).toHaveBeenCalledWith(
            "123"
        );
        expect(mockProps.onChangePayments).toHaveBeenCalled();
        expect(mockProps.onValidateStep).toHaveBeenCalled();
        expect(mockProps.setFilteredPayments).toHaveBeenCalled();
    });

    it("handles updatePayment correctly", async () => {
        InvoicingMonthService.getInvoicingMonthInvoices.mockResolvedValue([]);
        MemberService.getMember.mockResolvedValue({});
        LoadDataValidatorService.validatePaymentEntry.mockReturnValue([]);

        const {result, waitForNextUpdate} = renderHook(() =>
            usePaymentData({
                ...mockProps,
                payments: [{id: "1", amount: 100}],
            })
        );

        await waitForNextUpdate();

        act(() => {
            result.current.handleUpdatePayment({original: {id: "1"}}, "amount", 200);
        });

        expect(mockProps.onChangePayments).toHaveBeenCalledWith(
            expect.arrayContaining([expect.objectContaining({id: "1", amount: 200})])
        );
    });
});
