
window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();

function http_header_analyzer_store_result(name, tab_id, data) {
  window.browser.storage.local.get('http_header_analyzer', function(store) {
    if ('undefined' == typeof(store) || 'undefined' == typeof(store.http_header_analyzer))
      store = {};
    else
      store = store.http_header_analyzer;

    if ('undefined' == typeof(store[tab_id]))
      store[tab_id] = {};

    store[tab_id][name] = data;
    window.browser.storage.local.set({'http_header_analyzer': store}, function(){});
  });
}

window.browser.webRequest.onHeadersReceived.addListener(
  function(info) {
    http_header_analyzer_store_result('responseInfo', info.tabId, info);
  },
  {
    urls: [
      'http://*/*',
      'https://*/*'
    ],
    types: ['main_frame']
  },
  ['responseHeaders']
);

window.browser.webRequest.onSendHeaders.addListener(
  function(info) {
    http_header_analyzer_store_result('requestInfo', info.tabId, info);
  },
  {
    urls: [
      'http://*/*',
      'https://*/*'
    ],
    types: ['main_frame']
  },
  ['requestHeaders']
);

window.browser.tabs.onRemoved.addListener(function(tab_id, removed) {
  window.browser.storage.local.get('http_header_analyzer', function(store) {
    delete store.http_header_analyzer[tab_id];
  });
});

window.browser.windows.onRemoved.addListener(function(windowid) {
  window.browser.storage.local.remove('http_header_analyzer');
});
