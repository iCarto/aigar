import {render} from "@testing-library/react";
import {describe, expect, it, vi} from "vitest";
import {PaymentFilter} from "../src/payment/presentational/PaymentFilter";

vi.mock("loaddata/presentational", () => ({
    LoadDataTableFilter: ({filter, onChange}) => (
        <div data-testid="load-data-table-filter">
            <span>Filter: {JSON.stringify(filter)}</span>
            <button onClick={() => onChange({textSearch: "test"})}>
                Change Filter
            </button>
        </div>
    ),
}));

describe("PaymentFilter", () => {
    const mockProps = {
        filter: {textSearch: "", showOnlyErrors: false},
        onChange: vi.fn(),
    };

    it("renders LoadDataTableFilter with correct props", () => {
        const {getByTestId} = render(<PaymentFilter {...mockProps} />);
        const filterComponent = getByTestId("load-data-table-filter");
        expect(filterComponent).toHaveTextContent(
            'Filter: {"textSearch":"","showOnlyErrors":false}'
        );
    });

    it("calls onChange when filter changes", () => {
        const {getByText} = render(<PaymentFilter {...mockProps} />);
        getByText("Change Filter").click();
        expect(mockProps.onChange).toHaveBeenCalledWith({textSearch: "test"});
    });
});
