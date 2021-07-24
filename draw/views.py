# chat/views.py
from django.shortcuts import render

def mobile(request):
    return render(request, 'draw/mobile.html')

def bigscreen(request):
    return render(request, 'draw/bigscreen.html')

def room(request, room_name):
    return render(request, 'draw/room.html', {
        'room_name': room_name
    })
