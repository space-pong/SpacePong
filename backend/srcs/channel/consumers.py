import json

from channels.generic.websocket import AsyncWebsocketConsumer


class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"channel_{self.room_name}"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        
        

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        username = text_data_json.get("username")
        usr_pos = text_data_json.get("usr_pos")
        ball = text_data_json.get("ball")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "game_info", 
                "username": username,
                "usr_pos": usr_pos, 
                "ball": ball,
            }
        )

    # Receive message from room group
    async def game_info(self, event):
        usr_pos = event["usr_pos"]
        username = event["username"]
        ball = event["ball"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "username": username,
            "usr_pos": usr_pos,
            "ball": ball,
        }))