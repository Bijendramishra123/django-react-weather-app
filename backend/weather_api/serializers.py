from rest_framework import serializers
from .models import WeatherObservation

class WeatherObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherObservation
        fields = '__all__'
        read_only_fields = ['observation_time']