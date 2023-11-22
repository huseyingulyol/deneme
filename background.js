chrome.runtime.onInstalled.addListener(function() {
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {
          message: 'TabUpdated'
        });
      }
    }
  })
});