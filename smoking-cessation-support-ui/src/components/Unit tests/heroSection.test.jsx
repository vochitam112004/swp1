import { render, screen } from "@testing-library/react";
import HeroSection from "../heroSection";

test("renders hero section title", () => {
  render(<HeroSection />);
  expect(screen.getByText(/đánh bại thuốc lá/i)).toBeInTheDocument();
});