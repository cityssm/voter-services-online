import configWebApp, { defineConfig } from 'eslint-config-cityssm';
export const config = defineConfig(configWebApp, {
    files: ['**/*.ts'],
    languageOptions: {
        parserOptions: {
            projectService: true
        }
    },
    rules: {
        '@typescript-eslint/no-unsafe-type-assertion': 'off'
    }
});
export default config;
