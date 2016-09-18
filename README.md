# Pace4Chrome
Pace4Chrome is a small Chrome Extension which injects [pace.js](http://github.hubspot.com/pace/docs/welcome/) and a stylesheet into all websites visited. It can be fully customised on the options page which allows one to change the color and preset in "easy" mode and edit the CSS in "advanced" mode.

New in version 2.0 is also a blacklisting feature. The blacklist simply consists of a list of regular expressions, separated by linefeeds, ordered from most specific to least specific. Each visited website's URL is tested against these regular expressions. Example: `^https?:\/\/news\.ycombinator\.com.*$`. This blacklists `news.ycombinator.com`.

Pace4Chrome is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/pace4chrome/mnajikgodiohijkaknjomgpjjoogdfdj).

## Libraries used

+ [pace.js](http://github.hubspot.com/pace/docs/welcome/) - for the loading indicator
+ [color](https://github.com/harthur/color) - to compile the presets with the chosen color
+ [jscolor](https://github.com/EastDesire/jscolor) - a color selector for the options page
+ [purecss](http://purecss.io/) - buttons and grid for the options page

## License

See LICENSE file. It's MIT licensed, have fun! If you've made any changes that you feel might benefit the original, send me a pull request.

## Repo Info
This repo uses `git flow`. The `develop` branch is for an in-progress release, the `master` branch is for published releases. The tags are kind of a mess, but the plan is to have just the version number for future releases. I don't intend to work P4C much, though.