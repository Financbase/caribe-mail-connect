import { renderHook, act } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../contexts/LanguageContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useLanguage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('provides language context', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current).toHaveProperty('language');
    expect(result.current).toHaveProperty('setLanguage');
    expect(result.current).toHaveProperty('t');
  });

  it('initializes with Spanish as default', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.language).toBe('es');
  });

  it('loads saved language from localStorage', () => {
    localStorage.setItem('prmcms-language', 'en');
    
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.language).toBe('en');
  });

  it('changes language when setLanguage is called', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(result.current.language).toBe('en');
  });

  it('saves language to localStorage when changed', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(localStorage.getItem('prmcms-language')).toBe('en');
  });

  it('translates text correctly', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    // Test Spanish translation
    expect(result.current.t('common.save')).toBe('Guardar');
    
    // Change to English and test
    act(() => {
      result.current.setLanguage('en');
    });
    
    expect(result.current.t('common.save')).toBe('Save');
  });

  it('returns key if translation not found', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });
    
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key');
  });
}); 