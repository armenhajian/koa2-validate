const validatorLib = require('validator');

const validate = (validator, source) => {
  const errors = [];
  source = source || {};

  Object.keys(validator).some(paramName => {
    return validator[paramName].split('|').some(rule => {
      if (rule === 'required') {
        if (!source[paramName]) {
          return errors.push(validatorError(paramName, rule));
        }
      } else {
        let methodName = rule;
        let options = {};

        if (rule.indexOf('^')) {
          eval(`options = ${rule.split('^')[1]}`);
          methodName = rule.split('^')[0];
        }
        methodName = capitalize(methodName);

        if (
          validatorLib[`is${methodName}`] &&
          typeof validatorLib[`is${methodName}`] === 'function' &&
          !validatorLib[`is${methodName}`](source[paramName], options)
        ) {
          return errors.push(validatorError(paramName, methodName));
        }
      }

      return false;
    });
  });

  return errors;
};

const validateMdlwr = async (ctx, next) => {
  ctx.validate = (validator) => {
    let params = ['GET', 'HEAD'].includes(ctx.method.toUpperCase())
      ? ctx.request.query
      : ctx.request.body;

    params = Object.assign({}, params, ctx.params);

    const errors = validate(validator, params);
    if (errors && errors.length > 0) {
      ctx.throw(422, errors.join(', '), {
        code: 'INVALID_PARAM',
        errors: errors,
        params: params
      });
    }
  };
  await next();
};

const validatorError = (key, rule) => {
  if(rule === 'required') {
    return `${key} is required.`;
  }

  return `${key} should be ${rule}.`;
};

const capitalize = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default () => {
  return validateMdlwr;
};