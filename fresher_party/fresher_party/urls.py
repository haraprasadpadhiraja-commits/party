"""
Root URL configuration for the Fresher Party project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    # Our main application.
    path('', include('party.urls')),
    # Django's built-in admin interface (optional but included).
    path('django-admin/', admin.site.urls),
]

# Serve uploaded media files during development.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL,
                          document_root=settings.STATICFILES_DIRS[0]
                          if settings.STATICFILES_DIRS else settings.STATIC_ROOT)
