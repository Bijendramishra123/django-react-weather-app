from django.db import models

class WeatherObservation(models.Model):
    location = models.CharField(max_length=255)
    temperature = models.FloatField()
    humidity = models.FloatField()
    pressure = models.FloatField(null=True, blank=True)
    description = models.CharField(max_length=255, default='Clear sky')
    wind_speed = models.FloatField(null=True, blank=True)
    wind_direction = models.IntegerField(null=True, blank=True)
    observation_time = models.DateTimeField(auto_now_add=True)
    source = models.CharField(max_length=50, default='manual')
    
    def __str__(self):
        return f"{self.location} - {self.temperature}°C"
    
    class Meta:
        ordering = ['-observation_time']