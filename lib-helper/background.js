function onInstall() {
	chrome.tabs.create({
		url : "options.html"
	});
}

function onUpdate() {
	
}
	
function getVersion() {
	var details = chrome.app.getDetails();
	return details.version;
}

var currVersion = getVersion();
var prevVersion = localStorage['version']
if(currVersion != prevVersion) {
	if( typeof prevVersion == 'undefined') {
		onInstall();
	} else {
		onUpdate();
	}
	localStorage['version'] = currVersion;
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
		sendResponse({
			data : localStorage.getItem('data')
		});
});
