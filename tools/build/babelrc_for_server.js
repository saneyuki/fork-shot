/*eslint quote-props: [2, "always"] */

'use strict';

// This object is encoded to `.babelrc` with using `JSON.stringify()`.
module.exports = {
    'presets': [
    ],

    'plugins': [
        // For Node.js v6~, we need not some transforms.
        'transform-es2015-modules-commonjs',

        // es2016 level
        'babel-plugin-transform-exponentiation-operator',
        // es2017 level
        'babel-plugin-syntax-trailing-function-commas',
        'babel-plugin-transform-async-to-generator',

        // for React
        'syntax-jsx',
        'transform-react-jsx',

        // for flowtype
        'plugin-syntax-flow',
        'plugin-transform-flow-strip-types',
    ],

    'env': {
        'development': {
            'plugins': [
                'transform-react-constant-elements',
                'transform-react-inline-elements',
            ],
        },

        'production': {
            'plugins': [
                'transform-react-jsx-source',
            ],
        },
    },

    'parserOpts': {},
    'generatorOpts': {}
};