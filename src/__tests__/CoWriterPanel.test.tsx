import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoWriterPanel } from "../features/cowriter/CoWriterPanel";
import { providerLabels } from "../app/ai";
import type { ToolSectionId } from "../components/types";

vi.mock("lucide-react", () => ({
  BrainCircuit: (props: any) => <span {...props} />,
  ChevronRight: (props: any) => <span {...props} />,
  ChevronDown: (props: any) => <span {...props} />,
  Upload: (props: any) => <span {...props} />,
  Loader2: (props: any) => <span {...props} />,
  Clipboard: (props: any) => <span {...props} />,
  FileText: (props: any) => <span {...props} />,
  Search: (props: any) => <span {...props} />,
  Sparkles: (props: any) => <span {...props} />,
  WandSparkles: (props: any) => <span {...props} />,
  Copy: (props: any) => <span {...props} />,
  Check: (props: any) => <span {...props} />,
  X: (props: any) => <span {...props} />,
  ShieldCheck: (props: any) => <span {...props} />,
  Trash2: (props: any) => <span {...props} />,
  Info: (props: any) => <span {...props} />,
  Plus: (props: any) => <span {...props} />,
}));

const allSections = new Set<ToolSectionId>(["feed", "retrieval", "engine", "cowriter", "wards", "about"]);

const defaultProps = {
  rightCollapsed: false,
  activeProvider: "openAi" as const,
  selectedModel: "gpt-4o",
  providerLabels,
  providerModels: null,
  activeProviderSettings: {
    provider: "openAi" as const,
    displayName: "OpenAI",
    baseUrl: null,
    selectedModel: "gpt-4o",
    apiKeyPresent: true,
    disclosureAcceptedAt: null,
    enabled: true,
  },
  activeProviderIsCloud: true,
  openToolSectionSet: allSections,

  importTitle: "",
  importBody: "",
  importState: "idle" as const,
  importStatus: "",
  importProgress: [],

  engineState: "idle" as const,
  engineStatus: "",
  engineError: null,
  modelDraft: "gpt-4o",
  modelOptions: ["gpt-4o", "gpt-4o-mini"],
  apiKeyDraft: "",
  baseUrlDraft: "",

  cowriterPrompt: "",
  cowriterState: "idle" as const,
  cowriterStatus: "",
  cowriterAnswer: "",
  cowriterError: null,
  retrievalResults: [],
  answerWardHits: [],

  wards: [],
  wardInput: "",
  wardSeverity: "warn" as const,
  wardState: "idle" as const,
  wardStatus: "",

  searchResults: [],

  onToggleToolSection: vi.fn(),
  onImportTitleChange: vi.fn(),
  onImportBodyChange: vi.fn(),
  onPasteImport: vi.fn(),
  onFileImport: vi.fn(),
  onRefreshEngine: vi.fn(),
  onProviderTest: vi.fn(),
  onProviderSelection: vi.fn(),
  onModelDraftChange: vi.fn(),
  onApiKeyDraftChange: vi.fn(),
  onBaseUrlDraftChange: vi.fn(),
  onApiKeySave: vi.fn(),
  onApiKeyDelete: vi.fn(),
  onEngineSettingsSave: vi.fn(),
  onCowriterPromptChange: vi.fn(),
  onRunCowriter: vi.fn(),
  onInsertAnswer: vi.fn(),
  onCopyAnswer: vi.fn(),
  onDiscardAnswer: vi.fn(),
  onRewriteClean: vi.fn(),
  onWardInputChange: vi.fn(),
  onWardSeverityChange: vi.fn(),
  onWardAdd: vi.fn(),
  onWardRemove: vi.fn(),
  onSelectItem: vi.fn(),
  onExpandRight: vi.fn(),
  onCollapseRight: vi.fn(),
};

describe("CoWriterPanel Accessibility", () => {
  it("renders accessible ARIA labels for feed inputs", () => {
    render(<CoWriterPanel {...defaultProps} />);
    expect(screen.getByLabelText("Import title")).toBeInTheDocument();
    expect(screen.getByLabelText("Import content")).toBeInTheDocument();
    expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
  });

  it("renders accessible ARIA labels for engine inputs", () => {
    render(<CoWriterPanel {...defaultProps} />);
    expect(screen.getByLabelText("Select AI model")).toBeInTheDocument();
    expect(screen.getByLabelText("OpenAI API key")).toBeInTheDocument();
    expect(screen.getByLabelText("Model ID")).toBeInTheDocument();
  });

  it("renders accessible ARIA label for OpenAI compatible base URL when active", () => {
    render(<CoWriterPanel {...defaultProps} activeProvider="openAiCompatible" />);
    expect(screen.getByLabelText("Base URL")).toBeInTheDocument();
  });

  it("renders accessible ARIA label for Co-Writer prompt", () => {
    render(<CoWriterPanel {...defaultProps} />);
    expect(screen.getByLabelText("Co-Writer question prompt")).toBeInTheDocument();
  });

  it("renders accessible ARIA labels for ward input and severity select", () => {
    render(<CoWriterPanel {...defaultProps} />);
    expect(screen.getByLabelText("Ward phrase")).toBeInTheDocument();
    expect(screen.getByLabelText("Ward severity")).toBeInTheDocument();
  });
});
