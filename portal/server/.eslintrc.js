module.exports = {
    'env': {
        'es6': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'sourceType': 'module'
    },
    'rules': {

        'no-console': 0,
        'no-unused-vars': 2,
        "no-use-before-define": 2,
        "quotes": [ "off", "single" ],
        'semi': ['error', 'always'],
         "no-var": 0,
        "eqeqeq": 2
    }
};
// error warn off