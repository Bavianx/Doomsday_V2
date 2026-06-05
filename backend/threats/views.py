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
from django.db.models import Avg
from .AI_Scorer import score_news_items


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
def country_threats(request):
    country = request.GET.get('country', '')

    if not country:
        return Response({'headlines': []})
    
    api_key = config('NEWS_API_KEY')
    response = requests.get(
        f'https://newsapi.org/v2/everything?q={country}+threat+conflict&language=en&pageSize=10&sortBy=publishedAt&apiKey={api_key}'
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
    return Response({'country': country, 'headlines': results})


@api_view(['GET'])
def score_news_view(request):
    score_news_items()
    return Response({'status': 'News scored successfully'})

@api_view(['GET'])
def global_risk_score(request):
    
    nuclear = NewsItem.objects.filter(category='nuclear').aggregate(Avg('ai_score'))['ai_score__avg'] or 0
    geopolitical = NewsItem.objects.filter(category='geopolitical').aggregate(Avg('ai_score'))['ai_score__avg'] or 0
    economic = NewsItem.objects.filter(category='economic').aggregate(Avg('ai_score'))['ai_score__avg'] or 0
    cyber = NewsItem.objects.filter(category='cyber').aggregate(Avg('ai_score'))['ai_score__avg'] or 0
    
    global_score = round(
        (nuclear * 0.35) + (geopolitical * 0.25) + (economic * 0.25) + (cyber * 0.15), 2
    )
    
    return Response({       #Test data
        'global_score': global_score,
        'categories': {
            'nuclear': round(nuclear, 2),
            'geopolitical': round(geopolitical, 2),
            'economic': round(economic, 2),
            'cyber': round(cyber, 2)
        }
    })

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