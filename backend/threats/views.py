import requests
from decouple import config
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import NewsItem, ThreatScore
from .serializer import NewsItemSerializer, ThreatScoreSerializer
from .news_fetcher import fetch_news
from datetime import timedelta #Part time fix for later implementation of websockets for data 
from django.utils import timezone #Part time fix for later implementation of websockets for data 

@api_view(['GET'])
def health_check(request):
    return Response({'status': 'Doomsday V2 API is running'})

@api_view(['GET'])
def search(request):
    query = request.GET.get('q', '')

    if not query:
        return Response({'results': []})
    
    news_api_key = config('NEWS_API_KEY')
    response = requests.get(
        f'https://newsapi.org/v2/everything?q="{query}"&language=en&pageSize=10&sortBy=publishedAt&apiKey={news_api_key}'
    )
    articles = response.json().get('articles', [])
    
    results = [
        {
            'title': article.get('title', ''),
            'source': article.get('source', {}).get('name', ''),
            'url': article.get('url', '')
        }
        for article in articles
    ]
    
    return Response({'query': query, 'results': results})

@api_view(['GET'])
def threat_data(request):
    latest = NewsItem.objects.order_by('-created_at').first()
    if not latest or (timezone.now() - latest.created_at) > timedelta(hours=3):#Part time fix for later implementation of websockets for data 
        fetch_news()

    news_items = NewsItem.objects.all().order_by('-ai_score')[:10] #while react calls the /api/threats - this GET request runs, queries the db
    serializer = NewsItemSerializer(news_items, many=True)  # And serializes the data to return the JSON response through the return request
    return Response({
        'headlines': serializer.data
    })

@api_view(['GET'])
def fetch_news_view(request):
    fetch_news()
    return Response({'status': 'News fetched successfully'})