import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter } from "react-router-dom";
import StudyProgrammeCard from "../StudyProgrammeCard";
import theme from "../../../theme/theme";
import { StudyProgramme } from "../../../types/StudyProgramme.types";

const mockedNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

const mockProgramme: StudyProgramme = {
  id: 1,
  name: "Computer Science",
  university: "Technical University Munich",
  degree: "Bachelor of Science",
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
    </MemoryRouter>,
  );
};

describe("StudyProgrammeCard Component", () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
  });

  describe("Rendering", () => {
    it("renders programme name", () => {
      renderWithTheme(<StudyProgrammeCard programme={mockProgramme} />);
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
    });

    it("renders university with location icon", () => {
      renderWithTheme(<StudyProgrammeCard programme={mockProgramme} />);
      expect(
        screen.getByText("Technical University Munich"),
      ).toBeInTheDocument();
    });

    it("renders degree with stars icon", () => {
      renderWithTheme(<StudyProgrammeCard programme={mockProgramme} />);
      expect(screen.getByText("Bachelor of Science")).toBeInTheDocument();
    });

    it("renders with card styling", () => {
      const { container } = renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} />,
      );
      const card = container.querySelector(".MuiCard-root");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Favorite Functionality", () => {
    it("renders favorite button when onToggleFavorite is provided", () => {
      const onToggleFavorite = vi.fn();
      renderWithTheme(
        <StudyProgrammeCard
          programme={mockProgramme}
          onToggleFavorite={onToggleFavorite}
        />,
      );

      expect(
        screen.getByLabelText("Zu Favoriten hinzufügen"),
      ).toBeInTheDocument();
    });

    it("does not render favorite button when onToggleFavorite is not provided", () => {
      renderWithTheme(<StudyProgrammeCard programme={mockProgramme} />);

      expect(
        screen.queryByLabelText("Zu Favoriten hinzufügen"),
      ).not.toBeInTheDocument();
    });

    it("shows unfavorited icon by default", () => {
      const onToggleFavorite = vi.fn();
      renderWithTheme(
        <StudyProgrammeCard
          programme={mockProgramme}
          onToggleFavorite={onToggleFavorite}
          isFavorite={false}
        />,
      );

      expect(
        screen.getByLabelText("Zu Favoriten hinzufügen"),
      ).toBeInTheDocument();
    });

    it("shows favorited icon when isFavorite is true", () => {
      const onToggleFavorite = vi.fn();
      renderWithTheme(
        <StudyProgrammeCard
          programme={mockProgramme}
          onToggleFavorite={onToggleFavorite}
          isFavorite={true}
        />,
      );

      expect(
        screen.getByLabelText("Aus Favoriten entfernen"),
      ).toBeInTheDocument();
    });

    it("calls onToggleFavorite with programme id when favorite button is clicked", () => {
      const onToggleFavorite = vi.fn();
      renderWithTheme(
        <StudyProgrammeCard
          programme={mockProgramme}
          onToggleFavorite={onToggleFavorite}
        />,
      );

      const favoriteButton = screen.getByLabelText("Zu Favoriten hinzufügen");
      fireEvent.click(favoriteButton);

      expect(onToggleFavorite).toHaveBeenCalledWith(1);
      expect(onToggleFavorite).toHaveBeenCalledTimes(1);
    });

    it("does not trigger card navigation when favorite button is clicked", () => {
      const onToggleFavorite = vi.fn();
      renderWithTheme(
        <StudyProgrammeCard
          programme={mockProgramme}
          onToggleFavorite={onToggleFavorite}
        />,
      );

      const favoriteButton = screen.getByLabelText("Zu Favoriten hinzufügen");
      fireEvent.click(favoriteButton);

      expect(mockedNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Navigation Functionality", () => {
    it("navigates to detail page when card is clicked (clickable=true)", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = screen.getByRole("button", {
        name: /Details anzeigen für Computer Science/i,
      });
      fireEvent.click(card);

      expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
    });

    it("navigates by default when clickable prop is not specified", () => {
      renderWithTheme(<StudyProgrammeCard programme={mockProgramme} />);

      const card = screen.getByRole("button");
      fireEvent.click(card);

      expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
    });

    it("does not navigate when clickable is false", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={false} />,
      );

      const card = screen
        .getByText("Computer Science")
        .closest(".MuiCard-root");
      fireEvent.click(card!);

      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it("does not have button role when clickable is false", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={false} />,
      );

      const buttonRole = screen.queryByRole("button");
      expect(buttonRole).not.toBeInTheDocument();
    });

    it("has pointer cursor when clickable is true", () => {
      const { container } = renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).toHaveStyle({ cursor: "pointer" });
    });

    it("has default cursor when clickable is false", () => {
      const { container } = renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={false} />,
      );

      const card = container.querySelector(".MuiCard-root");
      expect(card).toHaveStyle({ cursor: "default" });
    });
  });

  describe("Keyboard Accessibility", () => {
    it("is keyboard focusable when clickable is true", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = screen.getByRole("button");
      expect(card).toHaveAttribute("tabIndex", "0");
    });

    it("is not keyboard focusable when clickable is false", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={false} />,
      );

      const card = screen
        .getByText("Computer Science")
        .closest(".MuiCard-root");
      expect(card).not.toHaveAttribute("tabIndex");
    });

    it("navigates when Enter key is pressed", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = screen.getByRole("button");
      fireEvent.keyDown(card, { key: "Enter" });

      expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
    });

    it("navigates when Space key is pressed", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = screen.getByRole("button");
      fireEvent.keyDown(card, { key: " " });

      expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/1");
    });

    it("does not navigate on other key presses", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = screen.getByRole("button");
      fireEvent.keyDown(card, { key: "a" });
      fireEvent.keyDown(card, { key: "Escape" });

      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it("does not navigate on keyboard events when clickable is false", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={false} />,
      );

      const card = screen
        .getByText("Computer Science")
        .closest(".MuiCard-root");
      fireEvent.keyDown(card!, { key: "Enter" });
      fireEvent.keyDown(card!, { key: " " });

      expect(mockedNavigate).not.toHaveBeenCalled();
    });

    it("has proper aria-label when clickable", () => {
      renderWithTheme(
        <StudyProgrammeCard programme={mockProgramme} clickable={true} />,
      );

      const card = screen.getByRole("button");
      expect(card).toHaveAttribute(
        "aria-label",
        "Details anzeigen für Computer Science",
      );
    });
  });

  describe("Different Programme Data", () => {
    it("renders different programme correctly", () => {
      const differentProgramme: StudyProgramme = {
        id: 42,
        name: "Data Science",
        university: "LMU München",
        degree: "Master of Science",
      };

      renderWithTheme(<StudyProgrammeCard programme={differentProgramme} />);

      expect(screen.getByText("Data Science")).toBeInTheDocument();
      expect(screen.getByText("LMU München")).toBeInTheDocument();
      expect(screen.getByText("Master of Science")).toBeInTheDocument();
    });

    it("navigates to correct id for different programme", () => {
      const differentProgramme: StudyProgramme = {
        id: 99,
        name: "Software Engineering",
        university: "TU Berlin",
        degree: "Bachelor",
      };

      renderWithTheme(<StudyProgrammeCard programme={differentProgramme} />);

      const card = screen.getByRole("button");
      fireEvent.click(card);

      expect(mockedNavigate).toHaveBeenCalledWith("/study-programme/99");
    });
  });
});
