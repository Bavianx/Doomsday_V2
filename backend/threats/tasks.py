from celery import shared_task
from .news_fetcher import fetch_news
from .AI_Scorer import score_news_items

@shared_task
def fetch_and_score():
    fetch_news()
    score_news_items()
    print("Fetch and score complete")

@shared_task
def fetch_firms():
    # Placeholder for future FIRMS background fetch
    pass