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
		saveInSessionStorage('playlistCategory', 'geral');
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

function cleanPlaylist() {
	window.sessionStorage.removeItem('shuffledPlaylist');
	saveInSessionStorage('playlistPointer', 0);
}

function loadVideo(videoId){
	if(!videoId){
		cleanPlaylist();
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
			let category = window.sessionStorage.playlistCategory || 'geral';
			createNewPlaylist(category);
		}

	} else {
		if(playlist.length > pointerValue){
			pointerValue = pointerValue + 1;
		} else {
			pointerValue = 0;
			let category = window.sessionStorage.playlistCategory || 'geral';
			createNewPlaylist(category);
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

	//spaces sanitizing
	breque.categories = breque.categories.map(item => {
		return item.trim();
	})


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

	return response;
}

function getCategoriesList() {

	var xhr = new window.XMLHttpRequest();
	xhr.open('GET', '/api/breques/categories/', false);
	xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
			response = xhr.responseText;
        } 
        else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
            console.log('failed to get categories');
        } 
    };
	xhr.send();

	return response;
}

function createCategoriesList(categoriesList) {
		var categoriesDiv = document.querySelector('.categories-list');
		categoriesList = JSON.parse(categoriesList)["categories"];
		categoriesList = shuffle(categoriesList).splice(0, 30);

		categoriesList.forEach(elem => {
			var name = elem.trim();
			let aDiv = window.document.createElement('a');
			aDiv.textContent =  '#'+name;
			aDiv.setAttribute('onClick', 'createNewPlaylist("'+name+'")');
			aDiv.setAttribute('class', 'categorie-link black');
			
			categoriesDiv.appendChild(aDiv);
		});
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
}

function createNewPlaylist(category) {
	let key = 'shuffledPlaylist'

	window.sessionStorage.setItem('playlistCategory', category);
	cleanPlaylist();

	if(category == "geral"){
		window.location.reload();
	} else {
		var xhr = new window.XMLHttpRequest();
		xhr.open('GET', '/api/breques/specificcategory/'+category, false);
		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
		xhr.onreadystatechange = function () {
			if(xhr.readyState === 4 && xhr.status === 200) {    //readystate === 4 (done)
				response = xhr.responseText;
	
				var nowPlayingCategory = JSON.parse(response);
	
				nowPlayingCategory = nowPlayingCategory.breques.map(item => {
					return item.brequeId;
				});
	
				saveInSessionStorage(key, nowPlayingCategory)
			}
			else if(xhr.readyState === 4 && xhr.status === 401) {    //readystate === 4 (done){
				console.log('failed to get specific category');
			} 
		};
		xhr.send();	
	}


	window.location.reload();
}

function fillNowPlayingInfo() {
	let name = document.querySelector('.now-playing-category-name');
	let videos = document.querySelector('.now-playing-category-videos-length');

	name.textContent = '#' + window.sessionStorage.playlistCategory;
	videos.textContent =  Number(window.sessionStorage.playlistPointer)+1 + '/' + JSON.parse('['+window.sessionStorage.shuffledPlaylist+']').length;
}