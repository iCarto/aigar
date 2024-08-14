import {describe, expect, it, vi} from "vitest";
import {render, screen} from "@testing-library/react";
import {ErrorSummary} from "../src/payment/presentational/ErrorSummary";

vi.mock("base/error/components", () => ({
    ErrorMessage: ({message}) => <div data-testid="error-message">{message}</div>,
}));

describe("ErrorSummary", () => {
    it("renders nothing when there are no errors", () => {
        const {container} = render(<ErrorSummary totalErrors={0} totalPayments={10} />);
        expect(container).toBeEmptyDOMElement();
    });

    it("renders error message when there are errors", () => {
        render(<ErrorSummary totalErrors={2} totalPayments={10} />);
        const errorMessage = screen.getByTestId("error-message");
        expect(errorMessage).toHaveTextContent(
            "Existen 2 registros con error de un total de 10 registros leídos."
        );
    });
});
