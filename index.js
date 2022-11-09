import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import useWebSocket from 'react-use-websocket';

const SOCKET_URL_ONE = 'wss://www.taskster.com:9502/';
const SOCKET_URL_TWO = 'wss://demos.kaazing.com/echo';
const READY_STATE_OPEN = 1;

//Generates the click handler, which returns a promise that resovles to the provided url.
const generateAsyncUrlGetter =
  (url, timeout = 2000) =>
  () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(url);
      }, timeout);
    });
  };

export const UseWebSocketTester = ({}) => {
  const [currentSocketUrl, setCurrentSocketUrl] = useState(null);
  const [messageHistory, setMessageHistory] = useState([]);
  const [inputtedMessage, setInputtedMessage] = useState('');
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    currentSocketUrl,
    {
      share: true,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    lastMessage && setMessageHistory((prev) => prev.concat(lastMessage.data));
  }, [lastMessage]);

  const readyStateString = {
    0: 'CONNECTING',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'CLOSED',
  }[readyState];

  return (
    <div>
      Whatever you send will be echoed from the Server
      <div>
        <input
          type={'text'}
          value={inputtedMessage}
          onChange={(e) => setInputtedMessage(e.target.value)}
        />
        <button
          onClick={() => sendMessage(inputtedMessage)}
          disabled={readyState !== READY_STATE_OPEN}
        >
          Send
        </button>
      </div>
      Select Socket Server:
      <br />
      <button
        onClick={() =>
          setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_ONE))
        }
        disabled={currentSocketUrl === SOCKET_URL_ONE}
      >
        {SOCKET_URL_ONE}
      </button>
      <button
        onClick={() =>
          setCurrentSocketUrl(generateAsyncUrlGetter(SOCKET_URL_TWO))
        }
        disabled={currentSocketUrl === SOCKET_URL_TWO}
      >
        {SOCKET_URL_TWO}
      </button>
      <br />
      ReadyState: {readyStateString}
      <br />
      MessageHistory: {messageHistory.join(', ')}
    </div>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<UseWebSocketTester />);
