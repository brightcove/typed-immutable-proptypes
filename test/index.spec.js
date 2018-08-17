const { Record, List, Map, Typed, Union, Maybe, Any } = require('typed-immutable');
const { Maybe: ExtMaybe, Enum, Discriminator } = require('@brightcove/typed-immutable-extensions');
const { propTypeOf } = require('../src');
const PropTypes = require('prop-types');

class PropTypeInstanceOf {
  constructor (type) {
    this.type = type;
  }
}

class PropTypeOneOf {
  constructor (values) {
    this.values = values;
  }
}

class PropTypeOneOfType {
  constructor (types) {
    this.types = types;
  }
}

describe('propTypeOf()', () => {
  beforeEach(() => {
    //Stub out PropTypes.instanceOf
    PropTypes.instanceOf = type => new PropTypeInstanceOf(type);
    PropTypes.oneOf = values => new PropTypeOneOf(values);
    PropTypes.oneOfType = types => new PropTypeOneOfType(types);
  });

  it('should throw for undefined types', () => {
    expect(() => {
      propTypeOf();
    }).to.throw(/Type cannot be nully/);
  });

  it('should throw for null types', () => {
    expect(() => {
      propTypeOf(null);
    }).to.throw(/Type cannot be nully/);
  });

  it('should return an instanceOf proptype for Records', () => {
    const ValueType = Record({
      id: '123',
    });
    expect(propTypeOf(ValueType)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', ValueType);
  });
  
  it('should return an instanceOf proptype for Lists', () => {
    const ListType = List(String);
    expect(propTypeOf(ListType)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', ListType);
  });

  it('should return an instanceOf proptype for Maps', () => {
    const MapType = Map(String, String);
    expect(propTypeOf(MapType)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', MapType);
  });

  it('should return a string proptype for strings', () => {
    expect(propTypeOf('foo')).to.equal(PropTypes.string);
  });

  it('should return a string proptype for String objects', () => {
    expect(propTypeOf(String)).to.equal(PropTypes.string);
  });

  it('should return a string proptype for Typed.String', () => {
    expect(propTypeOf(Typed.String)).to.equal(PropTypes.string);
    expect(propTypeOf(new Typed.String('foo'))).to.equal(PropTypes.string);
  });

  it('should return a number proptype for numbers', () => {
    expect(propTypeOf(1)).to.equal(PropTypes.number);
  });

  it('should return a number proptype for Number objects', () => {
    expect(propTypeOf(Number)).to.equal(PropTypes.number);
  });

  it('should return a number proptype for Typed.Number', () => {
    expect(propTypeOf(Typed.Number)).to.equal(PropTypes.number);
    expect(propTypeOf(new Typed.Number(1))).to.equal(PropTypes.number);
  });

  it('should return a boolean proptype for booleans', () => {
    expect(propTypeOf(true)).to.equal(PropTypes.bool);
  });

  it('should return a boolean proptype for Boolean objects', () => {
    expect(propTypeOf(Boolean)).to.equal(PropTypes.bool);
  });

  it('should return a boolean proptype for Typed.Boolean', () => {
    expect(propTypeOf(Typed.Boolean)).to.equal(PropTypes.bool);
    expect(propTypeOf(new Typed.Boolean(true))).to.equal(PropTypes.bool);
  });

  it('should return a symbol proptype for symbols', () => {
    expect(propTypeOf(Symbol.iterator)).to.equal(PropTypes.symbol);
  });

  it('should return a symbol proptype for Symbol objects', () => {
    expect(propTypeOf(Symbol)).to.equal(PropTypes.symbol);
  });

  it('should return a symbol proptype for Typed.Symbol', () => {
    expect(propTypeOf(Typed.Symbol)).to.equal(PropTypes.symbol);
    expect(propTypeOf(new Typed.Symbol(Symbol.iterator))).to.equal(PropTypes.symbol);
  });

  it('should return an array proptype for arrays', () => {
    expect(propTypeOf([0, 1])).to.equal(PropTypes.array);
  });

  it('should return an array proptype for Array objects', () => {
    expect(propTypeOf(Array)).to.equal(PropTypes.array);
  });

  it('should return an array proptype for Typed.Array', () => {
    expect(propTypeOf(Typed.Array)).to.equal(PropTypes.array);
    expect(propTypeOf(new Typed.Array([0, 1]))).to.equal(PropTypes.array);
  });

  it('should return an instanceOf RegExp proptype for regular expressions', () => {
    expect(propTypeOf(/foo/)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', RegExp);
  });

  it('should return an instanceOf RegExp proptype for RegExp objects', () => {
    expect(propTypeOf(RegExp)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', RegExp);
  });

  it('should return an instanceOf RegExp proptype for Typed.RegExp', () => {
    expect(propTypeOf(Typed.RegExp)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', RegExp);
    expect(propTypeOf(new Typed.RegExp(/foo/))).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', RegExp);
  });

  it('should return an instanceOf Date proptype for Dates', () => {
    expect(propTypeOf(new Date())).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', Date);
  });

  it('should return an instanceOf Date proptype for Date objects', () => {
    expect(propTypeOf(Date)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', Date);
  });

  it('should return an instanceOf Date proptype for Typed.Date', () => {
    expect(propTypeOf(Typed.Date)).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', Date);
    expect(propTypeOf(new Typed.Date(new Date()))).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', Date);
  });

  it('should work with Maybe types', () => {
    expect(propTypeOf(Maybe(String))).to.equal(PropTypes.string);
  });

  it('should work with Extensions Maybe types', () => {
    expect(propTypeOf(ExtMaybe(String))).to.equal(PropTypes.string);
  });

  it('should work with any types', () => {
    expect(propTypeOf(Any)).to.equal(PropTypes.any);
  });

  it('should return a oneOfType proptype for Unions', () => {
    const ValueType = Record({
      id: 1234,
    });
    const UnionType = Union(ValueType, String, Number);
    const propType = propTypeOf(UnionType);
    expect(propType).to.be.an.instanceOf(PropTypeOneOfType);
    expect(propType.types[0]).to.be.an.instanceOf(PropTypeInstanceOf).with.property('type', ValueType);
    expect(propType.types[1]).to.equal(PropTypes.string);
    expect(propType.types[2]).to.equal(PropTypes.number);
  });

  it('should return a oneOf proptype for Enums', () => {
    expect(propTypeOf(Enum(['left', 'center', 'right']))).to.be.an.instanceOf(PropTypeOneOf).with.property('values').deep.equal([
      'left', 'center', 'right',
    ]);
  });

  it('should return a oneOfType proptype for Discriminators', () => {
    const StringType = Record({
      type: String,
      value: String,
    });
    const NumberType = Record({
      type: String,
      value: Number,
    });
    const propType = propTypeOf(Discriminator('type', {
      'string': StringType,
      'number': NumberType,
    }));
    expect(propType).to.be.an.instanceOf(PropTypeOneOfType);
    for (const type of propType.types) {
      expect(type).to.be.an.instanceOf(PropTypeInstanceOf);
    }
    expect(propType.types.map(type => type.type)).to.have.same.members([StringType, NumberType]);
  });

  it('should include Discriminator default types', () => {
    const StringType = Record({
      type: String,
      value: String,
    });
    const NumberType = Record({
      type: String,
      value: Number,
    });
    const AnyType = Record({
      type: String,
      value: Any,
    });
    const propType = propTypeOf(Discriminator('type', {
      'string': StringType,
      'number': NumberType,
    }, AnyType));
    expect(propType).to.be.an.instanceOf(PropTypeOneOfType);
    for (const type of propType.types) {
      expect(type).to.be.an.instanceOf(PropTypeInstanceOf);
    }
    expect(propType.types.map(type => type.type)).to.have.same.members([StringType, NumberType, AnyType]);
  });

  it('should throw if an unknown type is supplied', () => {
    expect(() => {
      propTypeOf({});
    }).to.throw(/Unknown type supplied/);
  });
});