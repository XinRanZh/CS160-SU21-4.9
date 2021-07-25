# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('mobile', views.mobile, name='mobile'),
    path('mobile2', views.mobile2, name='mobile2'),
    path('bigscreen', views.bigscreen, name='bigscreen'),
    path('<str:room_name>/', views.room, name='room'),
]
