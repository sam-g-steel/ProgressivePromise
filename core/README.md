# ProgressivePromise
Promise class with mechanism to report progress before resolving

This was inspired by https://www.npmjs.com/package/progress-promise
But with a few extra features

#

## class ProgressPromise extends Promise

### constructor(executor)
* `executor` `<Function>` Invoked immediately
  * `resolve` `<Function>` Same as original `Promise`
  * `reject` `<Function>` Same as original `Promise`
  * `progress` `<Function>` Before resolving, pass single argument to progress listener (May be invoked multiple times)

Executor function receives extra argument: `progress`, a function to be called to notify a listener before resolving.

```javascript
const ProgressPromise = require('progress-promise');

function longTask() {
  return new ProgressPromise((resolve, reject, progress) => {
    setTimeout(() => progress(25), 250);
    setTimeout(() => progress(50), 500);
    setTimeout(() => progress(75), 750);
    setTimeout(resolve, 1000);
  });
}
```

### progress(handler)
* `handler` `<Function>` Invoked by `progress` function passed to `executor`
  * `value` `<Function>` Value from `executor`

Promise rejects if progress handler throws.

```javascript
longTask()
  .progress(value => console.log(value + '%'))
  .then(() => console.log('Done'));

// 25%
// 50%
// 75%
// Done
```

<br/>
<br/>

## License

MIT
<br/>
<br/>


# Changelog
## v0.9.1
July 14, 2021
* Fixed fatal bugs in Firefox
<br/>
<br/>
## v0.9.0
July 12, 2021
* First release