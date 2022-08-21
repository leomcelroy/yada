

const FLAG_TYPED_ARRAY = "FLAG_TYPED_ARRAY";

export const encode = obj => JSON.stringify( obj , function( key, value ){
  // the replacer function is looking for some typed arrays.
  // If found, it replaces it by a trio
  if ( value instanceof Int8Array         ||
       value instanceof Uint8Array        ||
       value instanceof Uint8ClampedArray ||
       value instanceof Int16Array        || 
       value instanceof Uint16Array       ||
       value instanceof Int32Array        || 
       value instanceof Uint32Array       || 
       value instanceof Float32Array      ||
       value instanceof Float64Array       )
  {
    var replacement = {
      constructor: value.constructor.name,
      data: Array.apply([], value),
      flag: FLAG_TYPED_ARRAY
    }
    return replacement;
  }
  return value;
});

const context = typeof window === "undefined" ? global : window;

export const decode = (jsonStr) => JSON.parse( jsonStr, function( key, value ){
  // the reviver function looks for the typed array flag
  try{
    if( "flag" in value && value.flag === FLAG_TYPED_ARRAY){
      // if found, we convert it back to a typed array
      const rehydrated = new context[ value.constructor ]( value.data );

      console.log(rehydrated);
      return rehydrated;
    }
  }catch(e){}
  
  // if flag not found no conversion is done
  return value;
});