onmessage = function(e) {
  var dice = Math.floor(Math.random() * 6) + 1;
  postMessage(dice);
}