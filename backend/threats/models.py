from django.db import models

#Defining the postgresql tables 

class NewsItem(models.Model):      
    headline = models.TextField()
    source = models.CharField(max_length=100)
    category = models.CharField(max_length=50)  # nuclear, geopolitical, economic, cyber
    ai_score = models.FloatField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class ThreatScore(models.Model):
    headline = models.TextField()
    category = models.CharField(max_length=100)
    source = models.CharField(max_length=50)
    ai_score = models.FloatField(default=0)
