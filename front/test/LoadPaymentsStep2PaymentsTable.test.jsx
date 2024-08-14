import {render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import LoadPaymentsStep2PaymentsTable from "../src/payment/container/LoadPaymentsStep2PaymentsTable";
import * as usePaymentDataHook from "../src/payment/hooks/usePaymentData";
import * as usePaymentUIHook from "../src/payment//hooks/usePaymentUI";

vi.mock("../src/payment/hooks/usePaymentData");
vi.mock("../src/payment//hooks/usePaymentUI");

describe("LoadPaymentsStep2PaymentsTable", () => {
    const mockProps = {
        invoicingMonthId: "123",
        payments: [],
        onChangePayments: vi.fn(),
        onValidateStep: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("renders Spinner when loading", () => {
        vi.spyOn(usePaymentDataHook, "usePaymentData").mockReturnValue({
            loading: true,
            filteredPayments: [],
            handleUpdatePayment: vi.fn(),
            totalRegistersWithErrors: 0,
        });

        render(<LoadPaymentsStep2PaymentsTable {...mockProps} />);
        expect(screen.getByText("Verificando pagos")).toBeInTheDocument();
    });

    it("renders components when not loading", () => {
        vi.spyOn(usePaymentDataHook, "usePaymentData").mockReturnValue({
            loading: false,
            filteredPayments: [],
            handleUpdatePayment: vi.fn(),
            totalRegistersWithErrors: 0,
        });

        vi.spyOn(usePaymentUIHook, "usePaymentUI").mockReturnValue({
            handleFilterChange: vi.fn(),
            isModalOpen: false,
            selectedMemberForModal: null,
            handleClickViewMember: vi.fn(),
            handleClickCancelViewMember: vi.fn(),
        });

        render(<LoadPaymentsStep2PaymentsTable {...mockProps} />);
        expect(screen.getByRole("grid")).toBeInTheDocument();
    });
});
