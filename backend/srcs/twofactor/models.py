from django.db import models
from django.utils import timezone

# Create your models here.
class OTPData(models.Model):
    myName = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)