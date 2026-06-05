import random
from .models import NewsItem

def score_news_items():     #Weak intro for ai scoring before adding Claude API credits
    unscored = NewsItem.objects.filter(ai_score=0)
    for item in unscored:
        item.ai_score = round(random.uniform(3, 9), 1)
        item.save()
    print(f"Scored {unscored.count()} items")