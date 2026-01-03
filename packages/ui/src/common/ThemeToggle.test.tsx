import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";

// Mock useTheme
const mockSetTheme = vi.fn();
vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: "light",
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggle Component", () => {
  it("renders correctly", () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText("Toggle theme");
    expect(button).toBeInTheDocument();
  });

  it("toggles theme on click", () => {
    render(<ThemeToggle />);
    const button = screen.getByLabelText("Toggle theme");
    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });
});
