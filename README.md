# Last.FM CoverArt Converter
grabs album art from last.fm and converts it with more options

public instance at [cdn.novassite.net](https://cdn.novassite.net/albumcovers/c2a96d7fd7f746c9a8af1623cf6aa30a.jpg?size=512&format=webp&censored=20)

## URL Structure

| Thing | What it do |
|---|---|
| file | the the id of the albumcover |
| size | the size you want to convert to
| format | the file format you're converting to |
| censored | weather to censor the file and how much to censor it |

**Example URL**

convert:

``http://localhost:4567/albumcovers/c2a96d7fd7f746c9a8af1623cf6aa30a.jpg?size=512&format=webp&censored=20``

fullsize:

``http://localhost:4567/albumcovers/full/c2a96d7fd7f746c9a8af1623cf6aa30a.jpg``
## how do i get the cover id?

in the result of your lastfm api call you'll see a url like this.

``https://lastfm.freetls.fastly.net/i/u/300x300/c2a96d7fd7f746c9a8af1623cf6aa30a.jpg``

the cover id will be the file in that url 

ex: ``c2a96d7fd7f746c9a8af1623cf6aa30a.jpg``

## TODO
* add /info section 
* remove excess converts
