import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        usr_pos = text_data_json.get("usr_pos")
        ballDir = text_data_json.get("ballDir")
        username = text_data_json.get("username")
        ball_pos = text_data_json.get("ball_pos")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "game_info", 
                "usr_pos": usr_pos, 
                "ballDir": ballDir,
                "username": username,
                "ball_pos": ball_pos
            }
        )

    # Receive message from room group
    async def game_info(self, event):
        usr_pos = event["usr_pos"]
        username = event["username"]
        ballDir = event["ballDir"]
        ball_pos = event["ball_pos"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "usr_pos": usr_pos,
            "ballDir": ballDir,
            "username": username,
            "ball_pos": ball_pos
        }))