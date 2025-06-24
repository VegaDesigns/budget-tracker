import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import { BudgetProvider } from '../context/BudgetContext';

function renderApp() {
  return render(
    <BudgetProvider>
      <App />
    </BudgetProvider>
  );
}

describe('Budget Tracker interactions', () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('can add and delete a transaction', () => {
    renderApp();
    // fill out form
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Coffee' },
    });
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByLabelText(/type/i), {
      target: { value: 'expense' },
    });
    fireEvent.submit(screen.getByRole('button', { name: /add transaction/i }));

    // expect item to appear
    const item = screen.getByText('Coffee');
    expect(item).toBeInTheDocument();

    // delete it
    fireEvent.click(screen.getByLabelText(/delete transaction/i));
    expect(item).not.toBeInTheDocument();
  });

  test('theme toggle persists to localStorage', () => {
    renderApp();
    const toggle = screen.getByRole('checkbox');
    fireEvent.click(toggle);
    expect(window.localStorage.getItem('theme')).toBe('dark');
  });
});
