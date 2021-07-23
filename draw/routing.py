# chat/routing.py
from django.conf.urls import re_path, url

from . import consumers

websocket_urlpatterns = [
   re_path(r'ws/draw$', consumers.DrawConsumer.as_asgi()),
]
