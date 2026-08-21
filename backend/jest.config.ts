import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }]
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@noble|@algorandfoundation|@x402)/)'
  ],
  moduleNameMapper: {
    '^@noble/hashes/(.*)$': '<rootDir>/node_modules/@noble/hashes/$1',
    '^@noble/hashes$': '<rootDir>/node_modules/@noble/hashes/index.js',
    '^@noble/curves(.*)$': '<rootDir>/tests/mocks/noble-curves.js',
    '^@noble/ed25519$': '<rootDir>/tests/mocks/noble-ed25519.js',
    '^@algorandfoundation/xhd-wallet-api(.*)$': '<rootDir>/tests/mocks/empty-mock.js',
    '^@x402/core/server$': '<rootDir>/node_modules/@x402/core/dist/cjs/server/index.js',
    '^@x402/core/client$': '<rootDir>/node_modules/@x402/core/dist/cjs/client/index.js',
    '^@x402/core/types$': '<rootDir>/node_modules/@x402/core/dist/cjs/types/index.js',
    '^@x402/core/facilitator$': '<rootDir>/node_modules/@x402/core/dist/cjs/facilitator/index.js',
    '^@x402/core$': '<rootDir>/node_modules/@x402/core/dist/cjs/index.js',
    '^@x402/avm/exact/server$': '<rootDir>/node_modules/@x402/avm/dist/cjs/exact/server/index.js',
    '^@x402/avm/exact/client$': '<rootDir>/node_modules/@x402/avm/dist/cjs/exact/client/index.js',
    '^@x402/avm/exact/facilitator$': '<rootDir>/node_modules/@x402/avm/dist/cjs/exact/facilitator/index.js',
    '^@x402/avm$': '<rootDir>/node_modules/@x402/avm/dist/cjs/index.js',
    '^@x402/express$': '<rootDir>/node_modules/@x402/express/dist/cjs/index.js',
    '^@x402/fetch$': '<rootDir>/node_modules/@x402/fetch/dist/cjs/index.js',
    '^@x402/extensions/bazaar$': '<rootDir>/node_modules/@x402/extensions/dist/cjs/bazaar/index.js',
    '^@x402/extensions$': '<rootDir>/node_modules/@x402/extensions/dist/cjs/index.js'
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'],
  verbose: true,
  clearMocks: true,
  restoreMocks: true
};

export default config;
