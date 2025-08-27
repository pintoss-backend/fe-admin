/**
 * Tests for jest.config.js
 *
 * Testing library/framework: Jest with ts-jest preset and jsdom environment
 * (discovered via repository configuration in jest.config.js).
 *
 * Purpose:
 * - Validate the Jest configuration object’s shape and critical values.
 * - Catch misconfigurations early (e.g., incorrect property names or missing mappings).
 * - Provide regression coverage for transform/testMatch/coverage settings.
 */

import path from 'path';

describe('jest.config.js', () => {
  const configPath = path.resolve(__dirname, '../../jest.config.js');
  const config = module.require(configPath);

  it('exports a non-null plain object', () => {
    expect(typeof config).toBe('object');
    expect(config).not.toBeNull();
  });

  it('uses ts-jest preset and jsdom environment', () => {
    expect(config.preset).toBe('ts-jest');
    expect(config.testEnvironment).toBe('jsdom');
  });

  it('configures transform for TypeScript via ts-jest', () => {
    expect(config.transform).toBeDefined();
    const tsKey = '^.+\\.(ts|tsx)$';
    expect(config.transform[tsKey]).toBe('ts-jest');
  });

  it('declares expected testMatch patterns under src', () => {
    expect(config.testMatch).toEqual([
      '<rootDir>/src/**/__tests__/**/*.(ts|tsx)',
      '<rootDir>/src/**/*.(test|spec).(ts|tsx)',
    ]);
  });

  it('collects coverage from ts/tsx with the right exclusions and outputs', () => {
    expect(config.collectCoverageFrom).toEqual([
      'src/**/*.{ts,tsx}',
      '!src/**/*.d.ts',
      '!src/main.tsx',
      '!src/vite-env.d.ts',
    ]);
    expect(config.coverageDirectory).toBe('coverage');
    expect(config.coverageReporters).toEqual(['text', 'lcov', 'html']);
  });

  it('uses the correct Jest key "moduleNameMapper" (not "moduleNameMapping")', () => {
    // This intentionally enforces the canonical key. If the repository uses "moduleNameMapping",
    // this test will fail, indicating a configuration bug to be fixed in jest.config.js.
    expect(config).toHaveProperty('moduleNameMapper');
    expect(config).not.toHaveProperty('moduleNameMapping');
  });

  describe('moduleNameMapper values', () => {
    // To still validate mapping values while the key is being fixed,
    // read from either key (prefer the correct key).
    const mapping = (config.moduleNameMapper ?? config.moduleNameMapping) || {};
    const expectedKeys = [
      '\\.(css|less|scss|sass)$',
      '\\.(gif|ttf|eot|svg|png|jpg|jpeg|ico|webp)$',
    ];

    it('maps style and common asset extensions to identity-obj-proxy', () => {
      expectedKeys.forEach((k) => {
        expect(mapping[k]).toBe('identity-obj-proxy');
      });
    });

    it('provides valid regex strings for mapping keys', () => {
      expectedKeys.forEach((k) => {
        // ast-grep-ignore
        expect(() => new RegExp(k)).not.toThrow();
      });
    });
  });
});