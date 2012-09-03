var HTMLPreview = {

	content: '',

	previewform: document.getElementById('previewform'),

	file: function() {
		return location.search.substring(1); //Get everything after the ?
	},

	raw: function() {
		return this.file().replace(/\/\/github\.com/,'//raw.github.com').replace(/\/blob\//,'/'); //Get URL of the raw file
	},

	folder: function() {
		return this.raw().replace(/[^\/]+$/g,''); //Remove file name from the end of URL
	},

	replaceScripts: function() {
		var link = document.getElementsByTagName('link');
		for(var i in link) {
			if(link[i].rel
			&& link[i].rel == 'stylesheet'
			&& link[i].href) {
				var href = link[i].href; //Get absolute URL
				if(href.indexOf('//raw.github.com') > 0) { //Check if it's from raw.github.com
					this.send(href, 'loadCSS'); //Then load it using YQL
				}
			}
		}
		var script = document.getElementsByTagName('script');
		for(var i in script) {
			if(script[i].src) {
				var src = script[i].src; //Get absolute URL
				if(src.indexOf('//raw.github.com') > 0) { //Check if it's from raw.github.com
					this.send(src, 'loadJS'); //Then load it using YQL
				}
			}
		}
		var a = document.getElementsByTagName('a');
		for(var i in a) {
			if(a[i].href) {
				var href = a[i].href; //Get absolute URL
				if(href.indexOf('#') > 0) { //Check if it's an anchor
					a[i].href = 'http://' + location.hostname + location.pathname + location.search + '#' + a[i].hash.substring(1); //Then rewrite URL with support for empty anchor
				}
				else if(href.indexOf('//raw.github.com') > 0) { //Check if it's from raw.github.com
					a[i].href = 'http://' + location.hostname + location.pathname + '?' + href; //Then rewrite URL
				}
			}
		}
	},

	loadHTML: function(data) {
		if(data
		&& data.query
		&& data.query.results
		&& data.query.results.resources
		&& data.query.results.resources.content
		&& data.query.results.resources.status == 200) {
			this.content = data.query.results.resources.content.replace(/<head>/i,'<head><base href="'+this.folder()+'">').replace(/<\/body>/i,'<script src="http://' + location.hostname + '/htmlpreview.min.js"></script><script>HTMLPreview.replaceScripts();</script></body>'); //Add <base> just after <head> and inject <script> just before </body>
			setTimeout(function() {
				document.open();
				document.write(HTMLPreview.content);
				document.close();
			}, 10); //Delay updating document to have it cleared before
		}
		else if(data
			 && data.error
			 && data.error.description) {
			this.previewform.innerHTML = data.error.description;
		}
		else
			this.previewform.innerHTML = 'Error: Cannot load file '+this.raw();
	},

	loadCSS: function(data) {
		if(data
		&& data.query
		&& data.query.results
		&& data.query.results.resources
		&& data.query.results.resources.content
		&& data.query.results.resources.status == 200) {
			document.write('<style>'+data.query.results.resources.content+'</style>');
		}		
	},

	loadJS: function(data) {
		if(data
		&& data.query
		&& data.query.results
		&& data.query.results.resources
		&& data.query.results.resources.content
		&& data.query.results.resources.status == 200) {
			document.write('<scr'+'ipt>'+data.query.results.resources.content+'</scr'+'ipt>');
		}		
	},

	send: function(file, callback) {
		console.log('Loading: ' + file);
		document.write('<scr'+'ipt src="http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20data.headers%20where%20url%3D%22'+encodeURIComponent(file)+'%22&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=HTMLPreview.'+callback+'"></scr'+'ipt>'); //Get content using YQL
	},

	submitform: function() {
		location.href = '/?' + document.getElementById('file').value;
		return false;
	},

	init: function() {
		this.previewform.onsubmit = this.submitform;
		if(this.file()) {
			this.previewform.innerHTML = '<p>Loading...</p>';
			this.send(this.raw(), 'loadHTML');
		}
	}
}
