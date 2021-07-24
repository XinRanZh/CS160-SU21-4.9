# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('bigscreen', views.bigscreen, name='bigscreen'),
    path('mobile', views.mobile, name='mobile'),
    path('<str:room_name>/', views.room, name='room'),

]
