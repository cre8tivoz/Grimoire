import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StoryPlanPanel } from "../features/storyplan/StoryPlanPanel";
import * as storyplanApp from "../app/storyplan";

// Mock storyplan bridge functions
vi.mock("../app/storyplan", async () => {
  const actual = await vi.importActual("../app/storyplan");
  return {
    ...actual,
    listStoryPlans: vi.fn(),
    getStoryPlan: vi.fn(),
    listStoryCandidates: vi.fn().mockResolvedValue([]),
  };
});

// Mock lucide-react to avoid SVG rendering issues in jsdom
vi.mock("lucide-react", () => ({
  ArrowDown: (props: any) => <span data-testid="arrow-down" {...props} />,
  ArrowUp: (props: any) => <span data-testid="arrow-up" {...props} />,
  ChevronDown: (props: any) => <span data-testid="chevron-down" {...props} />,
  ChevronRight: (props: any) => <span data-testid="chevron-right" {...props} />,
  Film: (props: any) => <span data-testid="film" {...props} />,
  Link2: (props: any) => <span data-testid="link2" {...props} />,
  Plus: (props: any) => <span data-testid="plus" {...props} />,
  ScrollText: (props: any) => <span data-testid="scroll-text" {...props} />,
  Shield: (props: any) => <span data-testid="shield" {...props} />,
  ShieldCheck: (props: any) => <span data-testid="shield-check" {...props} />,
  ShieldAlert: (props: any) => <span data-testid="shield-alert" {...props} />,
  ShieldOff: (props: any) => <span data-testid="shield-off" {...props} />,
  Trash2: (props: any) => <span data-testid="trash2" {...props} />,
  X: (props: any) => <span data-testid="x" {...props} />,
  RefreshCw: (props: any) => <span data-testid="refresh-cw" {...props} />,
  Loader2: (props: any) => <span data-testid="loader2" {...props} />,
  Send: (props: any) => <span data-testid="send" {...props} />,
  History: (props: any) => <span data-testid="history" {...props} />,
  Copy: (props: any) => <span data-testid="copy" {...props} />,
  Check: (props: any) => <span data-testid="check" {...props} />,
}));

const noop = () => {};

describe("StoryPlanPanel accessibility", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(storyplanApp.listStoryCandidates).mockResolvedValue([]);
  });

  it("renders scene and beat action buttons with context-aware aria-labels and titles", async () => {
    const user = userEvent.setup();

    const mockPlanDetail: storyplanApp.StoryPlanDetail = {
      id: "plan_1",
      projectName: "Test Project",
      logline: "Test logline",
      synopsis: "Test synopsis",
      status: "draft",
      createdAt: "",
      updatedAt: "",
      scenes: [
        {
          id: "scene_1",
          planId: "plan_1",
          title: "The Meeting",
          setting: "Cafe",
          summary: "Two characters talk",
          sortOrder: 0,
          createdAt: "",
          updatedAt: "",
          linkedItemId: "item_1",
          beats: [
            {
              id: "beat_1",
              sceneId: "scene_1",
              content: "Alice orders coffee.",
              beatType: "action",
              locked: false,
              characters: ["Alice"],
              sortOrder: 0,
              createdAt: "",
              updatedAt: "",
            },
          ],
        },
      ],
    };

    vi.mocked(storyplanApp.listStoryPlans).mockResolvedValue({
      plans: [{ id: "plan_1", projectName: "Test Project", logline: "Test logline", synopsis: "Test synopsis", status: "draft", createdAt: "", updatedAt: "" }],
    });
    vi.mocked(storyplanApp.getStoryPlan).mockResolvedValue(mockPlanDetail);

    render(
      <StoryPlanPanel
        projectPath="/test/project.grimoire"
        vaultItems={[]}
        showToast={noop}
        onOpenLinkedItem={noop}
        providers={["ollama"]}
        activeProvider="ollama"
        providerSettings={null}
        providerModels={null}
        onProviderChange={noop}
        onRefreshModels={noop}
      />
    );

    // Wait for plan detail to load
    const sceneTitle = await screen.findByText("The Meeting");
    expect(sceneTitle).toBeInTheDocument();

    // Verify scene action buttons have context-aware aria-labels and matching titles
    const editSceneBtn = screen.getByLabelText('Edit scene "The Meeting"');
    expect(editSceneBtn).toHaveAttribute("title", 'Edit scene "The Meeting"');

    const deleteSceneBtn = screen.getByLabelText('Delete scene "The Meeting"');
    expect(deleteSceneBtn).toHaveAttribute("title", 'Delete scene "The Meeting"');

    const moveSceneUpBtn = screen.getByLabelText('Move scene "The Meeting" up');
    expect(moveSceneUpBtn).toHaveAttribute("title", 'Move scene "The Meeting" up');

    const moveSceneDownBtn = screen.getByLabelText('Move scene "The Meeting" down');
    expect(moveSceneDownBtn).toHaveAttribute("title", 'Move scene "The Meeting" down');

    const linkedVaultItemBtn = screen.getByLabelText('Open linked Vault item for "The Meeting"');
    expect(linkedVaultItemBtn).toHaveAttribute("title", 'Open linked Vault item for "The Meeting"');

    // Expand scene to reveal beats
    await user.click(sceneTitle);

    // Verify beat action buttons have context-aware aria-labels and matching titles
    const editBeatBtn = screen.getByLabelText("Edit beat 1");
    expect(editBeatBtn).toHaveAttribute("title", "Edit beat 1");

    const deleteBeatBtn = screen.getByLabelText("Delete beat 1");
    expect(deleteBeatBtn).toHaveAttribute("title", "Delete beat 1");

    const moveBeatUpBtn = screen.getByLabelText("Move beat 1 up");
    expect(moveBeatUpBtn).toHaveAttribute("title", "Move beat 1 up");

    const moveBeatDownBtn = screen.getByLabelText("Move beat 1 down");
    expect(moveBeatDownBtn).toHaveAttribute("title", "Move beat 1 down");

    const pinBeatBtn = screen.getByLabelText("Pin beat 1");
    expect(pinBeatBtn).toHaveAttribute("title", "Pin beat 1 — pinned beats will not drift");
  });
});
