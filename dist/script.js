const ws = new WebSocket('ws://' + '127.0.0.1' + ':3000');

const db = {
  content: [
    'refresh',
    'home',
    'call',
    'phone book',
    'voice channel',
    'files cloud',
    'task editor',
    'wa bot',
    'tg bot',
    'okx api',
    'settings',
    'exit',
  ],
  contacts: JSON.parse(androidBridge.getContacts()),
};

function renderNavContent(content) {
  const button = document.createElement('button');
  const span = document.createElement('span');
  var element;
  for(e in content) {
    //androidBridge.showToast(content[e]);
    // copyNode & appendChild
  }
};
renderNavContent(db.content);

ws.onmessage = (event) => {
  androidBridge.showToast('WS message from server: ' + event.data);
};

function sendMessageToServer(msg) {
  ws.send(msg);
}
function sendContactsToServer(jsonString) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:3000/contacts', true); // URL сервера
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) { // запрос завершён
        if (xhr.status >= 200 && xhr.status < 300) {
          console.log('Успех:', xhr.responseText);
        } 
        else {
          console.error('Ошибка:', xhr.status, xhr.responseText);
        }
      }
    };

    xhr.send(jsonString); // отправляем JSON-строку
}

pageFilesShowNav.addEventListener('click', (e) => {
  if (nav.style.display == 'flex') {
    nav.style.display = 'none';
  }
  else {
    nav.style.display = 'flex';
  }
});
pageFilesShowToast.addEventListener('click', (e) => {
  const result = window.screen.height + ' ' + window.screen.width;
  // 946
  // 424
  androidBridge.showToast(result);
});

navBtnReloadPage.addEventListener('click', (e) => {
  window.location.reload();
});
androidBridgeShowToast.addEventListener('click', (e) => {
  //androidBridge.showToast(JSON.stringify(db.contacts));
  androidBridge.showToast('Это простое сообщение!');
});
androidBridgeSendToast.addEventListener('click', (e) => {
  sendMessageToServer('Я получил твоё сообщение!');
  androidBridge.showToast('Сообщение отправлено!');
});

androidBridgeGetContacts.addEventListener('click', (e) => {
  db.contacts = JSON.parse(androidBridge.getContacts());
  androidBridge.showToast('Контакты получены!');
});
androidBridgeSendContacts.addEventListener('click', (e) => {
  if (db.contacts == undefined) {
    androidBridge.showToast('Контакты не были получены, сначала получите контакты!');
  }
  else {
    sendContactsToServer(JSON.stringify(db.contacts));
    androidBridge.showToast('Контакты отправлены на сервер!');
  }
});
androidBridgeAddContacts.addEventListener('click', (e) => {
  androidBridge.addContacts(JSON.stringify(db.contacts));
});