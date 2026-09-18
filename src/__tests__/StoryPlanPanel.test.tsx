import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { StoryPlanPanel } from "../features/storyplan/StoryPlanPanel";

// Mock @tauri-apps/api/core
const mockInvoke = vi.fn();
vi.mock("@tauri-apps/api/core", () => ({
  invoke: (...args: any[]) => mockInvoke(...args),
}));

// Mock lucide-react with explicit dummy components
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
  ShieldAlert: (props: any) => <span data-testid="shield-alert" {...props} />,
  ShieldCheck: (props: any) => <span data-testid="shield-check" {...props} />,
  Trash2: (props: any) => <span data-testid="trash2" {...props} />,
  X: (props: any) => <span data-testid="x" {...props} />,
  Loader2: (props: any) => <span data-testid="loader2" {...props} />,
  RefreshCw: (props: any) => <span data-testid="refresh-cw" {...props} />,
  Send: (props: any) => <span data-testid="send" {...props} />,
  History: (props: any) => <span data-testid="history" {...props} />,
  Check: (props: any) => <span data-testid="check" {...props} />,
}));

const mockPlanDetail = {
  id: "plan-1",
  projectName: "Test Plan",
  logline: "Test logline",
  synopsis: "Test synopsis",
  status: "draft",
  scenes: [
    {
      id: "scene-1",
      title: "Opening Scene",
      setting: "Room",
      summary: "Summary",
      linkedItemId: "item-1",
      beats: [
        {
          id: "beat-1",
          content: "First beat content",
          beatType: "action",
          locked: false,
          characters: ["Alice"],
        },
      ],
    },
  ],
};

describe("StoryPlanPanel accessibility", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    mockInvoke.mockImplementation(async (cmd: string) => {
      if (cmd === "storyplan_list") {
        return { plans: [{ id: "plan-1", projectName: "Test Plan", status: "draft" }] };
      }
      if (cmd === "storyplan_get") {
        return mockPlanDetail;
      }
      if (cmd === "storyplan_candidate_list") {
        return [];
      }
      return null;
    });
  });

  it("renders accessible ARIA labels on top toolbar icon buttons", async () => {
    render(
      <StoryPlanPanel
        projectPath="/test/project"
        vaultItems={[]}
        showToast={() => {}}
        onOpenLinkedItem={() => {}}
        providers={["anthropic"]}
        activeProvider="anthropic"
        providerSettings={null}
        providerModels={null}
        onProviderChange={() => {}}
        onRefreshModels={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "New story plan" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Delete story plan" })).toBeInTheDocument();
    });
  });

  it("renders accessible ARIA labels on scene and beat action buttons", async () => {
    render(
      <StoryPlanPanel
        projectPath="/test/project"
        vaultItems={[]}
        showToast={() => {}}
        onOpenLinkedItem={() => {}}
        providers={["anthropic"]}
        activeProvider="anthropic"
        providerSettings={null}
        providerModels={null}
        onProviderChange={() => {}}
        onRefreshModels={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Open linked Vault item for Opening Scene" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Move scene Opening Scene up" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Move scene Opening Scene down" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit scene Opening Scene" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Delete scene Opening Scene" })).toBeInTheDocument();
    });
  });
});
