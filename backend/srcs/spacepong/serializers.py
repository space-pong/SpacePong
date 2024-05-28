from rest_framework import serializers
from .models import GameData

class DataSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameData
        fields = ['IsMatched', 'RoomNumber', 'myName', 'oppositeName', 'hostName', 'guestName', 'mySkin', 'oppositeSkin']

