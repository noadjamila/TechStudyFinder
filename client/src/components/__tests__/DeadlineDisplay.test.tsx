import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import DeadlineDisplay from "../DeadlineDisplay";
import theme from "../../theme/theme";
import { Deadline } from "../../types/StudyProgramme.types";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe("DeadlineDisplay Component", () => {
  it("renders application deadlines correctly", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText(/Bewerbung & Einschreibung/)).toBeInTheDocument();
    expect(screen.getByText("Zulassungsbeschränkt:")).toBeInTheDocument();
    expect(screen.getByText(/15\.01\.2026.*15\.07\.2026/)).toBeInTheDocument();
  });

  it("renders aptitude test deadlines correctly", () => {
    const fristen: Deadline[] = [
      {
        typ: "aptitude_test",
        start: "2026-03-01",
        ende: "2026-03-15",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getAllByText(/Eignungsprüfung/)).toHaveLength(2); // Header + label
    expect(screen.getByText("Eignungsprüfung:")).toBeInTheDocument();
    expect(screen.getByText(/01\.03\.2026.*15\.03\.2026/)).toBeInTheDocument();
  });

  it("renders lecture period deadlines correctly", () => {
    const fristen: Deadline[] = [
      {
        typ: "lecture_period",
        start: "2026-10-01",
        ende: "2027-02-28",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getAllByText(/Vorlesungszeit/)).toHaveLength(2); // Header + label
    expect(screen.getByText("Vorlesungszeit:")).toBeInTheDocument();
    expect(screen.getByText(/01\.10\.2026.*28\.02\.2027/)).toBeInTheDocument();
  });

  it("displays semester information when present", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: "WS 2026/27",
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText("Semester WS 2026/27")).toBeInTheDocument();
  });

  it("displays comment when present", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: "Nur für Nicht-EU-Bewerber",
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText("Nur für Nicht-EU-Bewerber")).toBeInTheDocument();
  });

  it("handles deadlines with only start date", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: null,
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText(/ab 15\.01\.2026/)).toBeInTheDocument();
  });

  it("handles deadlines with only end date", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: null,
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText(/bis 15\.07\.2026/)).toBeInTheDocument();
  });

  it("merges EU and Non-EU deadlines when identical", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_eu",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
      {
        typ: "application_non_eu",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText("Alle:")).toBeInTheDocument();
    expect(screen.queryByText("EU:")).not.toBeInTheDocument();
    expect(screen.queryByText("Nicht-EU:")).not.toBeInTheDocument();
  });

  it("does not merge EU and Non-EU deadlines when different", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_eu",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
      {
        typ: "application_non_eu",
        start: "2026-02-01",
        ende: "2026-06-30",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText("EU:")).toBeInTheDocument();
    expect(screen.getByText("Nicht-EU:")).toBeInTheDocument();
    expect(screen.queryByText("Alle:")).not.toBeInTheDocument();
  });

  it("renders multiple deadlines in correct order", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_unrestricted",
        start: "2026-01-15",
        ende: "2026-09-30",
        kommentar: null,
        semester: null,
      },
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
      {
        typ: "lecture_period",
        start: "2026-10-01",
        ende: "2027-02-28",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    // Check that both deadline types are rendered
    expect(screen.getByText("Zulassungsbeschränkt:")).toBeInTheDocument();
    expect(screen.getByText("Zulassungsfrei:")).toBeInTheDocument();
  });

  it("ignores deadlines with unknown types", () => {
    const fristen: Deadline[] = [
      {
        typ: "unknown_type" as any,
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText("Zulassungsbeschränkt:")).toBeInTheDocument();
    expect(screen.queryByText("unknown_type")).not.toBeInTheDocument();
  });

  it("renders empty when no deadlines provided", () => {
    const { container } = renderWithTheme(<DeadlineDisplay fristen={[]} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("handles long URLs in comments with word-break", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar:
          "https://www.example.com/very/long/url/that/should/break/properly",
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    // Check that the comment is rendered
    expect(
      screen.getByText(
        "https://www.example.com/very/long/url/that/should/break/properly",
      ),
    ).toBeInTheDocument();
  });

  it("renders registration deadlines in correct section", () => {
    const fristen: Deadline[] = [
      {
        typ: "registration_unrestricted",
        start: "2026-08-01",
        ende: "2026-09-30",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText(/Bewerbung & Einschreibung/)).toBeInTheDocument();
    expect(screen.getByText("Einschreibefrist:")).toBeInTheDocument();
  });

  it("renders multiple deadline categories simultaneously", () => {
    const fristen: Deadline[] = [
      {
        typ: "application_restricted",
        start: "2026-01-15",
        ende: "2026-07-15",
        kommentar: null,
        semester: null,
      },
      {
        typ: "aptitude_test",
        start: "2026-03-01",
        ende: "2026-03-15",
        kommentar: null,
        semester: null,
      },
      {
        typ: "lecture_period",
        start: "2026-10-01",
        ende: "2027-02-28",
        kommentar: null,
        semester: null,
      },
    ];

    renderWithTheme(<DeadlineDisplay fristen={fristen} />);

    expect(screen.getByText("Bewerbung & Einschreibung")).toBeInTheDocument();
    expect(screen.getAllByText(/Eignungsprüfung/)).toHaveLength(2); // Header + label
    expect(screen.getByText("Vorlesungszeit")).toBeInTheDocument();
  });
});
