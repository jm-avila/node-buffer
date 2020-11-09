const zeroBuf = Buffer.alloc(20);
const hexaFill = Buffer.alloc(20, 0b100);
const decimalFill = Buffer.alloc(1, 4);
const allocAndFill = Buffer.alloc(5).fill("Hello");
console.log({
  zeroBuf,
  hexaFill,
  decimalFill,
  allocAndFill,
  allocAndFillStr: allocAndFill.toString(),
});
