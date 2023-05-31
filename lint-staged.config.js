module.exports = {
  'package/**/*.{js,jsx,ts,tsx}': ['npm run lint', () => 'npm run lint:types'],

  'pack/**/*.{js}': ['npm run lint --workspace=@astral/pack'],

  'PRTitleLinter/**/*.{js}': ['npm run lint --workspace=@astral/PRTitleLinter'],
};
