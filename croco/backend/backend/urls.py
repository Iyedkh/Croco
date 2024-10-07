from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt import views as jwt_views
from django.conf import settings
from django.conf.urls.static import static
from main.views import CustomAdminView


# Import CustomAdminView and create an instance
custom_admin_site = CustomAdminView(name='customadmin')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('customadmin/', custom_admin_site.urls, name='customadmin'),  # This is correct
    path('', include('main.urls')),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api-auth/', include('rest_framework.urls')), 
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
