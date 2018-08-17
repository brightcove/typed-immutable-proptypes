<a name="propTypeOf"></a>

## propTypeOf(type)
Gets the React proptype for the given primitive or typed-immutable type.

The following native and [typed-immutable](https://github.com/typed-immutable/typed-immutable) types are supported:
* strings, `String`, `Typed.String`, `Typed.String` instances
* numbers, `Number`, `Typed.Number`, `Typed.String` instances
* booleans, `Boolean`, `Typed.Boolean`, `Typed.Boolean` instances
* symbols, `Symbol`, `Typed.Symbol`, `Typed.Symbol` instances (Requires Symbol to be defined or polyfilled)
* arrays, `Array`, `Typed.Array`, `Typed.Array` instances
* regular expressions, `RegExp`, `Typed.RegExp`, `Typed.RegExp` instances
* dates, `Date`, `Typed.Date`, `Typed.Date` instances
* `Record` types
* `Map` types
* `Union` types
* `Maybe` types
* `Any`, `Typed.Any`

The following [@brightcove/typed-immutable-extensions](https://github.com/brightcove/typed-immutable-extensions) types are supported:
* `Enum` types
* `Maybe` types
* `Discriminator`

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>\*</code> | Type to get the proptype for |

**Example**  
```js
import { propTypeOf } from '@brightcove/typed-immutable-proptypes';

const Item = Record({
  id: String
});

const ItemList = List(Item);

const ValueType = Union(Item, String);

class MyComponent extends React.Component {
  static propTypes = {
    item: propTypeOf(Item),
    list: propTypeOf(List),
    value: propTypeOf(ValueType),
  };

  render () {
    ...
  }
}
```
