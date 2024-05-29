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
        # Data = GameData.objects.filter(myName=request.user)
        Data = GameData.objects.all()
        serializer = DataSerializer(Data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        Data = GameData.objects.filter(myName='')
        if (not Data):
            GameData.objects.create(
                IsMatched=False,
                RoomNumber=request.user,
                myName=request.user,
                oppositeName='',
                hostName=request.user,
                guestName='',
                mySkin=request.data.get('mySkin'),
                oppositeSkin=''
        )
            GameData.objects.create(
                IsMatched=False,
                RoomNumber=request.user,
                myName='',
                oppositeName=request.user,
                hostName=request.user,
                guestName='',
                mySkin='',
                oppositeSkin=request.data.get('mySkin')
        )
        else :
            GameData.objects.filter(oppositeName='', guestName='', oppositeSkin='')[0].update(oppositeName=request.user,guestName=request.user,oppositeSkin=request.data.get('mySkin'))
            GameData.objects.filter(myName='',hostName='',mySkin='')[0].update(myName=request.user, hostName=request.user, mySkin=request.data.get('mySkin'))
        return Response("OK")

    def delete(self, request):
        GameData.objects.filter(myName=request.user).delete()
        return Response("OK")