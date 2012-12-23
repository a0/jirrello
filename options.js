function init(){
	var bg = chrome.extension.getBackgroundPage();
	$("#jiraBaseUrl").val(bg.getJiraBaseUrl())
	$('#jiraBaseUrl').live("keypress", function(e) {if (e.keyCode == 13) {save()}})
	$('#note').click(function(e){$("#jiraBaseUrl").val("https://jira.atlassian.com")})
}
function save(){
	var bg = chrome.extension.getBackgroundPage();
	bg.saveOptions($("#jiraBaseUrl").val())
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#saveButton').addEventListener('click', save);
  init();
});