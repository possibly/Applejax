console.log('First of all, make sure `npm start` has been ran first!!!');
setTimeout(ok,3000);

function ok(){
  console.log('Hey, Im a Node client! Im gonna set myself up in 2 lines of code real fast...');

  var faye = require('faye');
  var client = new faye.Client('http://localhost:8000/play');

  console.log('');
  console.log('Alright, I am going to send 3 messages to the server.');
  console.log('');
  console.log('Be sure to watch the terminal that you ran `npm server` out of!');
  console.log('');
  console.log('ctrl-c whenever you want to break out of this window');

  client.publish('/play',{Key: 'Value'});
  client.publish('/play',{This: 'is',
                            Mutli: 'line'});
  client.publish('/play',{Player: {
                                Health: '100',
                                Move: 'left',
                              } 
                            });
}
