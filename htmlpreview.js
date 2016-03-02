var HTMLPreview = {

	content: '',

	previewform: document.getElementById('previewform'),

	file: function() {
		return location.search.substring(1); //Get everything after the ?
	},

	raw: function() {
		return HTMLPreview.file().replace(/\/\/github\.com/, '//raw.githubusercontent.com').replace(/\/blob\//, '/'); //Get URL of the raw file
	},

	replaceAssets: function() {
		var frame, a, link, script, i, href, src;
		frame = document.querySelectorAll('iframe[src],frame[src]');
		for(i = 0; i < frame.length; ++i) {
			src = frame[i].src; //Get absolute URL
			if(src.indexOf('//raw.githubusercontent.com') > 0 || src.indexOf('//bitbucket.org') > 0) { //Check if it's from raw.github.com or bitbucket.org
				frame[i].src = '//' + location.hostname + location.pathname + '?' + src; //Then rewrite URL so it can be loaded using YQL
			}
		}
		a = document.querySelectorAll('a[href]');
		for(i = 0; i < a.length; ++i) {
			href = a[i].href; //Get absolute URL
			if(href.indexOf('#') > 0) { //Check if it's an anchor
				a[i].href = '//' + location.hostname + location.pathname + location.search + '#' + a[i].hash.substring(1); //Then rewrite URL with support for empty anchor
			}
			else if((href.indexOf('//raw.githubusercontent.com') > 0 || href.indexOf('//bitbucket.org') > 0) && (href.indexOf('.html') > 0 || href.indexOf('.htm') > 0)) { //Check if it's from raw.github.com or bitbucket.org and to HTML files
				a[i].href = '//' + location.hostname + location.pathname + '?' + href; //Then rewrite URL so it can be loaded using YQL
			}
		}
		if(document.querySelectorAll('frameset').length)
			return; //Don't replace CSS/JS if it's a frameset, because it will be erased by document.write()
		link = document.querySelectorAll('link[rel=stylesheet]');
		for(i = 0; i < link.length; ++i) {
			href = link[i].href; //Get absolute URL
			if(href.indexOf('//raw.githubusercontent.com') > 0 || href.indexOf('//bitbucket.org') > 0) { //Check if it's from raw.github.com or bitbucket.org
				HTMLPreview.send(href, 'loadCSS'); //Then load it using YQL
			}
		}
		script = document.querySelectorAll('script');
		for(i = 0; i < script.length; ++i) {
			src = script[i].src; //Get absolute URL
			if(src.indexOf('//raw.githubusercontent.com') > 0 || src.indexOf('//bitbucket.org') > 0) { //Check if it's from raw.github.com or bitbucket.org
				HTMLPreview.send(src, 'loadJS'); //Then load it using YQL
			}
			else if(!src && script[i].innerHTML.indexOf('HTMLPreview') < 0) { //Move all inline scripts except HTMLPreview.replaceAssets()
				document.write(script[i].outerHTML);
			}
		}
	},

	loadHTML: function(data) {
		if(data
		&& data.query
		&& data.query.diagnostics
		&& data.query.diagnostics.redirect) {
			HTMLPreview.send(data.query.diagnostics.redirect.content, 'loadHTML');
		}
		else    if(data
			&& data.query
			&& data.query.results
			&& data.query.results.resources
			&& data.query.results.resources.content
			&& data.query.results.resources.status == 200) {
			HTMLPreview.content = data.query.results.resources.content.replace(/<head>/i, '<head><base href="' + HTMLPreview.raw() + '">').replace(/<\/body>/i, '<script src="//' + location.hostname + '/htmlpreview.min.js"></script><script>HTMLPreview.replaceAssets();</script></body>').replace(/<\/head>\s*<frameset/gi, '<script src="//' + location.hostname + '/htmlpreview.min.js"></script><script>document.addEventListener("DOMContentLoaded",HTMLPreview.replaceAssets,false);</script></head><frameset'); //Add <base> just after <head> and inject <script> just before </body> or </head> if <frameset>
			setTimeout(function() {
				document.open();
				document.write(HTMLPreview.content);
				document.close();
			}, 50); //Delay updating document to have it cleared before
		}
		else    if(data
			&& data.error
			&& data.error.description) {
			HTMLPreview.previewform.innerHTML = data.error.description;
		}
		else
			HTMLPreview.previewform.innerHTML = 'Error: Cannot load file ' + HTMLPreview.raw();
	},

	loadCSS: function(data) {
		if(data
		&& data.query
		&& data.query.diagnostics
		&& data.query.diagnostics.redirect) {
			HTMLPreview.send(data.query.diagnostics.redirect.content, 'loadCSS');
		}
		else    if(data
			&& data.query
			&& data.query.results
			&& data.query.results.resources
			&& data.query.results.resources.content
			&& data.query.results.resources.status == 200) {
			document.write('<style>' + data.query.results.resources.content.replace(/url\((?:'|")?([^\/][^:'"\)]+)(?:'|")?\)/gi, 'url(' + data.query.results.resources.url.replace(/[^\/]+\.css.*$/gi, '') + '$1)') + '</style>'); //If relative URL in CSS background-image property, then concatenate URL to CSS directory
		}
	},

	loadJS: function(data) {
		if(data
		&& data.query
		&& data.query.diagnostics
		&& data.query.diagnostics.redirect) {
			HTMLPreview.send(data.query.diagnostics.redirect.content, 'loadJS');
		}
		else    if(data
			&& data.query
			&& data.query.results
			&& data.query.results.resources
			&& data.query.results.resources.content
			&& data.query.results.resources.status == 200) {
			document.write('<script>' + data.query.results.resources.content + '</script>');
		}
	},

	send: function(file, callback) {
		document.write('<script src="//query.yahooapis.com/v1/public/yql?q=use%20%22https%3A%2F%2Fraw.githubusercontent.com%2Fyql%2Fyql-tables%2Fmaster%2Fdata%2Fdata.headers.xml%22%20as%20headers%3B%20select%20*%20from%20headers%20where%20url%3D%22' + encodeURIComponent(file) + '%22&format=json&diagnostics=true&callback=HTMLPreview.' + callback + '"></script>'); //Get content using YQL
	},

	submitform: function() {
		location.href = '/?' + document.getElementById('file').value;
		return false;
	},

	init: function() {
		HTMLPreview.previewform.onsubmit = HTMLPreview.submitform;
		if(HTMLPreview.file()) {
			HTMLPreview.previewform.innerHTML = '<p>Loading...</p>';
			HTMLPreview.send(HTMLPreview.raw(), 'loadHTML');
		}
	}
}
