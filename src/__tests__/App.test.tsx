import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockInvoke = vi.fn();
vi.mock("@tauri-apps/api/core", () => ({ invoke: (...args: any[]) => mockInvoke(...args) }));
vi.mock("@tauri-apps/plugin-dialog", () => ({ open: vi.fn() }));

import { App } from "../app/App";

describe("App Header and Panel Accessibility", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockInvoke.mockImplementation((cmd: string) => {
      if (cmd === "app_ping") return Promise.resolve("pong");
      if (cmd === "project_create") return Promise.resolve({
        name: "Grimoire Demo",
        appVersion: "1.0.0",
        schemaVersion: 1,
        projectPath: "/test/demo.grimoire",
        databasePath: "/test/demo.grimoire/db.sqlite",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      if (cmd === "db_get_vault_tree") return Promise.resolve({ wings: [], itemCount: 0 });
      if (cmd === "storyplan_list") return Promise.resolve({ plans: [] });
      if (cmd === "storyplan_candidate_list") return Promise.resolve([]);
      if (cmd === "get_ai_engine_status") return Promise.resolve({ provider: "ollama", activeModel: "llama3" });
      if (cmd === "list_banned_words") return Promise.resolve([]);
      return Promise.resolve([]);
    });
  });

  it("renders top bar buttons with accessible aria-labels and matching titles", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Settings button
    const settingsBtn = screen.getByLabelText("Settings");
    expect(settingsBtn).toHaveAttribute("title", "Settings");

    // Theme toggle button
    const themeBtn = screen.getByLabelText("Switch to light theme");
    expect(themeBtn).toHaveAttribute("title", "Switch to light theme");

    // Toggle theme to ivory
    await user.click(themeBtn);
    expect(screen.getByLabelText("Switch to dark theme")).toHaveAttribute("title", "Switch to dark theme");

    // Focus mode button
    const focusBtn = screen.getByRole("button", { name: "Focus" });
    expect(focusBtn).toHaveAttribute("title", "Enter Focus mode");

    await user.click(focusBtn);
    const exitFocusBtn = screen.getByRole("button", { name: "Exit Focus" });
    expect(exitFocusBtn).toHaveAttribute("title", "Exit Focus mode");
  });

  it("renders side panel collapse and expand buttons with context-aware labels based on active tab", async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click "Load Demo" to enter workspace
    const loadDemoBtn = screen.getByRole("button", { name: /Load Demo/i });
    await user.click(loadDemoBtn);

    // Default active tab is Vault
    const collapseVaultBtn = screen.getByLabelText("Collapse Vault panel");
    expect(collapseVaultBtn).toHaveAttribute("title", "Collapse Vault panel");

    // Switch left tab to Story Plan
    const planTab = screen.getByRole("tab", { name: /Plan/i });
    await user.click(planTab);

    const collapsePlanBtn = screen.getByLabelText("Collapse Story Plan panel");
    expect(collapsePlanBtn).toHaveAttribute("title", "Collapse Story Plan panel");

    // Collapse the left panel
    await user.click(collapsePlanBtn);

    // Verify expand rail button context-aware label
    const openPlanBtn = screen.getByLabelText("Open Story Plan panel");
    expect(openPlanBtn).toHaveAttribute("title", "Open Story Plan panel");

    // Expand panel again and switch back to Vault
    await user.click(openPlanBtn);
    const vaultTab = screen.getByRole("tab", { name: /Vault/i });
    await user.click(vaultTab);

    // Collapse again to verify Vault rail label
    const collapseVaultBtn2 = screen.getByLabelText("Collapse Vault panel");
    await user.click(collapseVaultBtn2);

    const openVaultBtn = screen.getByLabelText("Open Vault panel");
    expect(openVaultBtn).toHaveAttribute("title", "Open Vault panel");
  });
});
