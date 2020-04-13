let Prom = require("./promise").Prom;

let myFirstPromise = new Prom((resolve, reject) => {
  console.log("1. In promise constructor.");
  setTimeout(function () {
    resolve("Success!"); // Yay! Everything went well!
  }, 100);
});

myFirstPromise
  .then((successMessage) => {
    console.log("2. In first then, value: " + successMessage);

    return "very interesting";
  })
  .then((veryInteresting) => {
    console.log("7. In second then, value: ", veryInteresting);
  });

myFirstPromise.then((m) => console.log("3. second then of first promise", m));
myFirstPromise.then((m) => console.log("4. third then of first promise", m));
myFirstPromise.then((m) => console.log("5. fourth then of first promise", m));
myFirstPromise.then((m) => console.log("6. fifth then of first promise", m));

let p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("7. basic promise"), 200);
});
let q = p.then(() => "8. first child promise");
let r = p.then(() => "9. second child promise");

setTimeout(() => {
  p.then(console.log);
  q.then(console.log);
  r.then(console.log);
}, 300);
