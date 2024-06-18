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
        user_name = text_data_json.get("user_name")
        user_position = text_data_json.get("user_position")
        ball_object = text_data_json.get("ball_object")
        left_press = text_data_json.get("left_press")
        right_press = text_data_json.get("right_press")
        player1_score = text_data_json.get("player1_score")
        player2_score = text_data_json.get("player2_score")
        pause_duration = text_data_json.get("pause_duration")

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {
                "type": "game_info", 
                "user_name": user_name,
                "user_position": user_position, 
                "ball_object": ball_object,
                "left_press": left_press,
                "right_press": right_press,
                "player1_score": player1_score,
                "player2_score": player2_score,
                "pause_duration": pause_duration,
            }
        )

    # Receive message from room group
    async def game_info(self, event):
        user_name = event["user_name"]
        user_position = event["user_position"]
        ball_object = event["ball_object"]
        left_press = event["left_press"]
        right_press = event["right_press"]
        player1_score = event["player1_score"]
        player2_score = event["player2_score"]
        pause_duration = event["pause_duration"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "user_name": user_name,
            "user_position": user_position,
            "ball_object": ball_object,
            "left_press": left_press,
            "right_press": right_press,
            "player1_score": player1_score,
            "player2_score": player2_score,
            "pause_duration": pause_duration,
        }))