Many GitHub repositories don't use GitHub Pages to host their HTML files. GitHub HTML Preview allows you to render those files without cloning or downloading whole repositories.

If you try to open raw versions of any HTML, CSS or JS files in a web browser directly from GitHub, all you will see are sources. GitHub forces them to use the "text/plain" content-type. This script overrides it by using Yahoo! Query Language.

**Now it works with BitBucket too!**

To use it, just prepend this to the URL of any HTML file: **http://htmlpreview.github.com/?**

E.g.:
http://htmlpreview.github.com/?https://github.com/twitter/bootstrap/blob/master/docs/index.html
http://htmlpreview.github.com/?https://github.com/documentcloud/backbone/blob/master/examples/todos/index.html

GitHub HTML Preview is tested under Google Chrome, Apple Safari and Mozilla Firefox, and it should work with any websites, not only GitHub.