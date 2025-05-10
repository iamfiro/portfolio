module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    "plugin:import/recommended",
    // 대안으로, 'recommended'는 아래의 두 개의 설정과 조합할 수 있습니다.
    "plugin:import/errors",
    "plugin:import/warnings",
  ],
  settings: {
    "import/resolver": {
      typescript: {
        project: './tsconfig.json',
      },
    }
  },
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'import'],
  rules: {
    "no-restricted-imports": [
      'error',
      {
        "patterns": ['../*']
      }
    ],
    "import/order": [
      "error",
      {
        "groups": [
          ["builtin", "external"],
          "internal",
          ["parent", "sibling"],
          "index"
        ],
        "newlines-between": "always",
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal",
            "position": "after"
          }
        ]
      }
    ],
    'react-refresh/only-export-components': [
      'warn',
      {allowConstantExport: true},
    ],
  },
}
