// chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     if (changeInfo.status === 'complete') {
//       chrome.tabs.sendMessage(tabId, {
//         message: 'TabUpdated'
//       });
//     }
//   }
// })



// chrome.tabs.onActivated.addListener(function (tab) {
//   chrome.tabs.sendMessage(tab.tabId, {
//     message: 'TabActivated'
//   });
// });

// chrome.tabs.onUpdated.addListener(function (tab) {
//     chrome.tabs.sendMessage(tab.tabId, {
//     message: 'TabActivated'
//   });
// });

var curTabId = 0;
var curTabUrl = "";

chrome.tabs.onActivated.addListener(function () {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs)
    {
      if (tabs[0].url && tabs[0].url.includes("youtube.com/watch")) {
        
        if (curTabId != tabs[0].id) //If last processed tab is empty
        {
          SetTabToWorkOn(tabs[0].id,tabs[0].url);
        }
      }
    });
});


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) { // Run if there is an update in any tab.
console.log(chrome.tabs.query({active: true}));

  if (changeInfo.status === 'complete') {
    if (tab.url && tab.url.includes("youtube.com/watch")) {
      chrome.tabs.query({active: true, lastFocusedWindow: true}, function (tabs) //Get Active tab.
      {
        
        if (tabId == tabs[0].id) //If equals active tab and updated tab
        {
          if (curTabId == 0 || curTabId != tabId) //If last processed tab is empty
          {
            // console.log("url: " + tab.url);
            SetTabToWorkOn(tabId,tab.url);
          }
        }
  
      });
    }
  }
});



function SetTabToWorkOn(tabId,url)
{


  // console.clear();
  // console.log(`
  // BeforeCurTabId: '${curTabId}'\n
  // BeforeCurTabUrl: '${curTabUrl}'\n
  // `);

  if (curTabId != 0)
  {
    chrome.tabs.sendMessage(curTabId, {
      message: 'StopProcess'
    });

    // console.log("StopProcess gönderildi!");
  }
  

  curTabId = tabId;
  curTabUrl = url;
  

  // console.log(`
  // CurTabId: '${curTabId}'\n
  // CurTabUrl: '${curTabUrl}'\n
  // `);


  chrome.tabs.sendMessage(curTabId, {
    message: 'StartProcess'
  });

  // console.log("StartProcess gönderildi!");

}