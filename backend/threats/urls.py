from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('search/', views.search, name='search'),
    path('threats/', views.threat_data, name='threat_data'),
    path('fetch/', views.fetch_news_view, name='fetch_news'),
]