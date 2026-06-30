from django.db import models

#Defining the postgresql tables 

class NewsItem(models.Model):      
    headline = models.TextField()
    source = models.CharField(max_length=100)
    category = models.CharField(max_length=50)  # nuclear, geopolitical, economic, cyber
    ai_score = models.FloatField(default=0)
    url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    

class ThreatScore(models.Model):
    headline = models.TextField()
    category = models.CharField(max_length=100)
    source = models.CharField(max_length=50)
    ai_score = models.FloatField(default=0)


class CountryThreat(models.Model):
    name = models.CharField(max_length=100)
    lat = models.FloatField()
    lng = models.FloatField()
    score = models.FloatField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
