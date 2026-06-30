import random
import os
import anthropic
from decouple import config
from .models import NewsItem

def score_news_items():     #Weak intro for ai scoring before adding Claude API credits
    unscored = NewsItem.objects.filter(ai_score=0)
    for item in unscored:
        item.ai_score = round(random.uniform(3, 9), 1)
        item.save()
    print(f"Scored {unscored.count()} items")

def score_news_items_claude():
    client = anthropic.Anthropic(api_key=config('ANTHROPIC_API_KEY'))
    unscored = NewsItem.objects.filter(ai_score=0)

    for item in unscored:
        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=10,
            messages=[
                {
                    "role": "user",
                    "content": f"Rate the severity of this threat headline on a scale of 1-10, respond ONLY with the number: '{item.title}'"
                }
            ]
        )
        try:
            score = float(message.content[0].text.strip())
            item.ai_score = round(score, 1)
            item.save()
        except ValueError:
            item.ai_score = 5.0
            item.save()

    print(f"Scored {unscored.count()} items with Claude API")