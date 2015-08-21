var tPid = "AJAX FAILED";
var tUser = "AJAX FAILED";
var tIssueType= "AJAX FAILED";

var settings = {
    set:function (key, value) {
            localStorage[key] = value;
        },
    get:function (key) {
            return localStorage[key];
        }
};

function getProductData(url, key) {
	return $.when(
		jQuery.ajax({
				url: url + '/rest/api/2/issue/createmeta?projectKeys=' + key,
				async: true,
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Content-Type", "application/json" );
				},
				success: function(data) {
					tPid = data.projects[0].id;
					//If you are using all custom issue types we need a valid one at least
					tIssueType = data.projects[0].issuetypes[0].id;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//called when there is an error
					alert("Project Data retrieval error:" +  textStatus + ":" + errorThrown + ":" + jqXHR);
				}
			}),
		jQuery.ajax({
				url: url + '/rest/gadget/1.0/currentUser',
				async: true,
				beforeSend: function (xhr) {
					xhr.setRequestHeader ("Content-Type", "application/json" );
				},
				success: function(data) {
					tUser = data.username;;
				},
				error: function(jqXHR, textStatus, errorThrown) {
					//called when there is an error
					alert("get currentUser data error:" + textStatus + ":" + errorThrown + ":" + jqXHR);
				}
		})
	);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.cmd == "getData") {
		sendResponse({jiraBaseUrl: settings.get('jiraBaseUrl'), jiraUsername: settings.get('jiraUsername'), jiraPassword: settings.get('jiraPassword')})
	}
	
	if(request.cmd == "getPidAndUserFromKey") {
		var username = request.options.jiraUsername;
		var password = request.options.jiraPassword;
		var url = request.options.jiraBaseUrl;
		var key = request.jiraKey;
		
		getProductData(url, key).done(function( project, user) {
			//We could update the fields here
			//console.log("returned from done: pid:" + project[0].projects[0].id +", firstIssue:" + project[0].projects[0].issuetypes[0].id + " user: "+user[0].username);
			//console.log("local stored: pid:" + tPid + "firstIssue:" + tIssueType + ", user: " + tUser);
			sendResponse( {pid: tPid, user: tUser, issueType: tIssueType} );
		});
		//stop callback from being called too early on return
		return true;
	}
});