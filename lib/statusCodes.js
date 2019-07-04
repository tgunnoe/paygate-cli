const callback = (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const info = JSON.parse(body);
    console.log(info);
  }
  else if (!error && response.statusCode == 201) {
    console.log('Success!');
    console.log(JSON.parse(body));
  }
  else {
    console.log('Unlogged status code ' + response.statusCode);
  }
}
module.exports.callback = callback;
