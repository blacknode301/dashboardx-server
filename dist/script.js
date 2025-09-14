const ws = new WebSocket('ws://' + '127.0.0.1' + ':3000');

const db = {
  contacts: undefined,
};

ws.onmessage = (event) => {
  androidBridge.showToast('WS сообщение: ' + event.data);
};

function sendMessageToServer(msg) {
  ws.send('Сообщение от JS: ' + msg);
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

reloadPage.addEventListener('click', (e) => {
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