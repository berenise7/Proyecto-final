self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "static/chunks/react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [],
  "rootMainFilesTree": {},
  "pages": {
    "/_app": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_app.js"
    ],
    "/_error": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/_error.js"
    ],
    "/myaccount/my-orders/[_id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/myaccount/my-orders/[_id].js"
    ],
    "/reading-journal/[title]/[_id]": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/reading-journal/[title]/[_id].js"
    ],
    "/user/login": [
      "static/chunks/webpack.js",
      "static/chunks/main.js",
      "static/chunks/pages/user/login.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];