var tPid;
var tUser;
function saveOptions(url){
	localStorage['jiraBaseUrl']=url
	alert("Settings was saved")
}

function getJiraBaseUrl() {
	return localStorage.jiraBaseUrl
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {debugger
	if(request.cmd == "getData") {
		sendResponse({jiraBaseUrl: localStorage['jiraBaseUrl']})
	}

	if(request.cmd == "getPidAndUserFromKey") {
		$.ajax(
				{
					url: request.options.jiraBaseUrl+'/browse/'+request.jiraKey, 
					async: false, 
					success: function(data) {
						
						var params = ($(data).find('a[href^="/secure/CreateIssue.jspa?pid="]:first').attr("href").split("?"))[1]
						tPid = ((params.split("&"))[0].split("="))[1]

						// meta in jira 4.4
						var meta44 = $(data).find('#logged-in-username:first')
						if (meta44.length >0) {
							tUser = meta44.attr("content")
						} else {
							// meta in jira 5
							var meta5 = $(data).find('#header-details-user-fullname')
							if (meta5) {
								tUser = meta5.attr("data-username")
							}
						}
					}
				}
			)
		sendResponse( {pid: tPid, user: tUser} )
	}
})