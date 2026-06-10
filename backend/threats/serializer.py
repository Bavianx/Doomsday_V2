from rest_framework import serializers
from .models import NewsItem, ThreatScore, CountryThreat

#Python file which translates the python data to JSON for the react frontend to uderstand the data being sent

class NewsItemSerializer(serializers.ModelSerializer):  #Converting the news fields into json for react to consume 
    class Meta:
        model = NewsItem
        fields = ['id', 'headline', 'source', 'category', 'ai_score'] #Data set keys for json output within react

class ThreatScoreSerializer(serializers.ModelSerializer): 
    class Meta:
        model = ThreatScore
        fields = ['id', 'category', 'score']



class CountryThreatSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountryThreat
        fields = ['name', 'lat', 'lng', 'score']