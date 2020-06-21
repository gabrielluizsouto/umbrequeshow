function getShuffledPlaylist(){
    var response;

    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/api/breques/random', false);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            response = xhr.responseText;
        } 
        else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
            console.log('failed to get shuffled playlist')
        } 
    };
    xhr.send();

    return response;
}

function getPlaylistInBrowser(){
    const key = 'shuffledPlaylist';
    var data = sessionStorage.getItem(key);

    if(!data){
        data = getShuffledPlaylist();
        data = JSON.parse(data);
		data = data.shuffledItems;
		
        saveInSessionStorage(key, data);
    }

    return data;
}

function saveInSessionStorage(key, value){    
    window.sessionStorage.setItem(key, value);
}

function getVideoRequest(videoId){
    var response;

    var xhr = new window.XMLHttpRequest();
    xhr.open('GET', '/api/breques/id/'+videoId, false);
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
            response = xhr.responseText;
        } 
        else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
            console.log('failed to get shuffled playlist')
        } 
    };
    xhr.send();

    return response;    
}


function loadVideo(videoId){
	if(!videoId){
		window.sessionStorage.removeItem('shuffledPlaylist');
		saveInSessionStorage('playlistPointer', 0);
		window.location.reload();
		return;
	}
	
	var videoData = getVideoRequest(videoId);
	videoData = JSON.parse(videoData).breque[0];
	

    //inserting video in page
    let video = window.document.createElement('iframe');
    video.width = "560";
    video.height = "315";
    video.src = 'https://www.youtube.com/embed/' + videoData.youtubeUrl + '?autoplay=1&fs=0';
    video.frameBorder = "0";
	video.allow = "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture";
	
	if(videoData.startTime){
		let time = videoData.startTime;
		time = time.split(':').reduce((acc,time) => (60 * acc) + +time);
		video.src+="&start="+time;
	}
	if(videoData.endTime){
		let time = videoData.endTime;
		time = time.split(':').reduce((acc,time) => (60 * acc) + +time);
		video.src+="&end="+time;
	}

    var div = document.querySelector('.iframe-container');
	div.appendChild(video);
	
	window.videoData = videoData;
}

function updatePlaylist(playlist) {
	var key = 'shuffledPlaylist';
	saveInSessionStorage(key, playlist);
}

function getPlaylistPointer(){
	const key = 'playlistPointer';
	var data = sessionStorage.getItem(key);

	if (!data) data = 0;

	return data;
}

function updatePlaylistPointer(action){
	const key = 'playlistPointer';
	var pointerValue = Number(getPlaylistPointer());
	var playlist = JSON.parse('['+getPlaylistInBrowser()+']');

	if (action == "previous"){
		if(0 < pointerValue){
			pointerValue = pointerValue - 1;
		} else {
			window.sessionStorage.removeItem('shuffledPlaylist');
		}

	} else {
		if(playlist.length > pointerValue){
			pointerValue = pointerValue + 1;
		} else {
			pointerValue = 0;
			//reset playlist
			window.sessionStorage.removeItem('shuffledPlaylist');
		}
	}
	
	saveInSessionStorage(key, pointerValue);
	location.reload();
}

function sendVideo() {
	var instance = M.Modal.init(document.querySelector('#modal-send-video'));  
	instance.options.onCloseEnd = function(){

        //window.location.reload();
    };
    instance.open();

}

function createNewBreque(){
	var response;
	
	let breque = {
		"youtubeUrl": "",
		"title": "",
		"categories": [],
		"startTime": "",
		"endTime": ""
	}

	breque.title = document.querySelector("#video-title").value;
	breque.youtubeUrl = document.querySelector("#youtubeUrl").value;
	breque.categories = document.querySelector("#categories").value.split(',');
	breque.startTime = document.querySelector("#startTime").value;
	breque.endTime = document.querySelector("#startTime").value;


    var xhr = new window.XMLHttpRequest();
	xhr.open('POST', '/api/breques/', false);
	xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
			response = xhr.responseText;
			
			var instance = M.Modal.init(document.querySelector('#modal-send-video'));
			instance.destroy;
			alert("Obrigado por enviar sua contribuição");

        } 
        else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
            console.log('failed to create breque')
        } 
    };
	xhr.send(JSON.stringify(breque));
	console.log(breque);

	return response;
}
