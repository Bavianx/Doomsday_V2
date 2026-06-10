from django.core.management.base import BaseCommand
from django.db.models import Avg, Q
from threats.models import NewsItem, CountryThreat

COUNTRY_KEYWORDS = {
    'Russia': ['russia', 'russian', 'moscow', 'kremlin', 'putin'],
    'China': ['china', 'chinese', 'beijing'],
    'USA': ['united states', 'usa', 'american', 'washington'],
    'Iran': ['iran', 'iranian', 'tehran'],
    'North Korea': ['north korea', 'pyongyang'],
    'Pakistan': ['pakistan', 'islamabad'],
    'Japan': ['japan', 'japanese', 'tokyo'],
    'Israel': ['israel', 'israeli', 'jerusalem'],
    'Ukraine': ['ukraine', 'ukrainian', 'kyiv'],
    'Taiwan': ['taiwan', 'taipei'],
    'India': ['india', 'indian', 'modi'],
    'Saudi Arabia': ['saudi arabia', 'riyadh'],
    'Turkey': ['turkey', 'turkish', 'ankara'],
    'United Kingdom': ['united kingdom', 'britain', 'british', 'london'],
    'Syria': ['syria', 'syrian', 'damascus'],
}

class Command(BaseCommand):
    help = 'Update country threat scores'

    def handle(self, *args, **kwargs):
        for country, keywords in COUNTRY_KEYWORDS.items():
            query = Q()
            for keyword in keywords:
                query |= Q(headline__icontains=keyword)
            avg_score = NewsItem.objects.filter(query).aggregate(
                Avg('ai_score'))['ai_score__avg']
            if avg_score:
                CountryThreat.objects.filter(name=country).update(
                    score=round(avg_score, 1))
                self.stdout.write(f'Updated {country}: {round(avg_score, 1)}')
            else:
                self.stdout.write(f'No data for {country}')