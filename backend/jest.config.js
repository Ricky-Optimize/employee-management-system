module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/?(*.)+(spec|test).js'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'routes/**/*.js',
        '!**/node_modules/**',
        '!**/coverage/**'
    ],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.js']
};