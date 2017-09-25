const mixin = (baseClass, ...mixins) => {
  try {
    class base extends baseClass {
      constructor (...args) {
        super(...args)
        mixins.forEach((mixin) => {
          /* eslint new-cap: 0 */
          copyProps(this, (new mixin()))
        })
      }
    }
    let copyProps = (target, source) => {  // this function copies all properties and symbols, filtering out some special ones
      Object.getOwnPropertyNames(source)
        .concat(Object.getOwnPropertySymbols(source))
        .forEach((prop) => {
          if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/)) {
            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop))
          }
        })
    }
    mixins.forEach((mixin) => { // outside contructor() to allow aggregation(A,B,C).staticFunction() to be called etc.
      copyProps(base.prototype, mixin.prototype)
      copyProps(base, mixin)
    })
    return base
  } catch (error) {
    console.log(error)
  } finally {
  }
}

export default mixin