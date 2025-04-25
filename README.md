# Last.FM Album Converter
grabs album coverart from last.fm and converts it with more options

## URL Structure

| Thing | What it do |
|---|---|
| file | the the id of the albumcover |
| size | the size you want to convert to
| format | the file format youre convertig to |
| censored | wether to censor the file |


**Example URL**

``http://localhost:4567/albumcovers/?file=2a96d7fd7f746c9a8af1623cf6aa30a.jpg&size=512&format=webp&censored=20``
## how do i get the cover id?

in the result of your lastfm api call youll see a url like this.

``https://lastfm.freetls.fastly.net/i/u/300x300/c2a96d7fd7f746c9a8af1623cf6aa30a.jpg``

the cover id will be the file in that url 

ex: ``c2a96d7fd7f746c9a8af1623cf6aa30a.jpg``

## todo
* readd censorship
* make censhorship round to nearest five
* add "api" (basic file info)
* remove index.html and make it redirect to repo instead
