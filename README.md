# koa2-validate

[![Build Status](https://img.shields.io/npm/v/koa2-validate.svg)](https://www.npmjs.com/package/koa2-validate)

A library that wrap [validator.js][vldtr.git] package for koa.js to validate request parameters.

### Installation and usage

The lib requires [Koa.js](https://koajs.com/) to run.


```sh
$ npm install koa2-validate
```

#### No ES6

```javascript
var validate = require('koa2-validate');
```

#### ES6

```javascript
import validate from 'koa2-validate';
```
##### Usage example
#
```javascript
const app = new Koa()
  .use(cors())
  .use(bodyParser())
  .use(validate()) //use before api routes!!
  .use(api.routes())
  

/**
Use as {param: 'required|methodNameWithoutPrefix'}
*/
api.get('/simple-list',
  async (ctx, next) => {
    ctx.validate({
      limit: 'required|numeric^{no_symbols: true}',
      page: 'required|numeric^{no_symbols: true}'
    })
})
```

The `|` symbol is a separator for rules.\
Only `required` is build-in rule.\
For other rules use method name from the Validate.js [validators][vldrs-link] which STARTS with `is` prefix.\
For example if you write `'..|numeric'` it will call `isNumeric` method from `Validate.js` lib. &nbsp;
For options you can use `^{}`.\
e.g. if you want to call `isNumeric(myVar, {no_symbols: true})` then use `..|numeric^{no_symbols: true}`

If the params not pass the rules it will respond with `422` status and error text `${key} should be ${rule}`

#### ToDo
- Make error texts more dynamic (maybe with option to pass from code)
- Add support of methods without `is` prefix
- Write tests

License
----

MIT


[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks to amazing https://dillinger.io builder)


   [vldtr.npm]: <https://www.npmjs.com/package/validator>
   [vldtr.git]: <https://github.com/chriso/validator.js>
   [vldrs-link]: <https://github.com/chriso/validator.js#validators>
