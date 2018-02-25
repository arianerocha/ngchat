import server from '../server';
import io from 'socket.io-client';

describe('Test Chat Server', () => {
  const socketURL = 'http://localhost:3696';
  let client1;
  let client2;
  let client3;
  let socket;

  beforeEach(() => {
    if (client1) {
      client1.close();
    }

    if (client2) {
      client2.close();
    }

    if (client3) {
      client3.close();
    }
  });

  afterAll(() => {
    server.close();
  });

  function connectClient() {
    let socket = io.connect(socketURL);

    socket.on('connect', function() {
      socket.emit('event.new-user');
    });

    return socket;
  }

  test('Should notify the user that it has been connected', done => {
    expect.assertions(3);

    client1 = connectClient();

    client1.on('event.welcome', function(payload) {
      expect(payload.message).toEqual('You have joined to Mini-Chat.');
      expect(payload.users).toHaveLength(1);
      expect(payload.users).toEqual([client1.id]);

      done();
    });
  });

  test('Should broadcast new user to all users', done => {
    expect.assertions(3);

    client1 = connectClient();
    client2 = connectClient();

    client1.on('event.user-join-chat', function(payload) {
      expect(payload.message).toEqual(`User ${client2.id} has joined to Mini-Chat.`);
      expect(payload.users).toHaveLength(2);
      expect(payload.users).toEqual([client1.id, client2.id]);

      done();
    });
  });

  test('Should have connected users', done => {
    expect.assertions(1);

    client3 = connectClient();
    client1 = connectClient();

    client1.on('event.welcome', function(payload) {
      expect(payload.users).toEqual([client3.id, client1.id]);

      done();
    });
  });

  test('Should send message for all users ', done => {
    expect.assertions(2);

    let message = 'Hey everybody';

    client1 = connectClient();
    client2 = connectClient();

    client1.on('event.response', function(payload) {
      expect(payload.user).toEqual(client2.id);
      expect(payload.message).toEqual(message);

      done();
    });

    client2.emit('event.message', {
      message,
    });
  });

  test('Should send message to yourself ', done => {
    expect.assertions(2);

    let message = 'Hey everybody';

    client1 = connectClient();
    client2 = connectClient();

    client2.on('event.response', function(payload) {
      expect(payload.user).toEqual('You');
      expect(payload.message).toEqual(message);

      done();
    });

    client2.emit('event.message', {
      message,
    });
  });


  test('Should change user nickname ', done => {
    expect.assertions(4);

    let nickname1 = 'JohnDoe';
    let nickname2 = 'JaneDone';

    client1 = connectClient();
    client2 = connectClient();
    client3 = connectClient();

    client2.on('event.changed-name', function(payload) {
      expect(payload.message).toEqual(`You change your name to ${nickname2}`);
      expect(payload.users).toEqual([client3.id, nickname1, nickname2]);

      done();
    });

    client1.on('event.changed-name', function(payload) {
      expect(payload.message).toEqual(`You change your name to ${nickname1}`);
      expect(payload.users).toEqual([client2.id, client3.id, nickname1]);

      client2.emit('event.change-name', { nickname: nickname2 });
    });

    client1.emit('event.change-name', { nickname: nickname1 });
  });

  test('Must tell other users who had a changed name', done => {
    expect.assertions(2);

    let nickname = 'JohnDoe';

    client1 = connectClient();
    client2 = connectClient();

    client2.on('event.user-changed-name', function(payload) {
      expect(payload.message).toEqual(`User ${ client1.id } changed his name to ${nickname}`);
      expect(payload.users).toEqual([client2.id, nickname]);

      done();
    });

    client1.emit('event.change-name', { nickname: nickname });
  });
});
