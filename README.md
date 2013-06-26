All-static website powering http://jshint.com/ and http://jshint.com/blog/.
Blog posts reside in "_posts" directory. Preferrable markup language is Markdown.

Dependencies:

* [Ruby](http://www.ruby-lang.org/) and [RubyGems](http://rubygems.org/) - needed for Jekyll
* [Jekyll](http://jekyllrb.com/) - for site generation
* [node.js](http://nodejs.org/) and its dependencies

Installation:

```bash
$ sudo gem install jekyll
$ npm install               # install the node.js dependencies
$ node ./make.js dev        # run local server on port 4000
$ node ./make.js build      # prepare and generate production ready version
```

Deployment notes:

```apache
RewriteEngine on
RewriteBase /
RewriteRule ^options docs [R]
RewriteRule ^reports/(\d+) http://snippets.jshint.com/reports/$1 [R,L]
```
