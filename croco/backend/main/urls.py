from django.urls import path
from . import views
from rest_framework import routers

from .views import get_order_items_for_buyer
from .views import PopularCategoriesView
from .views import popular_products


router = routers.DefaultRouter()
router.register('address', views.BuyerAddressView)
router.register('ProductRating', views.ProductRatingsView)
from .views import change_buyer_password,reset_buyer_password

urlpatterns = [
    


    path('Stores/', views.StoreListView.as_view(), name='store_list'),

    # Vendors

    path('Vendors/', views.VendorList.as_view()),
    path('Vendor/<int:pk>/', views.VendorDetail.as_view()),
    path('Vendor/Register/', views.vendor_register,name='vendor_register'),
    path('Vendor/login/', views.vendor_login,name='vendor_login'),
    path('Vendor-Change-Password/<int:vendor_id>',views.Vendor_Change_Password),
    path('Vendor/<int:pk>/Buyers/',views.VendorBuyerList.as_view()),
    path('Vendor/<int:vendor_id>/buyer/<int:buyer_id>/OrderItems/',views.VendorBuyerOrderItemList.as_view()),

    # Products
    path('Products/', views.ProductList.as_view()),
    path('Products/<str:tag>/', views.TagProductList.as_view()),
    path('Product/<int:pk>/', views.ProductDetail.as_view()),
    path('Related-Products/<int:pk>/', views.RelatedProductList.as_view()),

    # Categories
    path('Categories/', views.CategoryList.as_view()),
    path('Category/<int:pk>/', views.CategoryDetail.as_view()),
    path('Category/<int:category_id>/Subcategories/', views.SubcategoryList.as_view(), name='subcategory_list'),

    # Subcategories
    path('Subcategories/<int:category_id>/', views.SubcategoryList.as_view()),
    path('Subcategory/<int:pk>/', views.SubcategoryDetail.as_view()),

    # Buyers
    path('Buyers/', views.BuyerList.as_view()),
    path('Buyer/<int:pk>/', views.BuyerDetail.as_view(), name='buyer-detail'),
    path('Buyer/login/', views.buyer_login, name='buyer_login'),
    path('Buyer/Register/', views.buyer_register, name='buyer_register'),
    path('Buyer-Change-Password/<int:buyer_id>',views.Buyer_Change_Password),
    path('User/<int:pk>/', views.UserDetail.as_view()),

    # Orders
    path('Orders/', views.OrderList.as_view()),
    path('Order/<int:pk>/', views.OrderDetail.as_view()),
    path('OrderItems/', views.OrderItemList.as_view()),
    path('Buyer/<int:pk>/OrderItems/', views.BuyerOrderItemList.as_view()),
    path('update-order-status/<int:order_id>/', views.update_order_status, name='update_order_status'),
    path('Buyer/<int:buyer_id>/orderitems/', get_order_items_for_buyer, name='order_items_for_buyer'),

    # Wishlist
    path('Wishlist/', views.WishList.as_view()),
    path('remove-from-wishlist/<int:item_id>/', views.remove_from_wishlist, name='remove_from_wishlist'),

    path('delete-order-items/<int:pk>/', views.delete_order_items, name='delete_order_items'),

    # Subcategory products
    path('Subcategory/<int:subcategory_id>/products/', views.SubcategoryProductList.as_view(), name='subcategory_products'),


    path('popular-categories/', PopularCategoriesView.as_view(), name='popular-categories'),
    path('popular-products/', popular_products, name='popular_products'),
    

    path('buyer/reset-password/', reset_buyer_password, name='reset_buyer_password'),
    path('buyer/change-password/', change_buyer_password, name='change_buyer_password'),


   path('messages/', views.handle_messages, name='messages'),
   path('Buyer/<int:buyer_id>/sendNotification/', views.send_notification_to_buyer, name='send_notification_to_buyer'),
   path('Buyer/<int:buyer_id>/notifications/', views.BuyerNotificationsView.as_view(), name='buyer_notifications'),
   



]

urlpatterns += router.urls
