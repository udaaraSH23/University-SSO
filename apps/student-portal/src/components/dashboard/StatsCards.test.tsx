import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import StatsCards from "./StatsCards";

// Mock StatsCard to isolate testing
vi.mock("./StatsCard", () => ({
  StatsCard: ({ title, value }: { title: string; value: number }) => (
    <div data-testid="stats-card">
      <span>{title}</span>
      <span>{value}</span>
    </div>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode;
      className?: string;
    }) => <div className={className}>{children}</div>,
  },
}));

describe("StatsCards", () => {
  it("renders all three stats correctly", () => {
    render(<StatsCards gpa={3.5} booksBorrowed={2} creditsEarned={120} />);

    expect(screen.getByText("Current GPA")).toBeInTheDocument();
    expect(screen.getByText("3.5")).toBeInTheDocument();

    expect(screen.getByText("Pending Books")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText("Credits Earned")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("renders zero values correctly", () => {
    render(<StatsCards gpa={0} booksBorrowed={0} creditsEarned={0} />);

    const zeros = screen.getAllByText("0");
    expect(zeros.length).toBeGreaterThanOrEqual(3);
  });
});
