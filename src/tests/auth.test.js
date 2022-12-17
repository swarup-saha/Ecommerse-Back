const add = (a, b) => {
  return new Promise((resolve, reject) => {
    // event-driven loop
    setTimeout(() => {
      if (a < 0 && b < 0) return reject("number is not valid!");
      resolve(a + b);
    }, 2000);
  });
};
