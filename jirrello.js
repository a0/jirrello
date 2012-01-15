$(function(){
	(function periodical(){
		//console.log('---------------------------------');
		procBoardTitle();
		$('.list-card').each(procListCard);
		setTimeout(periodical,1000)
	})()
});

function procBoardTitle(e){
	var d=$('div.board-title');

	var t=d.find('a.js-board-title').text();
	var r=/\((.*?)\)/m;
	var p=t.match(r);

	if (p) {
		//console.log(p[1]);
		var oldText = d.find('span.jira-project').text();
		if (oldText) {
			if (p[1]!=oldText) {
				var v = d.find('a.js-board-title').html();
				d.find('a.js-board-title').html(v.replace(r,''));
				d.find('span.jira-project').html(p[1]);
			}
		} else {
			var v = d.find('a.js-board-title').html();
			d.find('a.js-board-title').html(v.replace(r,''));
			d.append('<span class="jira-project">' + p[1] + '</span>');
		}
	}
}

function procListCard(e){
	var t=$(this).find('h3.list-card-title').find('a').text();
	var r=/\((.*?)\)/m;
	var p=t.match(r);

	if (p) {
		//console.log(p[1]);
		var oldText = $(this).find('span.jira-issue').text();
		if (oldText) {
			if (p[1]!=oldText) {
				$(this).find('span.jira-issue').html(p[1]);
			}
		} else {
			var v = $(this).find('h3.list-card-title').find('a').html();
			$(this).find('h3.list-card-title').find('a').html(v.replace(r,''));
			$('<span class="jira-issue">' + p[1] + '</span>').prependTo($(this).find('.badges'));
		}
	};
}


