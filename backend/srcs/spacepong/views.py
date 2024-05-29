from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import GameData
from .serializers import DataSerializer

@api_view(['GET'])
def HELLoAPI(request):
    return Response("hello world")


class DataAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        Data = GameData.objects.filter(myName=request.user)
        serializer = DataSerializer(Data, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        if (GameData.objects.count() != 2):
            GameData.objects.create(
                IsMatched=False,
                RoomNumber='Room1',
                myName=request.user,
                oppositeName='',
                hostName=request.user,
                guestName='',
                mySkin=request.data.get('mySkin'),
                oppositeSkin=''
        )
            GameData.objects.create(
                IsMatched=False,
                RoomNumber='Room1',
                myName='',
                oppositeName=request.user,
                hostName=request.user,
                guestName='',
                mySkin='',
                oppositeSkin=request.data.get('mySkin')
        )
        else :
            GameData.objects.filter(oppositeName='').update(oppositeName='secondplayer')
            GameData.objects.filter(myName='').update(myName='secondplayer')
            GameData.objects.filter(hostName='').update(hostName='secondplayer')
            GameData.objects.filter(guestName='').update(guestName='secondplayer')
            GameData.objects.filter(mySkin='').update(mySkin=request.data.get('mySkin'))
            GameData.objects.filter(oppositeSkin='').update(oppositeSkin=request.data.get('mySkin'))

        return Response("OK")