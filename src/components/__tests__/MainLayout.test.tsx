import { render, screen, fireEvent } from '@testing-library/react';
import { MainLayout } from '../layout/MainLayout';
import { AuthProvider } from '../../contexts/AuthContext';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Mock the sidebar components
jest.mock('../ui/sidebar', () => ({
  Sidebar: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar">{children}</div>,
  SidebarProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="sidebar-provider">{children}</div>,
}));

// Mock the mobile layout
jest.mock('../mobile/MobileLayout', () => ({
  MobileLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="mobile-layout">{children}</div>,
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <AuthProvider>
      <LanguageProvider>
        {component}
      </LanguageProvider>
    </AuthProvider>
  );
};

describe('MainLayout', () => {
  it('renders without crashing', () => {
    renderWithProviders(<MainLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders children content', () => {
    const testContent = 'Test Content';
    renderWithProviders(
      <MainLayout>
        <div>{testContent}</div>
      </MainLayout>
    );
    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('renders mobile layout on mobile devices', () => {
    // Mock window.innerWidth to simulate mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    renderWithProviders(<MainLayout />);
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument();
  });

  it('renders sidebar on desktop devices', () => {
    // Mock window.innerWidth to simulate desktop
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    renderWithProviders(<MainLayout />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });
}); 