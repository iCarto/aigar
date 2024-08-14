import {render, screen} from "@testing-library/react";
import {beforeEach, describe, expect, it, vi} from "vitest";
import {PaymentTable} from "../src/payment/presentational";
import {useLoadPaymentsTableColumns} from "../src/payment/data/LoadPaymentsTableColumns";

vi.mock("../src/payment/data/LoadPaymentsTableColumns");
vi.mock("loaddata/presentational", () => ({
    LoadDataTable: ({items}) => (
        <div data-testid="load-data-table">{items.length} items</div>
    ),
}));

describe("PaymentTable", () => {
    const mockProps = {
        payments: [{id: "1"}, {id: "2"}],
        onUpdatePayment: vi.fn(),
        onViewMember: vi.fn(),
    };

    beforeEach(() => {
        vi.resetAllMocks();
        useLoadPaymentsTableColumns.mockReturnValue({tableColumns: []});
    });

    it("renders LoadDataTable with correct props", () => {
        render(<PaymentTable {...mockProps} />);
        const loadDataTable = screen.getByTestId("load-data-table");
        expect(loadDataTable).toHaveTextContent("2 items");
    });

    it("passes correct props to useLoadPaymentsTableColumns", () => {
        render(<PaymentTable {...mockProps} />);
        expect(useLoadPaymentsTableColumns).toHaveBeenCalledWith(
            mockProps.onViewMember
        );
    });
});
