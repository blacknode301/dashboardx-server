let ws = new WebSocket('ws://' + '127.0.0.1' + ':3000');

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


let db = {
  contacts: undefined,
};
/*
function onMessageFromAndroid(msg) {
    alert('Сообщение от Android: ' + msg);
};
*/
reloadPage.addEventListener('click', (e) => {
  // Полная перезагрузка с кэшем
  window.location.reload();
});
androidBridgeShowToast.addEventListener('click', (e) => {
  //androidBridge.showToast('Привет с Node.js страницы!');
  androidBridge.showToast(JSON.stringify(db.contacts));
  sendContactsToServer(JSON.stringify(db.contacts));
});
androidBridgeGetContacts.addEventListener('click', (e) => {
  var contacts = JSON.parse(androidBridge.getContacts());
  db.contacts = contacts;
  androidBridge.showToast(JSON.stringify(contacts));
});
androidBridgeAddContacts.addEventListener('click', (e) => {
  androidBridge.addContacts(JSON.stringify(db.contacts));
});

ws.onmessage = (event) => {
  androidBridgeShowToast('WS сообщение: ');
};

function onMessageFromAndroid(msg) {
  alert('Android сказал: ' + msg);
  ws.send('Привет от JS -> WS: ' + msg);
}
