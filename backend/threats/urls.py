from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('search/', views.search, name='search'),
    path('threats/', views.threat_data, name='threat_data'),
    path('fetch/', views.fetch_news_view, name='fetch_news'),
    path('country/',views.country_threats, name='country_threats'),
    path('risk/', views.global_risk_score, name='global_risk_score'),
    path('score/', views.score_news_view, name='score_news'),
    path('stocknews/', views.stock_news, name='stock_news'),
    path('countries/', views.country_threat_points, name='country_threat_points'),
    path('firms/', views.firms_proxy, name='firms_proxy'),
    path('assessment/', views.ai_assessment, name='ai_assessment'),  #remove for the path below if credits are implemented
    # path('assessment/claude/', views.ai_assessment_claude, name='ai_assessment_claude'),
]