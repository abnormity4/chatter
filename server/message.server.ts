import { WebSocketServer } from 'ws';
import prisma from '@/lib/prisma';

const wss: WebSocketServer = new WebSocketServer({ port: 8081 });


type WSMessageData = {
  event: string;
  userId: string;
  content: string;
};

type SendMessageEvent = Omit<WSMessageData, 'event'>


type Event = 'message';



wss.on('connection', function connection(ws) {
    ws.on('error', console.error);

    ws.on('message', async function message(data) {
      const messageData: WSMessageData = JSON.parse(data.toString());

      

      switch (messageData.event as Event) {
        case('message'):
          const message = await sendMessage(
            messageData.userId,
            messageData.content
          )

          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
            event: 'message',
            data: {
              message
            }
          }))
            }
          })
          break;
        default:
          return;
      }

    });
})

async function sendMessage(userId: SendMessageEvent['userId'], messageContent: SendMessageEvent['content']) {
  const user = await prisma.message.create({
    data: {
      senderId: userId,
      messageContent: messageContent
    }
  });
  
  return user;
}