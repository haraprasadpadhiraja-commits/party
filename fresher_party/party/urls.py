"""
URL routing for the 'party' application.
"""

from django.contrib.auth.views import LogoutView
from django.urls import path

from . import views

urlpatterns = [
    # Public pages
    path('', views.home, name='home'),
    path('register/', views.student_register, name='student_register'),
    path('register/success/<int:pk>/', views.registration_success,
         name='registration_success'),
    path('faculty/', views.faculty_page, name='faculty_page'),
    path('search/', views.search_page, name='search_page'),
    path('search/live/', views.live_search, name='live_search'),
    path('gallery/', views.gallery_page, name='gallery_page'),
    path('about/', views.about_page, name='about_page'),
    path('dashboard/', views.dashboard, name='dashboard'),

    # Authentication
    path('login/', views.login_view, name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Admin
    path('admin-panel/', views.admin_dashboard, name='admin_dashboard'),

    # Student management (admin)
    path('admin/students/', views.student_list, name='student_list'),
    path('admin/students/add/', views.student_add, name='student_add'),
    path('admin/students/<int:pk>/edit/', views.student_edit, name='student_edit'),
    path('admin/students/<int:pk>/view/', views.student_view, name='student_view'),
    path('admin/students/<int:pk>/delete/', views.student_delete, name='student_delete'),

    # Faculty management (admin)
    path('admin/faculty/', views.faculty_list, name='faculty_list'),
    path('admin/faculty/add/', views.faculty_add, name='faculty_add'),
    path('admin/faculty/<int:pk>/edit/', views.faculty_edit, name='faculty_edit'),
    path('admin/faculty/<int:pk>/delete/', views.faculty_delete, name='faculty_delete'),

    # College info (admin)
    path('admin/college/', views.college_edit, name='college_edit'),

    # Gallery management (admin)
    path('admin/gallery/', views.gallery_manage, name='gallery_manage'),
    path('admin/gallery/add/', views.gallery_add, name='gallery_add'),
    path('admin/gallery/<int:pk>/edit/', views.gallery_edit, name='gallery_edit'),
    path('admin/gallery/<int:pk>/delete/', views.gallery_delete, name='gallery_delete'),

    # Exports (admin)
    path('admin/export/excel/', views.export_excel, name='export_excel'),
    path('admin/export/pdf/', views.export_pdf, name='export_pdf'),
]
