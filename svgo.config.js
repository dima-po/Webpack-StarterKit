module.exports = {
    multipass: true,
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            // customize options for plugins included in preset
            inlineStyles: {
              onlyMatchedOnce: false,
            },

            // or disable plugins
            removeDoctype: false,
          },
        },
      },
      {
        name: "removeAttributesBySelector",
        params: {
          selector: "svg",
          attributes: [
            "xml:space",
            "id"
          ]
        }
      },
      {
        name: "sortAttrs"
      },
      {
        name: "removeAttrs",
        params: {
          "attrs": [
            "data-*",
            "data.*"
          ]
        }
      },
      {
        name: "removeDimensions"
      },
      {
        name: "convertStyleToAttrs",
        params: {
          keepImportant: true
        }
      },
      'prefixIds',
    ]
};
