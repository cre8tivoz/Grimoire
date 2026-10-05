import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolAccordion } from "../components/ToolAccordion";

describe("ToolAccordion", () => {
  it("renders with context-aware aria-label and title when collapsed", async () => {
    const handleToggle = vi.fn();
    render(
      <ToolAccordion
        id="engine"
        icon={<span data-testid="icon" />}
        open={false}
        title="Engine"
        onToggle={handleToggle}
      >
        <div>Accordion Content</div>
      </ToolAccordion>
    );

    const button = screen.getByRole("button", { name: "Expand Engine section" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Expand Engine section");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "engine-body");
    expect(screen.queryByText("Accordion Content")).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(button);
    expect(handleToggle).toHaveBeenCalledWith("engine");
  });

  it("renders with context-aware aria-label and title when expanded", () => {
    const handleToggle = vi.fn();
    render(
      <ToolAccordion
        id="engine"
        icon={<span data-testid="icon" />}
        open={true}
        title="Engine"
        onToggle={handleToggle}
      >
        <div>Accordion Content</div>
      </ToolAccordion>
    );

    const button = screen.getByRole("button", { name: "Collapse Engine section" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("title", "Collapse Engine section");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-controls", "engine-body");
    expect(screen.getByText("Accordion Content")).toBeInTheDocument();
  });
});
