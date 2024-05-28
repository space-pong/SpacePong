from django.db import models

# Create your models here.
class GameData(models.Model):
    IsMatched = models.BooleanField(default=False)
    RoomNumber = models.CharField(max_length=100)
    myName = models.CharField(max_length=100)
    oppositeName = models.CharField(max_length=100)
    hostName = models.CharField(max_length=100)
    guestName = models.CharField(max_length=100)
    mySkin = models.CharField(max_length=100)
    oppositeSkin = models.CharField(max_length=100)