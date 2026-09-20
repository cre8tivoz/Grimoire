import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CandidateReview } from "../features/storyplan/CandidateReview";
import * as storyplanApp from "../app/storyplan";

vi.mock("../app/storyplan", () => ({
  listStoryCandidates: vi.fn(),
  resolveStoryCandidate: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  Check: (props: any) => <span data-testid="check-icon" {...props} />,
  Copy: (props: any) => <span data-testid="copy-icon" {...props} />,
  History: (props: any) => <span {...props} />,
  ShieldAlert: (props: any) => <span {...props} />,
  ShieldCheck: (props: any) => <span {...props} />,
  ShieldOff: (props: any) => <span {...props} />,
  X: (props: any) => <span {...props} />,
}));

const mockCandidates = [
  {
    id: "cand-1",
    targetKind: "scene" as const,
    targetId: "sc-1",
    candidateIndex: 0,
    content: "Sample candidate text",
    provider: "ollama",
    model: "llama3",
    instruction: "More action",
    promptSummary: "Summary",
    status: "pending" as const,
    wardScanned: true,
    wardScan: [],
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
];

describe("CandidateReview", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(storyplanApp.listStoryCandidates).mockResolvedValue(mockCandidates);
  });

  it("renders review toggle button", () => {
    render(
      <CandidateReview
        projectPath="/test"
        targetKind="scene"
        targetId="sc-1"
        showToast={vi.fn()}
        onSelectItem={vi.fn()}
        refreshKey={0}
      />,
    );
    expect(screen.getByText("Review Candidates")).toBeInTheDocument();
  });

  it("shows candidate list when opened", async () => {
    const user = userEvent.setup();
    render(
      <CandidateReview
        projectPath="/test"
        targetKind="scene"
        targetId="sc-1"
        showToast={vi.fn()}
        onSelectItem={vi.fn()}
        refreshKey={0}
      />,
    );
    await user.click(screen.getByText("Review Candidates"));
    expect(await screen.findByText("Sample candidate text")).toBeInTheDocument();
  });

  it("shows check icon on copy button when copy is clicked", async () => {
    const user = userEvent.setup();
    const showToast = vi.fn();
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    render(
      <CandidateReview
        projectPath="/test"
        targetKind="scene"
        targetId="sc-1"
        showToast={showToast}
        onSelectItem={vi.fn()}
        refreshKey={0}
      />,
    );

    await user.click(screen.getByText("Review Candidates"));
    await screen.findByText("Sample candidate text");

    const copyBtn = screen.getByTitle("Copy text");
    expect(copyBtn).toBeInTheDocument();

    await user.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith("Sample candidate text");
    expect(showToast).toHaveBeenCalledWith("Copied to clipboard.");
    expect(screen.getByTitle("Copied")).toBeInTheDocument();
  });
});
