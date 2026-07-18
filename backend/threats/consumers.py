import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ThreatConsumer(AsyncWebsocketConsumer):
    async def connect(self):    #browser opens a websocket connection and joins the threats group
        await self.channel_layer.group_add("threats", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):     #browser closes the connection leaving the group
        await self.channel_layer.group_discard("threats", self.channel_name)

    async def threat_update(self, event):     #When the new threat data arrives it automatically sends this to the browser and updates it 
        await self.send(text_data=json.dumps(event["data"]))