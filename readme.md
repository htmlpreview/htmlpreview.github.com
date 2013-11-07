GitHub & BitBucket HTML Preview
-------------------------------

Many GitHub repositories don't use GitHub Pages to host their HTML files. **GitHub & BitBucket HTML Preview** allows you to render those files without cloning or downloading whole repositories. It is a  client-side solution and does not involve any third party hosting servers (except for Yahoo! Query Language to fetch assets).

If you try to open raw versions of any HTML, CSS or JS files in a web browser directly from GitHub, all you will see are sources. GitHub forces them to use the "text/plain" content-type, so they cannot be interpreted. This script overrides it by using Yahoo! Query Language.

In order to use it, just prepend this fragment to the URL of any HTML file: **[http://htmlpreview.github.io/?](http://htmlpreview.github.io/?)**

E.g.:
http://htmlpreview.github.io/?https://raw.github.com/twbs/bootstrap/gh-pages/2.3.2/index.html
http://htmlpreview.github.io/?https://github.com/documentcloud/backbone/blob/master/examples/todos/index.html

What it does is load HTML using YQL, then process all links, frames, scripts and styles, and load each of them using YQL, so they can be evaluted in the browser. Here is the workflow:
```
HTMLPreview.init() -> HTMLPreview.send(HTML) -> YQL fetch HTML -> HTMLPreview.loadHTML(data) -> HTMLPreview.replaceAssets() -> HTMLPreview.send(CSS) -> YQL fetch CSS -> HTMLPreview.loadCSS(data) -> HTMLPreview.send(JS) -> YQL fetch JS -> HTMLPreview.loadJS(data)
```

**GitHub & BitBucket HTML Preview** was tested under Google Chrome, Apple Safari and Mozilla Firefox, and it should work with majority of websites, not only GitHub & BitBucket.