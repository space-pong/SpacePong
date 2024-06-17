from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import GameData
from .serializers import DataSerializer


class DataAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        Data = GameData.objects.filter(myName=request.user)
        # Data = GameData.objects.all()
        serializer = DataSerializer(Data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        if (GameData.objects.filter(myName='').count() == 0):
            GameData.objects.create(
                IsMatched=False,
                RoomNumber=request.user.username,
                myName=request.user.username,
                oppositeName='',
                hostName=request.user.username,
                guestName='',
                mySkin=request.data.get('mySkin'),
                oppositeSkin=''
        )
            GameData.objects.create(
                IsMatched=False,
                RoomNumber=request.user.username,
                myName='',
                oppositeName=request.user.username,
                hostName='',
                guestName=request.user.username,
                mySkin='',
                oppositeSkin=request.data.get('mySkin')
        )
        else :
            opposite = GameData.objects.filter(oppositeName='', guestName='', oppositeSkin='').first()
            if opposite:
                opposite.oppositeName = request.user.username
                opposite.guestName = request.user.username
                opposite.oppositeSkin = request.data.get('mySkin')
                opposite.save()
            myself = GameData.objects.filter(myName='',hostName='',mySkin='').first()
            if myself:
                myself.myName = request.user.username
                myself.hostName = request.user.username
                myself.mySkin = request.data.get('mySkin')
                myself.save()
        return Response("OK")

    def delete(self, request):
        GameData.objects.filter(myName=request.user).delete()
        GameData.objects.filter(oppositeName=request.user).delete()
        return Response("OK")