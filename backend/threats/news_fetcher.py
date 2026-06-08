import requests
from decouple import config
from .models import NewsItem

THREAT_CATEGORIES = {
    "nuclear": "nuclear weapons OR nuclear missile OR nuclear threat OR radiation leak",
    "geopolitical": "military conflict OR war OR NATO OR sanctions OR geopolitical crisis",
    "economic": "economic crisis OR market crash OR recession OR inflation crisis OR financial collapse",
    "cyber": "cyberattack OR ransomware OR data breach OR hacking OR cyber warfare"
}

def fetch_news():
    api_key = config('NEWS_API_KEY')
    
    for category, query in THREAT_CATEGORIES.items():
        response = requests.get(
            f'https://newsapi.org/v2/everything?q=stock+market+trading+financial+news&language=en&pageSize=10&sortBy=publishedAt&apiKey={api_key}'
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