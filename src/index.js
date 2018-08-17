const { Record, Union, Typed, Maybe, Map, List } = require('typed-immutable');
const { Maybe: ExtMaybe, Enum, Discriminator } = require('@brightcove/typed-immutable-extensions');
const PropTypes = require('prop-types');

/* istanbul ignore next */
//Ponyfill Array.isArray for older browsers
const isArray = Array.isArray || (x => Object.prototype.toString.call(x) === '[object Array]');

/* istanbul ignore next */
const isRegExp = x => Object.prototype.toString.call(x) === '[object RegExp]';

/**
 * Checks whether the given type is either a primitive type, the type object, an instance of the typed-immutable type,
 * or the typed-immutable type
 * 
 * @param {*} type - The type to check
 * @param {function} typeObject - Type object (i.e. String)
 * @param {string} immutableType - Typed-immutable type (i.e. 'String')
 * @param {string} [typeString] - Primitive type string (i.e. 'string')
 * @returns {boolean}
 * @private
 */
function isType (type, typeObject, immutableType, typeString) {
  //First check for a primitive type
  return typeof type === typeString ||
    //Then check for a reference to the type object
    type === typeObject ||
    //Then check for an instance of the typed-immutable type
    type instanceof Typed[immutableType] ||
    //Lastly check for a reference to the typed-immutable type object
    type === Typed[immutableType].prototype ||
    type.prototype === Typed[immutableType].prototype;
}

/**
 * Gets the React proptype for the given primitive or typed-immutable type.
 * 
 * The following native and [typed-immutable]{@link https://github.com/typed-immutable/typed-immutable} types are supported:
 * * strings, `String`, `Typed.String`, `Typed.String` instances
 * * numbers, `Number`, `Typed.Number`, `Typed.String` instances
 * * booleans, `Boolean`, `Typed.Boolean`, `Typed.Boolean` instances
 * * symbols, `Symbol`, `Typed.Symbol`, `Typed.Symbol` instances (Requires Symbol to be defined or polyfilled)
 * * arrays, `Array`, `Typed.Array`, `Typed.Array` instances
 * * regular expressions, `RegExp`, `Typed.RegExp`, `Typed.RegExp` instances
 * * dates, `Date`, `Typed.Date`, `Typed.Date` instances
 * * `Record` types
 * * `Map` types
 * * `Union` types
 * * `Maybe` types
 * * `Any`, `Typed.Any`
 * 
 * The following [@brightcove/typed-immutable-extensions]{@link https://github.com/brightcove/typed-immutable-extensions} types are supported:
 * * `Enum` types
 * * `Maybe` types
 * * `Discriminator`
 * 
 * @param {*} type - Type to get the proptype for
 * 
 * @example
 * import { propTypeOf } from '@brightcove/typed-immutable-proptypes';
 * 
 * const Item = Record({
 *   id: String
 * });
 * 
 * const ItemList = List(Item);
 * 
 * const ValueType = Union(Item, String);
 * 
 * class MyComponent extends React.Component {
 *   static propTypes = {
 *     item: propTypeOf(Item),
 *     list: propTypeOf(List),
 *     value: propTypeOf(ValueType),
 *   };
 * 
 *   render () {
 *     ...
 *   }
 * }
 */
module.exports.propTypeOf = (type) => {
  if (type == null) {
    throw new TypeError('Type cannot be nully');
  }

  if (type instanceof Record || type instanceof Map || type instanceof List) {
    return PropTypes.instanceOf(type.constructor);
  }
  if (type.prototype instanceof Record || type.prototype instanceof Map || type.prototype instanceof List) {
    return PropTypes.instanceOf(type);
  }
  if (type instanceof Union.Type) {
    return PropTypes.oneOfType(type[Typed.type].map(module.exports.propTypeOf));
  }
  if (type instanceof Enum.Type) {
    return PropTypes.oneOf(type[Typed.type]);
  }
  if (type instanceof Discriminator.Type) {
    const { typeMap, defaultType } = type[Typed.type];
    const types = Object.keys(typeMap).map(key => PropTypes.instanceOf(typeMap[key]));
    if (defaultType) {
      types.push(PropTypes.instanceOf(defaultType));
    }
    return PropTypes.oneOfType(types);
  }
  if (isType(type, String, 'String', 'string')) {
    return PropTypes.string;
  }
  if (isType(type, Number, 'Number', 'number')) {
    return PropTypes.number;
  }
  //Only support Symbol in environments which define it
  /* istanbul ignore else */
  if (typeof Symbol !== 'undefined') {
    if (isType(type, Symbol, 'Symbol', 'symbol')) {
      return PropTypes.symbol;
    }
  }
  if (isType(type, Boolean, 'Boolean', 'boolean')) {
    return PropTypes.bool;
  }
  if (isArray(type) || isType(type, Array, 'Array')) {
    return PropTypes.array;
  } 
  if (isRegExp(type) || isType(type, RegExp, 'RegExp')) {
    return PropTypes.instanceOf(RegExp);
  }
  if (type instanceof Date || isType(type, Date, 'Date')) {
    return PropTypes.instanceOf(Date);
  }
  if (type instanceof Maybe.Type || type instanceof ExtMaybe.Type) {
    return module.exports.propTypeOf(type[Typed.type]);
  }
  if (type === Typed.Any) {
    return PropTypes.any;
  }
  throw new TypeError(`Unknown type supplied: ${type}`);
};
