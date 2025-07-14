import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

describe('Card Component', () => {
  test('renders children correctly', () => {
    const childText = 'Hello, Card!';
    render(
      <Card>
        <p>{childText}</p>
      </Card>
    );
    
    const childElement = screen.getByText(childText);
    expect(childElement).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const customClass = 'my-custom-class';
    const { container } = render(<Card className={customClass} />);
    
    // Check if the first child of the container (the card div) has the custom class
    expect(container.firstChild).toHaveClass(customClass);
  });
});
