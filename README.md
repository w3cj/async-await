<!-- .slide: data-background-video="https://cdn.flixel.com/flixel/8gg0il08d91lvga9gsme.tablet.mp4" data-background-video-loop="loop" data-background-video-muted -->

<div class="dark-bg">
	<h1>async/await</h1>
	<h2>will change your life</h2>
</div>
<br />
<br />
<br />

<div class="dark-bg">
	<h3>By CJ R.</h3>
</div>

<div class="dark-bg" style="padding:2px;">
	<h3>Lead Instructor @ <img style="background:none;border:none;height:50px;position:relative;top:10px;margin:0;" src="https://s3-us-west-2.amazonaws.com/galvanize.com-dev/galvanize-logo.svg" /></h3>
</div>

---

## Show of hands:
# Who here writes JavaScript code daily?

---

## Show of hands:
# Who here deals with callbacks or promises daily?

---

# JavaScript is an "A" word

---

<!-- .slide: data-background-video="https://cdn.flixel.com/flixel/mpmzedhg4bhlnhi8vbjj.hd.mp4" data-background-video-loop="loop" data-background-video-muted -->

# Asynchronous

All modern JavaScript engines are non-blocking/use an event loop.

---

### What will be logged to the console?

```js
function getUserName() {
	let name;
	$.get('/users/42', (user) => {
		name = user.name;
	});
	return name;
}

let username = getUserName();

console.log('username:', username);
```

---

## Callbacks

Pass a function to a function that will be called when the task is complete.

* Browser events
* Network requests

---

## Callbacks

```js
function getUserName(callback) {
	$.get('/users/42', (user) => {
		callback(user.name);
	});
}

getUserName(username => {
	console.log('username:', username);
});

```

---

## Callbacks

```js
request('https://omdb-api.now.sh/?s=star%20wars', (error, response, body) => {
	const results = JSON.parse(body);
	console.log(results);
});
```

---

## "callback hell"

```js
function getFirstMovie(callback) {
	// Make request to get ID
	request('https://omdb-api.now.sh/?s=star%20wars', (error, response, body) => {
		const results = JSON.parse(body);
		//requires the ID of the previous request
		request('https://omdb-api.now.sh/?i=' + results.Search[0].imdbID, (error, response, body) => {
			const movie = JSON.parse(body);
			callback(movie);
		});
	});
}

getFirstMovie(movie => {
	console.log(movie);
});

```

---

## Promises to the rescue

```js
// rp is the request-promise library
function getFirstMovie() {
	return rp('https://omdb-api.now.sh/?s=star%20wars')
		.then(body => {
			const results = JSON.parse(body);
			return rp('https://omdb-api.now.sh/?i=' + results.Search[0].imdbID)
		}).then(body => {
			const movie = JSON.parse(body);
			return movie;
		});
}
```

```js
getFirstMovie()
	.then(movie => {
		console.log(movie);
	}).catch(error => {
		console.log('Error!!', error);
	});

```

----

## Promise Basics
* Represents a value that may or may not resolve in the future
* Pass a callback to `.then` to be called when the promise is `resolved`
* Pass a callback to `.catch` to be called when the promise is `rejected`

----

### Promises are just cleaner callbacks

* The `rp` function might be implemented like this:

```js
function rp(url) {
	return new Promise((resolve, reject) => {
		request(url, (error, response, body) => {
			if(error) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});
}
```

---

<!-- .slide: data-background-video="https://cdn.flixel.com/flixel/ct08dlpwq6eqp8yp1r6v.hd.mp4" data-background-video-loop="loop" data-background-video-muted -->

<div class="dark-bg">
	<h1>Enter: async/await</h1>
</div>

---

## async/await

* Introduced in ES2016 (ES7)

```js
async function getFirstMovie() {
	try {
		const resultsBody = await rp('https://omdb-api.now.sh/?s=star%20wars');
		const results = JSON.parse(resultsBody);
		const movieBody = await rp('https://omdb-api.now.sh/?i=' + results.Search[0].imdbID);
		const movie = JSON.parse(movieBody);
		return movie;
	} catch (error) {
		console.log('Error!', error);
	}

}
```
```js
getFirstMovie()
	.then(movie => {
		console.log(movie);
	});
```

