import {render, screen} from "@testing-library/react";
import {test, expect} from "vitest";
import App from "./App";

test("renders App component", () => {
    render(<App />);

    const aigarRoutesElement = screen.getByRole("application");
    expect(aigarRoutesElement).toBeInTheDocument();
});
