from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Avg, Max, Min
import requests
from django.conf import settings

from .models import WeatherObservation
from .serializers import WeatherObservationSerializer

class WeatherObservationViewSet(viewsets.ModelViewSet):
    queryset = WeatherObservation.objects.all()
    serializer_class = WeatherObservationSerializer
    
    @action(detail=False, methods=['post'])
    def fetch_from_api(self, request):
        """Fetch weather data from OpenWeatherMap API"""
        city = request.data.get('city', 'London')
        
        # OpenWeatherMap API call
        api_key = settings.OPENWEATHER_API_KEY
        if not api_key or api_key == 'your_api_key_here':
            return Response({
                'error': 'API key not configured. Please add OPENWEATHER_API_KEY in .env file'
            }, status=400)
        
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            'q': city,
            'appid': api_key,
            'units': 'metric'
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            # Check for API errors
            if response.status_code != 200:
                return Response({
                    'error': data.get('message', 'API error')
                }, status=response.status_code)
            
            # Save to database
            weather_data = WeatherObservation.objects.create(
                location=data['name'],
                temperature=data['main']['temp'],
                humidity=data['main']['humidity'],
                pressure=data['main']['pressure'],
                description=data['weather'][0]['description'],
                wind_speed=data['wind']['speed'],
                wind_direction=data['wind'].get('deg', 0),
                source='api'
            )
            
            serializer = self.get_serializer(weather_data)
            return Response(serializer.data)
            
        except Exception as e:
            return Response({'error': str(e)}, status=400)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get weather statistics"""
        from django.db.models import Count
        
        stats = WeatherObservation.objects.aggregate(
            avg_temp=Avg('temperature'),
            max_temp=Max('temperature'),
            min_temp=Min('temperature'),
            avg_humidity=Avg('humidity'),
            total_records=Count('id')
        )
        
        # Recent data for chart (last 10 records)
        recent_data = WeatherObservation.objects.all().order_by('-observation_time')[:10]
        chart_data = {
            'labels': [str(item.observation_time.date()) for item in recent_data],
            'temperatures': [float(item.temperature) for item in recent_data],
            'humidities': [float(item.humidity) for item in recent_data],
        }
        
        return Response({
            'stats': stats,
            'chart_data': chart_data
        })