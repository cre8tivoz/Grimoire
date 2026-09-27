import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsPanel } from "../features/settings/SettingsPanel";

vi.mock("lucide-react", () => ({
  Settings: (props: any) => <span {...props} />,
  X: (props: any) => <span {...props} />,
  Moon: (props: any) => <span {...props} />,
  SunMedium: (props: any) => <span {...props} />,
  Globe: (props: any) => <span {...props} />,
  Key: (props: any) => <span {...props} />,
  Trash2: (props: any) => <span {...props} />,
}));

const defaults = {
  isOpen: true,
  onClose: vi.fn(),
  theme: "dark" as const,
  onThemeChange: vi.fn(),
  projectName: "My Project",
  projectPath: "/Users/test/Documents/My Project.grimoire",
  onProjectNameChange: vi.fn(),
  ollamaUrl: "http://127.0.0.1:11434",
  onOllamaUrlChange: vi.fn(),
  activeProvider: "ollama" as const,
  onProviderChange: vi.fn(),
  apiKey: "",
  onApiKeyChange: vi.fn(),
  onApiKeySave: vi.fn(),
  onApiKeyDelete: vi.fn(),
  hasApiKey: false,
};

describe("SettingsPanel", () => {
  it("renders nothing when not open", () => {
    render(<SettingsPanel {...defaults} isOpen={false} />);
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders settings when open", () => {
    render(<SettingsPanel {...defaults} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Project Settings")).toBeInTheDocument();
  });

  it("shows project name", () => {
    render(<SettingsPanel {...defaults} />);
    const input = screen.getByDisplayValue("My Project");
    expect(input).toBeInTheDocument();
  });

  it("shows project path", () => {
    render(<SettingsPanel {...defaults} />);
    expect(screen.getByText(defaults.projectPath)).toBeInTheDocument();
  });

  it("renders all provider buttons", () => {
    render(<SettingsPanel {...defaults} />);
    expect(screen.getAllByText("Ollama").length).toBeGreaterThan(0);
    expect(screen.getByText("OpenAI")).toBeInTheDocument();
    expect(screen.getByText("OpenAI-compatible")).toBeInTheDocument();
    expect(screen.getByText("Google AI Studio")).toBeInTheDocument();
  });

  it("calls onProviderChange when provider clicked", async () => {
    const user = userEvent.setup();
    const onProviderChange = vi.fn();
    render(<SettingsPanel {...defaults} onProviderChange={onProviderChange} />);
    await user.click(screen.getByText("OpenAI"));
    expect(onProviderChange).toHaveBeenCalledWith("openAi");
  });

  it("shows Ollama URL when ollama is selected", () => {
    render(<SettingsPanel {...defaults} />);
    expect(screen.getByDisplayValue("http://127.0.0.1:11434")).toBeInTheDocument();
  });

  it("shows API key input for cloud providers", () => {
    render(<SettingsPanel {...defaults} activeProvider="openAi" />);
    expect(screen.getByPlaceholderText("Paste OpenAI API key")).toBeInTheDocument();
  });

  it("hides API key section for ollama", () => {
    render(<SettingsPanel {...defaults} activeProvider="ollama" />);
    expect(screen.queryByPlaceholderText("Paste Ollama API key")).not.toBeInTheDocument();
  });

  it("calls onClose when dismiss button clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SettingsPanel {...defaults} onClose={onClose} />);
    await user.click(screen.getByLabelText("Close settings"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onThemeChange when theme button clicked and exposes aria-pressed state", async () => {
    const user = userEvent.setup();
    const onThemeChange = vi.fn();
    render(<SettingsPanel {...defaults} theme="dark" onThemeChange={onThemeChange} />);

    const darkBtn = screen.getByRole("button", { name: /Dark/i });
    const ivoryBtn = screen.getByRole("button", { name: /Ivory/i });

    expect(darkBtn).toHaveAttribute("aria-pressed", "true");
    expect(ivoryBtn).toHaveAttribute("aria-pressed", "false");

    await user.click(ivoryBtn);
    expect(onThemeChange).toHaveBeenCalledWith("ivory");
  });

  it("exposes AI provider selection as a radiogroup with aria-checked states", () => {
    render(<SettingsPanel {...defaults} activeProvider="ollama" />);

    const radioGroup = screen.getByRole("radiogroup", { name: "AI Provider" });
    expect(radioGroup).toBeInTheDocument();

    const ollamaRadio = screen.getByRole("radio", { name: /OllamaLocal/i });
    const openAiRadio = screen.getByRole("radio", { name: /OpenAICloud/i });

    expect(ollamaRadio).toHaveAttribute("aria-checked", "true");
    expect(openAiRadio).toHaveAttribute("aria-checked", "false");
  });

  it("disables save key button when apiKey is empty", () => {
    render(<SettingsPanel {...defaults} activeProvider="openAi" apiKey="" />);
    const saveButton = screen.getByText("Save Key").closest("button");
    expect(saveButton).toBeDisabled();
  });

  it("enables save key button when apiKey has value", () => {
    render(<SettingsPanel {...defaults} activeProvider="openAi" apiKey="sk-test" />);
    const saveButton = screen.getByText("Save Key").closest("button");
    expect(saveButton).not.toBeDisabled();
  });
});
