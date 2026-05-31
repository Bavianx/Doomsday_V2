import requests
from decouple import config
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


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
    return Response({
        'global_score': 5.96,
        'categories': {
            'nuclear': 5.48,
            'geopolitical': 6.74,
            'economic': 5.04,
            'cyber': 7.33
        },
        'headlines': [
            {'title': 'Ransomware attack on critical infrastructure', 'category': 'cyber', 'score': 8.8},
            {'title': 'NATO signals increased readiness', 'category': 'geopolitical', 'score': 6.6},
            {'title': 'Missile test detected near disputed territory', 'category': 'nuclear', 'score': 7.9},    #Hardcoded content for testing purposes
        ]
    })