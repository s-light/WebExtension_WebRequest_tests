


// example filters
// hostSuffix
//  string. Matches if the hostname of the URL ends with a specified string.
// urlMatches
//  string. Matches if the URL (without fragment identifier) matches a
//  specified regular expression.
//  Port numbers are stripped from the URL if they match the default port number.

var filter = {
    url: [
      {hostSuffix: "local"}
    ]
};

// function showPageActionInCurrentTab() {
//     chrome.tabs.query(
//         {active: true, currentWindow: true},
//         function(tabs) {
//             console.log("ping");
//             chrome.pageAction.show(tabs[0].id);
//         }
//     );
// }


function showUserInfo(details) {
    chrome.pageAction.show(details.tabId);
}

// add handler for
// chrome.webNavigation.onBeforeNavigate.addListener(showUserInfo, filter);
// console.log("onBeforeNavigate handler registerd.");
chrome.webNavigation.onCompleted.addListener(showUserInfo, filter);
console.log("onCompleted handler registerd.");
