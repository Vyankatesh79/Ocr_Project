"""
URL configuration for Ocr_Project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from OCR import views
from django.conf import settings
import os

urlpatterns = [
    path('admin/', admin.site.urls),
    path('base/',views.base, name='base'),
    path('get-file/',views.Get_file, name='Getfile'),
    path('download/', views.download_file, name='download_file'),
    path('serve-doc/<str:doc_file_name>/', views.serve_doc_file, name='serve_doc_file'),
    
    # path('download_file/<str:filename>/', views.download_file, name='download_file'),
    # path('download/<str:filename>/', views.download_file, name='download_file'),
    # path('download_file/<str:filename>/', views.download_file, name='download_file'),
    # path('download_file/',views.download_file, name='download'),
    # path('serve_doc_file/<str:filename>/', views.serve_doc_file, name='serve_doc_file'),
    # path('media/<str:filename>/', views.serve_pdf_file, name='serve_pdf_file'),
]



# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)