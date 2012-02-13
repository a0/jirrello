var options
var jiraKey = 'N-O-K-E-Y'
chrome.extension.sendRequest({cmd: "getData"}, function(response) {
    options = response
})

$(function(){
	(function periodical(){
		procBoardTitle()
		$('.list-card').each(procListCard)
		setTimeout(periodical,1000)
	})()
	$(".window").live('DOMNodeInserted',changeWindow)
})

function procBoardTitle(e){
	var div=$('div.board-title')
	var target=div.find('a.js-open-board-menu-title').text()
	var regex=/\((jira:.*?)\)/m
	var partTitle=target.match(regex)

	if (div.find('span.jira-project').length == 0) 
		jiraKey = "N-O-K-E-Y"

	if (partTitle && options) {
		jiraKey = (partTitle[1].split(":"))[1]
		div.find('a.js-open-board-menu-title').html(div.find('a.js-open-board-menu-title').html().replace(regex,''))
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
	if (jiraKey == 'N-O-K-E-Y') 
		return
	var title = $(this).find('a.list-card-title').text()
	var regex = new RegExp("\\((" + jiraKey + ".*?)\\)","m")
	var partTitle = title.match(regex)
	if (partTitle) {
		var oldText = $(this).find('span.jira-issue').text()
		var jiraIssue = partTitle[1]
		if (oldText) {
			if (jiraIssue=oldText) 
				$(this).find('span.jira-issue').html(jiraIssue)
		} else {
			$(this).find('a.list-card-title').
				html(
					$(this).find('a.list-card-title').html().
					replace(regex,'<span class="jira-issue">' + jiraIssue + '</span>')
				)
		}
	}
}

function changeWindow(event) {
	if (jiraKey == 'N-O-K-E-Y') 
		return
	var jiraBaseUrl=options.jiraBaseUrl
	var jiraIssueType = "3"
	var jiraLinkUrl = jiraBaseUrl + "/browse/"
	var jiraCreateUrl = jiraBaseUrl + "/secure/CreateIssueDetails!init.jspa"

	var target=event.target.innerHTML
	var regex=/card-label-list/m
	if (target.match(regex)) {
		var title=$(".window-title-text").text()
		var regexTitle = new RegExp("\\((" + jiraKey + ".*?)\\)","m")
		var partTitle=title.match(regexTitle)
		if (partTitle) {
			var issue=partTitle[1]
			$('<div class="window-module"><a class="button-link jira-link">jira:' + issue + '</a></div>').prependTo($('.window-sidebar'))
			$('.jira-link').click(function(){window.open(jiraLinkUrl+issue)})
		} else {
			var jiraPid
			var jiraUser
			chrome.extension.sendRequest({cmd: "getPidAndUserFromKey", options: options, jiraKey: jiraKey}, function(response) {
				jiraPid = response.pid
				jiraUser = response.user
				$('.jira-create').show()
			})
			$('<div class="window-module jira-create hide"><a class="button-link">Create jira issue</a></div>').prependTo($('.window-sidebar'))
			$('.jira-create').click(function(){
				window.open(jiraCreateUrl + "?"
					+ "pid=" + jiraPid + "&"
					+ "issuetype=" + jiraIssueType + "&"
					+ "reporter=" + jiraUser + "&"
					+ "summary=" + encodeURI(title) + "&"
					+ "description=" + encodeURI($(location).attr('href'))
				)
			})
		}
	}
}		

