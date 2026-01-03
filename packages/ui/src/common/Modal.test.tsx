import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal Component", () => {
  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText("Test Modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <div>Modal Content</div>
      </Modal>
    );
    // There are two close triggers usually: the X button and the backdrop.
    // The X button is usually identifiable. The backdrop is clicked too.
    // Let's find the X button (it usually has no text, might need aria-label in implementation or finding by icon class if strictly necessary, but button role is easier).
    // In our implementation, the button has the X icon.
    // We can assume it's one of the buttons.
    const buttons = screen.getAllByRole("button");
    // The close button is likely the second one (if there are others) or the one with the X.
    // Based on code: <button onClick={onClose} ...><X .../></button>
    // We can try clicking the backdrop first if distinguishable, or just find the button.
    // Let's add test id or aria-label to component in future, but for now we find by role.

    // Actually, let's just assume it's accessible or we can click the backdrop?
    // The backdrop has onClick={onClose}.
    // We can try to click the backdrop using class selector if needed, or by structure.

    // Better approach: Test Close Button.
    // The close button is inside the header.
    // Let's fire event on the button that contains the X icon (or just the button).
    // Since there are no other buttons in this simple render (no footer), it's the only button.
    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });
});
