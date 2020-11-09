# Buffer in nodejs

Buffer objects are used to represent a fixed-length sequence of bytes. Many Node.js APIs support Buffers.

The Buffer class is a subclass of JavaScript's Uint8Array class and extends it with methods that cover additional use cases. Node.js APIs accept plain Uint8Arrays wherever Buffers are supported as well.

The Buffer class is within the global scope, making it unlikely that one would need to ever use require('buffer').Buffer.

## Buffers and character encodings

When converting between Buffers and strings, a character encoding may be specified. If no character encoding is specified, UTF-8 will be used as the default.

The character encodings currently supported by Node.js are the following:

- 'utf8': Multi-byte encoded Unicode characters. When decoding a Buffer into a string that does not exclusively contain valid UTF-8 data, the Unicode replacement character U+FFFD � will be used to represent those errors.
- 'utf16le': Multi-byte encoded Unicode characters.
- 'latin1': Latin-1 stands for ISO-8859-1.

Converting a Buffer into a string using one of the above is referred to as decoding, and converting a string into a Buffer is referred to as encoding.

Node.js also supports the following two binary-to-text encodings. For binary-to-text encodings, the naming convention is reversed.

- 'base64': Base64 encoding.
- 'hex': Encode each byte as two hexadecimal characters.

The following legacy character encodings are also supported:

- 'ascii': For 7-bit ASCII data only.
- 'binary': Alias for 'latin1'.
- 'ucs2': Alias of 'utf16le'.

## Buffers and TypedArrays

Buffer instances are also JavaScript Uint8Array and TypedArray instances. All TypedArray methods are available on Buffers. There are, however, subtle incompatibilities between the Buffer API and the TypedArray API.

In particular:

- While TypedArray.slice() creates a copy of part of the TypedArray, Buffer.slice() creates a view over the existing Buffer without copying. This behavior only exists for legacy compatibility. TypedArray.subarray() can be used to achieve the behavior of Buffer.slice() on both Buffers and other TypedArrays.
- buf.toString() is incompatible with its TypedArray equivalent.
- A number of methods support additional arguments.

There are two ways to create new TypedArray instances from a Buffer:

1. Passing a Buffer to a TypedArray constructor will copy the Buffers contents, interpreted as an array of integers, and not as a byte sequence of the target type.
2. Passing the Buffers underlying ArrayBuffer will create a TypedArray that shares its memory with the Buffer.

It is possible to create a new Buffer that shares the same allocated memory as a TypedArray instance by using the TypedArray object’s .buffer property in the same way. Buffer.from() behaves like new Uint8Array() in this context.

When creating a Buffer using a TypedArray's .buffer, it is possible to use only a portion of the underlying ArrayBuffer by passing in byteOffset and length parameters.

The Buffer.from() and TypedArray.from() have different signatures and implementations. Specifically, the TypedArray variants accept a second argument that is a mapping function that is invoked on every element of the typed array:

- TypedArray.from(source[, mapFn[, thisArg]])

The Buffer.from() method, however, does not support the use of a mapping function:

- Buffer.from(array)
- Buffer.from(buffer)
- Buffer.from(arrayBuffer[, byteOffset[, length]])
- Buffer.from(string[, encoding])

## Methods

### Buffer.alloc()

Allocates a new Buffer of size bytes. If fill is undefined, the Buffer will be zero-filled.

Calling Buffer.alloc() can be measurably slower than the alternative Buffer.allocUnsafe() but ensures that the newly created Buffer instance contents will never contain sensitive data from previous allocations, including data that might not have been allocated for Buffers.

```javascript
Buffer.alloc(size[, fill[, encoding]]);
```

Where:

- size (integer)
  - The desired length of the new Buffer.
  - If size is larger than buffer.constants.MAX_LENGTH or smaller than 0, ERR_INVALID_ARG_VALUE is thrown.
- fill (string) | (Buffer) | (Uint8Array) | (integer)
  - Default: 0
  - A value to pre-fill the new Buffer with.
  - If fill is specified, the allocated Buffer will be initialized by calling buf.fill(fill).
  - A TypeError will be thrown if size is not a number.
- encoding (string)
  - Default: 'utf8'
  - If fill is a string, this is its encoding.

If both fill and encoding are specified, the allocated Buffer will be initialized by calling buf.fill(fill, encoding).

### Buffer.allocUnsafe()

Allocates a new Buffer of size bytes. The underlying memory for Buffer instances created in this way is not initialized. The contents of the newly created Buffer are unknown and may contain sensitive data. Use Buffer.alloc() instead to initialize Buffer instances with zeroes.

```javascript
Buffer.allocUnsafe(size);
```

Where:

- size (integer)
  - The desired length of the new Buffer.
  - A TypeError will be thrown if size is not a number.
  - If size is larger than buffer.constants.MAX_LENGTH or smaller than 0, ERR_INVALID_ARG_VALUE is thrown.

### Buffer.allocUnsafeSlow()

Allocates a new Buffer of size bytes. The underlying memory for Buffer instances created in this way is not initialized. The contents of the newly created Buffer are unknown and may contain sensitive data. Use buf.fill(0) to initialize such Buffer instances with zeroes.

```javascript
Buffer.allocUnsafeSlow(size);
```

Where:

- size (integer)
  - The desired length of the new Buffer.
  - A TypeError will be thrown if size is not a number.
  - If size is larger than buffer.constants.MAX_LENGTH or smaller than 0, ERR_INVALID_ARG_VALUE is thrown. A zero-length Buffer is created if size is 0.

When using Buffer.allocUnsafe() to allocate new Buffer instances, allocations under 4KB are sliced from a single pre-allocated Buffer. This allows applications to avoid the garbage collection overhead of creating many individually allocated Buffer instances. This approach improves both performance and memory usage by eliminating the need to track and clean up as many individual ArrayBuffer objects.

However, in the case where a developer may need to retain a small chunk of memory from a pool for an indeterminate amount of time, it may be appropriate to create an un-pooled Buffer instance using Buffer.allocUnsafeSlow() and then copying out the relevant bits.

### Buffer.from()
