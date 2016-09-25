/*jshint esversion: 6*/

// match pattern:
var target_pattern = "*://*.local/*";

function host_without_port(full_host) {
    // (?:   )  non capturing group
    // +        with 1 or more repeates
    //          searches for
    // :\d+     : followed by 1 or more digits
    return full_host.replace(
        /(?:\:\d+)+/,
        ""
    );
}

function handleHeadersReceived(details, target_original) {
    console.group("handleRequest");
    console.log("details", details);
    console.log("target_original", target_original);
    console.log("responseHeaders:");
    for (var header of details.responseHeaders) {
        console.log("header", header);
    }
    console.groupEnd();
    return {responseHeaders: details.responseHeaders};
}

function add_onHeadersReceived_handler(tabId, target_new, target_original) {
    var host = host_without_port(target_new);
    var target_pattern_new = "*://" + host + "/*";
    console.log("target_pattern_new", target_pattern_new);
    var handler_id = chrome.webRequest.onHeadersReceived.addListener(
        function(details) {
            handleHeadersReceived(details, target_original);
        },
        {
            urls: [target_pattern_new],
            tabId: tabId
        },
        ["blocking", "responseHeaders"]
    );
    console.log("handler onHeadersReceived set:", handler_id);
}


function handleRequest(details) {
    console.group("handleRequest");
    console.log("details", details);

    // for (var header of details.requestHeaders) {
    //     if (header.name == "User-Agent") {
    //         header.value = ua;
    //     }
    // }

    // console.log("requestHeaders:");
    for (var header of details.requestHeaders) {
        // console.log("header", header);
        if (header.name == "Host") {
            console.log("Host:", header.value);
            // header.value = ua;
            if (header.value == "ks.local:9090") {
                var target_original = header.value;
                var target_new = "192.168.10.10:9090";
                header.value = target_new;
                add_onHeadersReceived_handler(
                    details.tabId,
                    target_new,
                    target_original
                );
            }
        }
    }

    console.log("show icon.");
    chrome.pageAction.show(details.tabId);

    console.groupEnd();
    return {requestHeaders: details.requestHeaders};
}


function printRequest(details) {
    console.group("printRequest");
    console.log("details", details);
    // console.log("requestHeaders:");
    // for (var header of details.requestHeaders) {
    //     console.log("header", header);
    // }
    console.groupEnd();
    return {requestHeaders: details.requestHeaders};
}

// ##########################################
// Add rewriteUserAgentHeader as a listener to onBeforeSendHeaders,
// only for the target page.
// Make it "blocking" so we can modify the headers.
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/webNavigation/onBeforeNavigate
var handler_id = chrome.webRequest.onBeforeSendHeaders.addListener(
    handleRequest,
    {urls: [target_pattern]},
    ["blocking", "requestHeaders"]
);
console.log("request handler registerd.", handler_id);

var handler_id = chrome.webRequest.onCompleted.addListener(
    printRequest,
    {urls: ["*://*/*"]},
    ["responseHeaders"]
);
console.log("request handler registerd.", handler_id);
