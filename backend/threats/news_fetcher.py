import requests
from decouple import config
from .models import NewsItem

THREAT_CATEGORIES = {
    "nuclear": "nuclear weapons OR nuclear threat OR missile",
    "geopolitical": "war OR conflict OR NATO OR military",
    "economic": "recession OR inflation OR market crash OR economic crisis",
    "cyber": "cyberattack OR data breach OR hacking OR ransomware"
}

def fetch_news():
    api_key = config('NEWS_API_KEY')
    
    for category, query in THREAT_CATEGORIES.items():
        response = requests.get(
            f'https://newsapi.org/v2/everything?q={query}&language=en&pageSize=5&sortBy=publishedAt&apiKey={api_key}'
        )
        articles = response.json().get('articles', [])
        
        for article in articles:
            NewsItem.objects.get_or_create(
                headline=article.get('title', ''),
                defaults={
                    'source': article.get('source', {}).get('name', ''),
                    'category': category,
                    'ai_score': 0
                }
            )
    
    print("News fetched successfully!")