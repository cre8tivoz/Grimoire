import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RegeneratePanel } from "../features/storyplan/RegeneratePanel";
import * as storyplanApp from "../app/storyplan";
import type { AiProviderSettings } from "../app/ai";

vi.mock("../app/storyplan", () => ({
  regenerateStoryLayer: vi.fn(),
}));

vi.mock("lucide-react", () => ({
  Loader2: (props: any) => <span data-testid="loader-icon" {...props} />,
  RefreshCw: (props: any) => <span data-testid="refresh-icon" {...props} />,
  Send: (props: any) => <span data-testid="send-icon" {...props} />,
}));

describe("RegeneratePanel", () => {
  const dummySettings: AiProviderSettings = {
    provider: "openAi",
    displayName: "OpenAI",
    baseUrl: null,
    selectedModel: "gpt-4o",
    apiKeyPresent: true,
    disclosureAcceptedAt: "2025-01-01T00:00:00Z",
    enabled: true,
  };

  const defaultProps = {
    projectPath: "/test-project",
    targetKind: "scene" as const,
    targetId: "sc-123",
    providers: ["ollama", "openAi"] as any,
    activeProvider: "openAi" as const,
    providerSettings: dummySettings,
    providerModels: null,
    onProviderChange: vi.fn(),
    onRefreshModels: vi.fn(),
    showToast: vi.fn(),
    onGenerationDone: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders disabled button with dynamic tooltip and aria-label when provider is not ready", () => {
    render(
      <RegeneratePanel
        {...defaultProps}
        providerSettings={null}
      />,
    );

    const btn = screen.getByRole("button", { name: "Generate variants for scene (disabled: API key required)" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "false");
    expect(btn).toHaveAttribute("title", "Add an API key in Co-Writer settings to generate variants");
    expect(screen.getByText("Add an API key in Co-Writer settings.")).toBeInTheDocument();
  });

  it("disables button and sets aria-busy during regeneration execution", async () => {
    const user = userEvent.setup();
    let resolvePromise: (value: any) => void = () => {};
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(storyplanApp.regenerateStoryLayer).mockReturnValue(pendingPromise as any);

    render(<RegeneratePanel {...defaultProps} />);

    const instructionInput = screen.getByLabelText("Edit instruction");
    await user.type(instructionInput, "Make it more dramatic");

    const generateBtn = screen.getByRole("button", { name: "Generate variants for scene" });
    expect(generateBtn).not.toBeDisabled();

    await user.click(generateBtn);

    expect(generateBtn).toBeDisabled();
    expect(generateBtn).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Generating…")).toBeInTheDocument();
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();

    await act(async () => {
      resolvePromise({ success: true });
      await pendingPromise;
    });
  });
});
