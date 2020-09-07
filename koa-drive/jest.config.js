module.exports = {
    // preset: 'te-jest',
    testEnvironment: 'node',
    // 输出测试覆盖率
    collectCoverage: true,
    // 测试覆盖率输出目录
    coverageDirectory: 'coverage',
    // 设置需要测试的文件 或不需要测试的文件
    collectCoverageFrom: [
        // 'src/*.{js,ts}',
        './sum.ts',
        '!**/node_modules/**'
    ],
    // 定制测试覆盖率报告
    coverageReporters: [
        'clover',
        'text',
        'html'
    ],
    // 测试覆盖率的最低阈值
    coverageThreshold: {
        // global: {
        //     branches: 80,
        //     functions: 80,
        //     lines: 80,
        //     statements: 80
        // },
        // './src': {
        //     branches: 40,
        //     statements: 40
        // }
    },
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    // 测试根目录
    modulePaths: [
        '<rootDir>'
    ],
    // 识别测试文件 与testMatch互斥 不能同时写
    testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.(js?|ts?)$',
    // 测试的文件类型
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};
