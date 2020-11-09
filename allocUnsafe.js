const zeroBuf = Buffer.alloc(Buffer.poolSize);
const zeroBufUnsafe = Buffer.allocUnsafe(Buffer.poolSize);
const zeroBufUnsafeSlow = Buffer.allocUnsafeSlow(Buffer.poolSize);

console.log({
  safe: zeroBuf,
  unsafe: zeroBufUnsafe,
  unsafeSlow: zeroBufUnsafeSlow,
});

const unsafe = Buffer.allocUnsafe(300);
const unsafeSlow = Buffer.allocUnsafeSlow(300);

console.log({
  unsafe: unsafe.toString(),
  unsafeSlow: unsafeSlow.toString(),
});
