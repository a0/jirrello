


$(function(){
	//want: trello events
	(function periodical(){
		//console.log('---------------------------------');
		procBoardTitle();
		$('.list-card').each(procListCard);
		setTimeout(periodical,1000)
	})()
});


//.board-title
function procBoardTitle(e){
	var d=$('div.board-title');

	var t=d.find('a.js-board-title').text();
	var r=/\((.*?)\)/m;
	var p=t.match(r);

	if (p) {
		//console.log(p[1]);
		var oldText = d.find('h4.jira-project').text();
		if (oldText) {
			if (p[1]!=oldText) {
				var v = d.find('a.js-board-title').html();
				d.find('a.js-board-title').html(v.replace(r,''));
				d.find('h4.jira-project').html(p[1]);
			}
		} else {
			var v = d.find('a.js-board-title').html();
			d.find('a.js-board-title').html(v.replace(r,''));
			d.append('<h4 class="jira-project">' + p[1] + '</h4>');
		}
	}
}

function procListCard(e){
	var t=$(this).find('h3.list-card-title').find('a').text();
	var r=/\((.*?)\)/m;
	var p=t.match(r);

	if (p) {
		//console.log(p[1]);
		var oldText = $(this).find('h4.jira-issue').text();
		if (oldText) {
			if (p[1]!=oldText) {
				$(this).find('h4.jira-issue').html(p[1]);
			}
		} else {
			var v = $(this).find('h3.list-card-title').find('a').html();
			$(this).find('h3.list-card-title').find('a').html(v.replace(r,''));
			$('<h4 class="jira-issue">' + p[1] + '</h4>').prependTo($(this).find('.badges'));
		}
	};
}


