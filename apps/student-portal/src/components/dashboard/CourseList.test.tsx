import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CourseList from "./CourseList";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
}));

// Mock Pagination component
vi.mock("@repo/ui", () => ({
  Pagination: ({ currentPage, totalPages, onPageChange }: any) => (
    <div data-testid="pagination">
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
}));

describe("CourseList", () => {
  const mockCourses = [
    {
      code: "CS101",
      name: "Intro to CS",
      description: "Basics",
      credits: 3,
      color: "blue",
    },
    {
      code: "CS102",
      name: "Algorithms",
      description: "Adv",
      credits: 4,
      color: "green",
    },
    // Add more to test pagination (limit is 6)
    { code: "CS103", name: "DB", description: "SQL", credits: 3, color: "red" },
    {
      code: "CS104",
      name: "OS",
      description: "Linux",
      credits: 3,
      color: "yellow",
    },
    {
      code: "CS105",
      name: "Networks",
      description: "TCP/IP",
      credits: 3,
      color: "purple",
    },
    { code: "CS106", name: "AI", description: "ML", credits: 3, color: "pink" },
    {
      code: "CS107",
      name: "Security",
      description: "Crypto",
      credits: 3,
      color: "gray",
    },
  ];

  it("renders course list correctly", () => {
    render(<CourseList courses={mockCourses} year="2024" semester={1} />);

    expect(
      screen.getByText("Current Courses (Year 2024 • Semester 1)")
    ).toBeInTheDocument();
    expect(screen.getByText("Intro to CS")).toBeInTheDocument();
    expect(screen.getByText("CS101")).toBeInTheDocument();
  });

  it("handles empty state", () => {
    render(<CourseList courses={[]} year="2024" semester={1} />);

    expect(
      screen.getByText("No courses currently enrolled.")
    ).toBeInTheDocument();
    expect(screen.queryByText("Intro to CS")).not.toBeInTheDocument();
  });

  it("paginates courses correctly", () => {
    render(<CourseList courses={mockCourses} year="2024" semester={1} />);

    // Should show first 6
    expect(screen.getByText("CS101")).toBeInTheDocument();
    expect(screen.getByText("CS106")).toBeInTheDocument();

    // Should not show 7th
    expect(screen.queryByText("CS107")).not.toBeInTheDocument();

    // Check pagination control
    expect(screen.getByTestId("pagination")).toHaveTextContent("Page 1 of 2");
  });
});
