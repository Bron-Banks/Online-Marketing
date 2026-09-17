import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import NotFound from "./NotFound";

test("renders a 404 message with a link back home", () => {
  render(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );

  expect(screen.getByText("404")).toBeInTheDocument();
  expect(screen.getByText("Page not found")).toBeInTheDocument();

  const homeLink = screen.getByRole("link", { name: /back to home/i });
  expect(homeLink).toHaveAttribute("href", "/");
});
