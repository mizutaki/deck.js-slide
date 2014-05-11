var player;
$(function(){

	$('#q').focus();
	$('#search').submit(function() {
		//キーワードから検索
		var url = "https://gdata.youtube.com/feeds/api/videos";

			var options = {
				"q": $('#q').val(),//jQueryがうまい事日本語にエンコーディングしているのでここではエンコーディングする必要ない
				"alt": "json",
				"max-results":10,//最大取得件数
				"v":2//apiバージョン
		};

		//検索した結果を#listに追加
		$.get(url, options, function (res) {
			console.log(res);
			$('#list').empty();//リスト要素の初期化
			for (var i=0; i < res.feed.entry.length; i++) {
				var currentFeed = res.feed.entry[i];//現在のfeed要素取得
				$('#list').append(
					$('<li class="movie">').append(
						$('<img>').attr('src', currentFeed['media$group']['media$thumbnail'][0]['url'])
					).data('video-id', currentFeed['media$group']['yt$videoid']['$t']));
			}
		}, "json");
	});

	$(document).on('click', 'li.movie', function() {
		//player.loadVideoById($(this).data('video-id'));
		$(this).toggleClass('on');//指定されたクラスが設定されていれば削除し、設定されていなければ追加する
	})

	function play() {

		var videoId = $('li.movie.on:eq('+ curerentIndex +')').data('video-id');

		//それを再生
		player.loadVideoById(videoId);

		$('li.movie').removeClass('playing');
		$('li.movie.on:eq('+ curerentIndex+')').addClass('playing');
	}

	var curerentIndex = 0;
	$('#play').click(function() {
		play();
	});

	$('#pause').click(function() {
		player.pauseVideo();
	});

	$('#next').click(function() {
		if (curerentIndex == $('li.movie.on').length -1) {
			curerentIndex = 0;
		} else {
			curerentIndex += 1;	
		}
		play();
	});

	$('#prev').click(function() {
		if (curerentIndex == 0) {
			return;
		} else {
			curerentIndex -= 1;
			play();	
		}
	});
});

function onYouTubePlayerAPIReady() {
	player = new YT.Player('player', {
		height:360,
		width:640,
		events:{
			onStateChange: onPlayerStateChange
		}
	 });
}

function onPlayerStateChange(e) {
	if (e.data == YT.PlayerState.ENDED) {
		$('#next').trigger('click');
	}
}