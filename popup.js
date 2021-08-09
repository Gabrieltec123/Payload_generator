

window.browser = (function () {
  return window.msBrowser || window.browser || window.chrome;
})();


function dump_headers(objectName) {
  window.browser.storage.local.get('http_header_analyzer', function(store) {

    window.browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab_id = tabs[0].id;

      var node = window.document.getElementById(objectName);

      if ('undefined' == typeof(store) || 'undefined' == typeof(store.http_header_analyzer))
        return;

      tab_infos = store.http_header_analyzer[tab_id];
      if ('undefined' == typeof(tab_infos))
        return;

      var initial_string = '';
      var header_array = [];
      if ('requestInfo' == objectName) {
        // extract the url path
        var url_path = tab_infos.requestInfo.url.replace(/^http(s)?:\/\/[^\/]+\/?(.*)/, '/$2');

        // steal the used protocol from the response status line
        var protocol = tab_infos.responseInfo.statusLine.replace(/^(HTTP\/1\..) .*/, '$1');

        initial_string = '<li>' + tab_infos.requestInfo.method + ' ' + url_path + ' ' + protocol + '</li>';
        header_array = tab_infos.requestInfo.requestHeaders;
      } else { // show the status line for response
        initial_string = '<li>' + tab_infos.responseInfo.statusLine + '</li>';
        header_array = tab_infos.responseInfo.responseHeaders;
      }

      node.innerHTML = initial_string + header_array.map(function(header) {
        return '<li><b>' + header['name'] + '</b>: ' + header['value'] + '</li>';
      }).join('');
    });
  });
}


function init() {
  dump_headers('requestInfo');
  dump_headers('responseInfo');
}
document.addEventListener('DOMContentLoaded', init);

