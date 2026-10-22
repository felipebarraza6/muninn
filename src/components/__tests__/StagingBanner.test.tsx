import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StagingBanner } from "../StagingBanner";

describe("StagingBanner", () => {
  it("renders a visible staging indicator when env is staging", () => {
    render(<StagingBanner env="staging" />);
    expect(screen.getByRole("status")).toHaveTextContent(/staging/i);
  });

  it("renders nothing in production", () => {
    const { container } = render(<StagingBanner env="production" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing in development", () => {
    const { container } = render(<StagingBanner env="development" />);
    expect(container).toBeEmptyDOMElement();
  });
});
