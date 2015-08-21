var options
var jiraKey = 'N-O-K-E-Y'
var jiraPid;
var jiraUser;
var jiraIssueType;

chrome.runtime.sendMessage({cmd: "getData"}, function(response) {
	//console.log(response);
    options = response;
})

$(window).load(function(){
	(function periodical(){
		procBoardTitle()
		$('.list-card-details').each(procListCard)
		setTimeout(periodical,1000)
	})()
	$(".window-wrapper").on('DOMNodeInserted', changeWindow)
	
})

function procBoardTitle(e){
	
	var div=$('.board-header');
	//var div=$('#div#board-header')
	var target=div.find('a.board-header-btn-name').find('span.board-header-btn-text').text()
	//var target=div.find('a.js-open-board-menu-title').text()
	var regex=/\((jira:.*?)\)/m
	var partTitle=target.match(regex)

	if (div.find('span.jira-project').length == 0) {
		jiraKey = "N-O-K-E-Y";
	}

	if (partTitle && options) {
		jiraKey = (partTitle[1].split(":"))[1]
		div.find('a.board-header-btn-name').html(div.find('span.board-header-btn-text').html().replace(regex,''));
		var oldText = div.find('span.jira-project').text()
		if (oldText) {
			div.find('span.jira-project').html(jiraKey)
		} else {
			div.append('<span class="jira-project button">' + jiraKey + '</span>')
			$('.jira-project').click(function(){
				window.open(options.jiraBaseUrl+'/browse/'+jiraKey)
			})
		}
	}
}

function procListCard(e){
	if (jiraKey == 'N-O-K-E-Y') {
		return;
	}
	var title = $(this).find('a.list-card-title').text();
	var regex = new RegExp("\\((" + jiraKey + ".*?)\\)","m");
	var partTitle = title.match(regex);
	if (partTitle) {
		var oldText = $(this).find('span.jira-issue').text();
		var jiraIssue = partTitle[1];
		if (oldText) {
			if (jiraIssue=oldText) {
				$(this).find('span.jira-issue').html(jiraIssue);
			}
		} else {
			$(this).find('a.list-card-title').
				html(
					$(this).find('a.list-card-title').html().
					replace(regex,'<span class="jira-issue">' + jiraIssue + '</span>')
				);
		}
	}
}

function changeWindow(event) {
	if (jiraKey == 'N-O-K-E-Y') {
		return
	}
	
	var target=event.target.innerHTML;
	var regex=/Actions/m
	if (target.match(regex)) {
		//Display current link
		var jiraBaseUrl=options.jiraBaseUrl;
		var jiraLinkUrl = jiraBaseUrl + "/browse/";
		var jiraCreateUrl = jiraBaseUrl + "/secure/CreateIssueDetails!init.jspa";

		var title=$(".window-title-text").text();
		var regexTitle = new RegExp("\\((" + jiraKey + ".*?)\\)","m")
		var partTitle=title.match(regexTitle)
		if (partTitle) {
			var issue=partTitle[1];
			$('<div class="window-module"><a class="button-link jira-link">jira:' + issue + '</a></div>').prependTo($('.window-sidebar'));
			$('.jira-link').click(function(){window.open(jiraLinkUrl+issue)});

		} else {
			//Create new link
			chrome.runtime.sendMessage({cmd: "getPidAndUserFromKey", options: options, jiraKey: jiraKey}, 
				function(response) {
					//console.log(response);
					jiraPid = response.pid;
					jiraUser = response.user;
					jiraIssueType = response.issueType;
					//console.log("jiraPid:" + jiraPid + " jiraUser:" + jiraUser + " jiraIssueType:" + jiraIssueType);
					$('<div class="window-module jira-create"><a class="button-link">Create jira issue</a></div>').prependTo($('.window-sidebar'));
					$('.jira-create').click(function(){
						//Should be changed to rest call but may not be editable if done that way
						window.open(jiraCreateUrl + "?"
							+ "pid=" + jiraPid + "&"
							+ "issuetype=" + jiraIssueType + "&"
							+ "reporter=" + jiraUser + "&"
							+ "summary=" + encodeURIComponent(title) + "&"
							+ "description=" + encodeURIComponent($(location).attr('href') + " " + $(".js-card-desc").text())
						);
					});
			});
		}
	}
}		
