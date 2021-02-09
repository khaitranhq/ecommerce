const tmp = (callback) => callback();

const x = 5;
tmp(() => {
  console.log(x);
});
