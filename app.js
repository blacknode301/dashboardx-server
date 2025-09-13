const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');


const HOST = '127.0.0.1';
const PORT = 3000;

// HTTP сервер
const server = http.createServer((request, response) => {

  // CORS заголовки для всех запросов
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  console.log('METHOD:', request.method);
  console.log('URL:', request.url);

  if (request.method === 'GET') {
    let url, contentType, encoding, result;
    encoding = 'utf-8';
    if (request.url === '/') {
      url = '/dist/' + request.url + 'index.html';
      contentType = 'text/html';
    } 
    else if (request.url === '/style.css') {
      url = '/dist/' + request.url;
      contentType = 'text/css';
    } 
    else if (request.url === '/script.js') {
      url = '/dist/' + request.url;
      contentType = 'application/javascript';
    }
    else if (request.url === '/favicon.ico') {
      url = '/dist/' + request.url;
      contentType = 'image/x-icon';
      encoding = 'buffer';
    }
    else {
      contentType = 'text/plain';
    }
    try {
      result = fs.readFileSync(path.join(__dirname + url), encoding);
      response.writeHead(200, { 'Content-Type': contentType });
      response.end(result);
    }
    catch {
      response.writeHead(200, { 'Content-Type': contentType });
      response.end('Not Found');
    }
    
  } 
  else if (request.method === 'POST') {
    let data = '';
    request.on('data', chunk => { data += chunk; });
    request.on('end', () => {
      console.log('POST данные:', data);
      console.log('POST тип данных:', typeof(data));
      
      if (request.url == '/contacts') {
        // Преобразуем в строку JSON с красивым форматирование
        const jsonString = JSON.stringify(JSON.parse(data), null, 2);
        // Путь к файлу
        const filePath = path.join(__dirname, '/db/contacts.json');
        
        // Запись в файл (перезаписывает существующий)
        fs.writeFileSync(filePath, jsonString, 'utf8');
        
        console.log("Файл contacts.json успешно записан!");
      }
      
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ status: 'ok', received: data }));
    });
  } 
  else if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }
  else {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
  }
});

// WebSocket сервер
const wss = new WebSocket.Server({ server });
wss.on('connection', (ws) => {
  console.log('WS подключен');
  ws.send('Добро пожаловать в WebSocket сервер!');

  ws.on('message', (msg) => {
    console.log('WS получил:', msg.toString());
    ws.send('Эхо: ' + msg.toString());
  });
});

// Запуск
server.listen(PORT, HOST, () => {
  console.log(`HTTP + WS сервер запущен на http://${HOST}:${PORT}`);
});