---

<img src="https://media.giphy.com/media/75ZaxapnyMp2w/giphy.gif" style="width:60%;height:auto" >

---

# How does that work?

---

## Async Functions
* Add the async keyword to any function that will `await` a promise

```js
async function doTheThing() {
	//stuff happens
}
```

* When an async function is called, it returns a Promise.
	* The value returned is "resolved"
	* Any exception thrown is "rejected"

* An async function can contain an await expression
	* This pauses the execution of the async function and waits for the passed Promise's resolution, and then resumes the async function's execution and returns the resolved value.

----

## Promises

```js
// rp is the request-promise library
function getFirstMovie() {
	return rp('https://omdb-api.now.sh/?s=star%20wars')
		.then(body => {
			const results = JSON.parse(body);
			return rp('https://omdb-api.now.sh/?i=' + results.Search[0].imdbID)
		}).then(body => {
			const movie = JSON.parse(body);
			return movie;
		});
}
```

```js
getFirstMovie()
	.then(movie => {
		console.log(movie);
	}).catch(error => {
		console.log('Error!!', error);
	});

```

----

## async/await

```js
async function getFirstMovie() {
    try {
        const resultsBody = await rp('https://omdb-api.now.sh/?s=star%20wars');
        const results = JSON.parse(resultsBody);
        const movieBody = await rp('https://omdb-api.now.sh/?i=' + results.Search[0].imdbID);
        const movie = JSON.parse(movieBody);
        return movie;
    } catch (error) {
        console.log('Error!', error);
    }

}
```

```js
getFirstMovie()
    .then(movie => {
        console.log(movie);
    });
```

---

## async/await gotchas
* Be wary of code that is too synchronous

```js
async function doThings() {
	for (var i = 0; i < array.length; i++) {
		await doTheThing(array[i])
	}
}
```

Instead, use your promise know how:

```js
async function doThings() {
	await Promise.all(array.map(item => {
		return doTheThing(item);
	}));
}
```

---

<!-- .slide: data-background-video="https://cdn.flixel.com/flixel/ttwk93y93xpxt3k4p5b6.hd.mp4" data-background-video-loop="loop" data-background-video-muted -->

<div class="dark-bg">
	<h1>Refactor Complex Promise Chains to use async/await</h1>
</div>

---

## async/await support
* Supported in Node.js 7.6.x
* Supported in Chrome 55+

<img src="https://i.imgur.com/TnX2nzb.png"/>

---

## Resources

* These slides: https://git.io/async-await
* [You Don't Know JS: Async & Performance](https://github.com/getify/You-Dont-Know-JS/blob/master/async%20%26%20performance/ch1.md)
* [MDN: AsyncFunction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/AsyncFunction)
* [MDN: async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
* [The Evolution of Asynchronous JavaScript](https://blog.risingstack.com/asynchronous-javascript/)
* [Asynchronous Adventures in JavaScript: Promises](https://medium.com/@BenDiuguid/asynchronous-adventures-in-javascript-promises-1e0da27a3b4#.yswr2pt19)
* [Ponyfoo: Understanding JavaScript’s async await](https://ponyfoo.com/articles/understanding-javascript-async-await)
* [ES7 Async Await BIBLE](https://hackernoon.com/javascript-es7-async-await-bible-tutorial-example-32294f6133ab#.pedbvrcm8)

---

<!-- .slide: data-background-video="https://cdn.flixel.com/flixel/nmblicrdi8j8iurka7zr.hd.mp4" data-background-video-loop="loop" data-background-video-muted -->

<div class="dark-bg">
	<h1>Thanks!</h1>

	<h3>CJ R.</h3>
	<h3>cj@null.computer</h3>
	<h3>@cj on Denver Devs</h3>
</div>
