// eslint-disable-next-line no-undef
module.exports = {
    "extends": ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    "parser": '@typescript-eslint/parser',
    "plugins": ['@typescript-eslint'],
    "ignorePatterns": ["front/dist/**/*js", "front/webpack/*.js", "/public/**", "/dist/**"],
    "root": true,
};