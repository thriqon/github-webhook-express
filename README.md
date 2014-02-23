
GithubWebhooks Express Middleware
=================================

Easily authenticate and parse requests
coming in as Github Webhook POSTs.

Usage
-----

```javascript
var githubWebhook = require('github-webhook-express');

var express = require('express');
var app = express();

app.use(githubWebhook());

app.post('/webhook', function (req, res) {
	if (req.isByGithub) {
		// do some stuff
	} else {
		// reject!
	}
});

```

Modifications to `req`
----------------------

`req.isByGithub` : True, when this request
was sent by Github. This is matched by checking
the IP against a white list.

`req.githubevent` : A string identifying
the type of event that caused this request.
See http://developer.github.com/webhooks/#events
for details.

`req.githubdeliveryid` : A string containing
the deliveryid as transmitted by Github. See
documentation for details on this.

API
---

Only a small API is exposed:

`middleware.refreshAllowedIps(callback)` : Refreshes
the list of allowed source IPs by sending a request
to Githubs API. The callback function takes the
error object, if any, and for convenience the middleware
itself.

`middleware.validIpRanges([ranges])` : Returns
the currently used array of ranges, or sets this list,
if the parameter is provided.

LICENSE
-------

Copyright (C) 2014 Jonas "thriqon" Weber

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

The license above does not apply to and no license is granted for any Military Use. 

