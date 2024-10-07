from rest_framework import generics,permissions,pagination,viewsets
from . import serializers
from . import models

from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import OrderItems
from .serializers import OrderItemSerializer

from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User


from django.shortcuts import render
from django.db.models import Count
from django.contrib.admin import AdminSite
from django.urls import path
from django.http import HttpResponse

from main.models import Order, Product, Category,Buyer,Vendor
from .models import Wishlist

from django.shortcuts import get_object_or_404
from .models import OrderItems
import requests
import json
from django.contrib.auth import authenticate
from .forms import VendorRegistrationForm
from rest_framework import status

from .models import Product, ProductImage
from .serializers import ProductListSerializer, ProductDetailSerializer
from rest_framework.parsers import MultiPartParser, FormParser

from collections import defaultdict
from datetime import datetime, timedelta
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
import logging
from django.views.decorators.csrf import csrf_protect
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import uuid
from django.conf import settings
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.hashers import make_password
from .models import Notification
from .serializers import StoreSerializer





# Store Views
class StoreViewSet(viewsets.ModelViewSet):
    queryset = models.Store.objects.all()
    serializer_class = StoreSerializer
    
class StoreListView(generics.ListCreateAPIView):
    queryset = models.Store.objects.all()
    serializer_class = StoreSerializer  # Use your defined StoreSerializer
    permission_classes = [permissions.AllowAny]  # Adjust as needed

class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Store.objects.all()
    serializer_class = StoreSerializer  # Use your defined StoreSerializer
    permission_classes = [permissions.AllowAny]  # Adjust as needed



@csrf_exempt
def send_notification_to_buyer(request, buyer_id):
    if request.method == 'POST':
        try:
            buyer = get_object_or_404(Buyer, pk=buyer_id)
            data = json.loads(request.body)
            message = data.get('message', 'Default notification message')  # Adjust as per your API design
            # Implement your notification sending logic here
            # Example: send_notification(buyer, message)
            return JsonResponse({'status': 'Notification sent successfully', 'message': message})
        except Buyer.DoesNotExist:
            return JsonResponse({'error': 'Buyer does not exist'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Only POST method is allowed'}, status=405)

class BuyerNotificationsView(APIView):
    def get(self, request, buyer_id):
        try:
            notifications = Notification.objects.filter(buyer_id=buyer_id)
            serialized_notifications = []  # Serialize notifications as needed
            for notification in notifications:
                serialized_notifications.append({
                    'status': notification.status,
                    'message': notification.message
                })
            return Response(serialized_notifications, status=status.HTTP_200_OK)
        except Notification.DoesNotExist:
            return Response({'error': 'Notifications not found'}, status=status.HTTP_404_NOT_FOUND)





@csrf_exempt
def handle_messages(request):
    if request.method == 'POST':
        # Get the order_id from the request body
        order_id = request.POST.get('order_id')
        if order_id:
            # Print a notification saying the order has been validated
            print(f"Order {order_id} has been validated.")
            return JsonResponse({'message': f'Order {order_id} has been validated.'})
        else:
            return JsonResponse({'error': 'Order ID not provided in the request.'}, status=400)
    else:
        # Handle other HTTP methods (e.g., GET, PUT, DELETE) if necessary
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def reset_buyer_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        try:
            user = User.objects.get(username=username)

            # Generate unique token for password reset
            token = default_token_generator.make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            reset_password_url = f'http://localhost:3000/Buyer/PasswordChange?username={username}&token={token}&uid={uidb64}'

            # Check if email settings are available
            if hasattr(settings, 'EMAIL_BACKEND'):
                try:
                    # Send confirmation email
                    send_mail(
                        'Password Reset Confirmation',
                        f'Are you trying to change your password? If yes, please click on the following link to proceed: {reset_password_url}',
                        settings.EMAIL_HOST_USER,  # Use the configured email as the sender
                        [user.email],
                        fail_silently=False,
                    )

                    return JsonResponse({'message': 'Confirmation email sent. Check your email for further instructions.'})
                except Exception as e:
                    return JsonResponse({'error': 'Failed to send confirmation email: {}'.format(str(e))}, status=500)
            else:
                return JsonResponse({'message': 'Email functionality is not configured. Confirmation email not sent.'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def change_buyer_password(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            new_password = data.get('new_password')
            confirm_password = data.get('confirm_password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format in request body'}, status=400)

        if new_password != confirm_password:
            return JsonResponse({'error': 'Passwords do not match'}, status=400)

        try:
            user = User.objects.get(username=username)
            user.set_password(new_password)
            user.save()
            return JsonResponse({'message': 'Password reset successfully.'})
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)





# Vendor

class VendorList(generics.ListCreateAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorSerializer
    

class VendorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Vendor.objects.all()
    serializer_class = serializers.VendorDetailSerializer


# Vendor Buyers Order Items
class VendorBuyerOrderItemList(generics.ListAPIView):
    queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderItemSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        vendor_id = self.kwargs['pk']
        qs = qs.filter(product__vendor__id=vendor_id)
        return qs
    
# Vendor Buyers 
class VendorBuyerList(generics.ListAPIView):
    queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderItemSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        vendor_id = self.kwargs['pk']
        qs = qs.filter(product__vendor__id=vendor_id)
        return qs



@csrf_exempt
def vendor_register(request):
    if request.method == 'POST':
        form = VendorRegistrationForm(request.POST)
        if form.is_valid():
            # Extract data from validated form
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            username = form.cleaned_data['username']
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            mobile = form.cleaned_data['mobile']
            address = form.cleaned_data['address']
            companyName = form.cleaned_data['companyName']

            try:
                # Create user
                user = User.objects.create_user(username=username, email=email, password=password,
                                                first_name=first_name, last_name=last_name)
                # Create vendor profile
                vendor = models.Vendor.objects.create(user=user, mobile=mobile, address=address,
                                                      companyName=companyName)
                return JsonResponse({'bool': True, 'msg': 'Account successfully created, you can login now'})
            except IntegrityError:
                return JsonResponse({'bool': False, 'msg': 'Username or email already exists'}, status=400)
        else:
            # Form validation failed, return errors
            errors = form.errors.as_json()
            return JsonResponse({'bool': False, 'errors': errors}, status=400)
    elif request.method == 'GET':
        # Handle GET request
        return JsonResponse({'message': 'GET request received. Please use a POST request for registration.'})
    else:
        # Handle other request methods
        return JsonResponse({'message': 'Unsupported request method.'}, status=405)
    
@csrf_exempt
def vendor_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'bool': False, 'msg': 'Invalid JSON input'})

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'bool': False, 'msg': 'Username and password are required'})

        # Debugging logs
        logger.debug(f"Login attempt with username: {username} and password: {password}")

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)  # Log in the user to update last_login field
            try:
                vendor = models.Vendor.objects.get(user=user)
                logger.info(f"User {username} authenticated and vendor found: {vendor}")
                return JsonResponse({'bool': True, 'msg': 'Login successful', 'id': vendor.id, 'user': user.username})
            except models.Vendor.DoesNotExist:
                logger.warning(f"Authenticated user {username} is not a vendor.")
                return JsonResponse({'bool': False, 'msg': 'Not a vendor'})
        else:
            logger.warning(f"Authentication failed for username: {username}")
            return JsonResponse({'bool': False, 'msg': 'Invalid Username or Password, Try again!'})
    return JsonResponse({'message': 'Unsupported request method.'})

@csrf_exempt
def Vendor_Change_Password(request,vendor_id):
    password = request.POST.get('password')
    vendor = models.Vendor.objects.get(id=vendor_id)
    user = vendor.user
    user.password = make_password(password)
    user.save()
    msg = {'bool':True,'msg':'Password has been changed'}
    return JsonResponse(msg)

# Product
    

class ProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = ProductListSerializer
    pagination_class = pagination.PageNumberPagination
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        qs = super().get_queryset().order_by('-id')

        # Filter by subcategory if provided
        subcategory_id = self.request.GET.get('Subcategory')
        if subcategory_id is not None:
            subcategory = models.Subcategory.objects.filter(id=subcategory_id).first()
            if subcategory is not None:
                qs = qs.filter(Category=subcategory.category, subcategory=subcategory)

        # Filter by store if provided
        store_id = self.request.GET.get('store')
        if store_id is not None:
            qs = qs.filter(store__id=store_id)

        # Limit fetched results if 'fetch_limit' parameter is provided
        fetch_limit = self.request.GET.get('fetch_limit')
        if fetch_limit is not None:
            qs = qs[:int(fetch_limit)]

        return qs

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Extract subcategory ID, vendor ID, and store ID from the request data
        subcategory_id = request.data.get('Subcategory')
        vendor_id = request.data.get('Vendor')
        store_id = request.data.get('store')

        # Retrieve the subcategory, vendor, and store objects
        subcategory = models.Subcategory.objects.filter(id=subcategory_id).first()
        vendor = models.Vendor.objects.filter(id=vendor_id).first()
        store = models.Store.objects.filter(id=store_id).first()

        # Check if subcategory, vendor, and store exist
        if subcategory is None:
            return Response({"detail": "Invalid subcategory ID"}, status=status.HTTP_400_BAD_REQUEST)
        if vendor is None:
            return Response({"detail": "Invalid vendor ID"}, status=status.HTTP_400_BAD_REQUEST)
        if store is None:
            return Response({"detail": "Invalid store ID"}, status=status.HTTP_400_BAD_REQUEST)

        # Create the product
        product = models.Product.objects.create(
            subcategory=subcategory,
            Vendor=vendor,
            store=store,  # Add store to product creation
            title=request.data.get('title'),
            slug=request.data.get('slug'),
            detail=request.data.get('detail'),
            price=request.data.get('price'),
            tags=request.data.get('tags'),
            image=request.data.get('image'),
            demo_url=request.data.get('demo_url'),
            quantity=request.data.get('quantity'),
            discount=request.data.get('discount')
        )

        # Handle product images
        product_imgs = request.FILES.getlist('productImgs')
        for img in product_imgs:
            models.ProductImage.objects.create(product=product, image=img)

        # Serialize the created product
        serializer = ProductDetailSerializer(product)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)







# Tag 

class TagProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer 
    pagination_class = pagination.PageNumberPagination

    def get_queryset(self):
        qs = super().get_queryset()
        tag = self.kwargs['tag']
        qs = qs.filter(tags__icontains=tag)
        return qs 
    

    # specific category

class RelatedProductList(generics.ListCreateAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductListSerializer 

    def get_queryset(self):
        qs = super().get_queryset()
        Product_id = self.kwargs['pk']
        product = models.Product.objects.get(id=Product_id)
        subcategory = product.subcategory
        if subcategory:
            qs = qs.filter(subcategory__category=subcategory.category).exclude(id=Product_id)
        return qs 




class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Product.objects.all()
    serializer_class = serializers.ProductDetailSerializer

    def perform_update(self, serializer):
        instance = serializer.instance
        delete_images = self.request.data.get('deleteImages', 'false').lower() == 'true'
        
        super().perform_update(serializer)
        
        if delete_images:
            instance.product_imgs.all().delete()

        product_images = self.request.FILES.getlist('productImgs')
        for image in product_images:
            models.ProductImage.objects.create(product=instance, image=image)
    

class ProductRatingsView(viewsets.ModelViewSet):
    serializer_class = serializers.ProductRatingsSerializer
    queryset = models.ProductRatings.objects.all()    


# Buyer    
    
    
class BuyerList(generics.ListCreateAPIView):
    queryset = models.Buyer.objects.all()
    serializer_class = serializers.BuyerSerializer

class BuyerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Buyer.objects.all()
    serializer_class = serializers.BuyerDetailSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


from django.contrib.auth import authenticate, login
import logging

logger = logging.getLogger(__name__)

@csrf_exempt
def buyer_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)  # Log in the user to update last_login field
            try:
                buyer = models.Buyer.objects.get(user=user)
                msg = {
                    'bool': True,
                    'user': user.username,
                    'id': buyer.id,
                }
                logger.info(f"User {username} logged in successfully.")
            except models.Buyer.DoesNotExist:
                msg = {
                    'bool': False,
                    'msg': 'Buyer not found!'
                }
        else:
            msg = {
                'bool': False,
                'msg': 'Invalid Username or Password, Try again!'
            }
            logger.warning(f"Login failed for username: {username}")
        return JsonResponse(msg)

@csrf_exempt
def buyer_register(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        username = request.POST.get('username')
        email = request.POST.get('email')
        password = request.POST.get('password')
        mobile = request.POST.get('mobile')
        address = request.POST.get('address')  # Remplacement de companyName par address

        try:
            user = User.objects.create_user(
                first_name=first_name,
                last_name=last_name,
                email=email,
                username=username,
                password=password,
            )

            buyer = models.Buyer.objects.create(
                user=user,
                mobile=mobile,
                address=address  # Remplacement de companyName par address
            )
            msg = {
                'bool': True,
                'user': user.id,
                'buyer': buyer.id,
                'msg': 'Account successfully created, you can login now'
            }
        except IntegrityError as e:
            msg = {
                'bool': False,
                'msg': 'Username already exists'
            }
        return JsonResponse(msg)
    

@csrf_exempt
def Buyer_Change_Password(request,buyer_id):
    password = request.POST.get('password')
    buyer = models.Buyer.objects.get(id=buyer_id)
    user = buyer.user
    user.password = make_password(password)
    user.save()
    msg = {'bool':True,'msg':'Password has been changed'}
    return JsonResponse(msg)


class BuyerAddressView(viewsets.ModelViewSet):
    serializer_class = serializers.BuyerAddressSerializer
    queryset = models.BuyerAddress.objects.all()



# Order
    
    
class OrderList(generics.ListCreateAPIView):
    queryset = models.Order.objects.all()
    serializer_class = serializers.OrderSerializer

    

# Order Items    
class OrderItemList(generics.ListCreateAPIView):
    queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderItemSerializer

# Buyer Order Items    
class BuyerOrderItemList(generics.ListAPIView):
    queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderItemSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        buyer_id=self.kwargs['pk']
        qs = qs.filter(Order__Buyer_id=buyer_id)
        return qs 


class OrderDetail(generics.ListAPIView):
    # queryset = models.OrderItems.objects.all()
    serializer_class = serializers.OrderDetailSerializer

    def get_queryset(self):
        Order_id = self.kwargs['pk']
        Order = models.Order.objects.get(id=Order_id)
        order_items = models.OrderItems.objects.filter(Order=Order)
        return order_items
    


@api_view(['GET'])
def get_order_items_for_buyer(request, buyer_id):
    try:
        order_items = OrderItems.objects.filter(Order__Buyer_id=buyer_id)
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data)
    except OrderItems.DoesNotExist:
        return Response({"message": "No order items found for this buyer"}, status=404)



@csrf_exempt
def delete_order_items(request, pk):
    if request.method == 'DELETE':
        order_item = get_object_or_404(OrderItems, pk=pk)
        order = order_item.Order

        order_item.delete()
        
        # Check if there are any remaining order items for this order
        remaining_items = OrderItems.objects.filter(Order=order)
        if not remaining_items:
            order.delete()

        return JsonResponse({'message': 'Order item deleted successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    

    
# Category

class CategoryList(generics.ListCreateAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    

class CategoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategoryDetailSerializer






class SubcategoryList(generics.ListAPIView):
    serializer_class = serializers.SubcategorySerializer

    def get_queryset(self):
        category_id = self.kwargs['category_id']
        return models.Subcategory.objects.filter(category_id=category_id)
    


class SubcategoryProductList(generics.ListAPIView):
    serializer_class = serializers.ProductListSerializer

    def get_queryset(self):
        subcategory_id = self.kwargs['subcategory_id']
        subcategory = models.Subcategory.objects.get(id=subcategory_id)
        category_id = subcategory.category_id
        return models.Product.objects.filter(subcategory_id=subcategory_id, subcategory__category_id=category_id)



class SubcategoryDetail(generics.RetrieveAPIView):
    serializer_class = serializers.SubcategorySerializer
    queryset = models.Subcategory.objects.all()





@csrf_exempt
def update_order_status(request,order_id):
    if request.method=='POST':
        updateRes = models.Order.objects.filter(id=order_id).update(Order_status=True)
        msg = {
            'bool': False,
        }
        if updateRes:
            msg = {
                'bool': True,
            }
    return JsonResponse(msg)



# Wishlist    
class WishList(generics.ListCreateAPIView):
    queryset = models.Wishlist.objects.all()
    serializer_class = serializers.WishlistSerializer

    def get_queryset(self):
        buyer_id = self.request.query_params.get('Buyer', None)
        if buyer_id is not None:
            return Wishlist.objects.filter(Buyer=buyer_id)
        return Wishlist.objects.all()


@csrf_exempt
def remove_from_wishlist(request, item_id):
    if request.method == 'DELETE':
        try:
            # Retrieve the Wishlist item with the specified item_id
            wishlist_item = Wishlist.objects.get(pk=item_id)
            wishlist_item.delete()  # Delete the item from the database
            return JsonResponse({'bool': True})  # Return success response
        except Wishlist.DoesNotExist:
            return JsonResponse({'bool': False, 'message': 'Wishlist item not found'}, status=404)  # Return error response
    else:
        return JsonResponse({'bool': False, 'message': 'Method not allowed'}, status=405)  # Return error response if method is not allowed




class PopularCategoriesView(APIView):
    def get(self, request):
        # Fetch categories based on products associated with their subcategories
        categories = models.Category.objects.annotate(
            product_count=Count('subcategories__products')
        ).order_by('-product_count')[:4]

        # Serialize the categories with their product counts and image URLs
        serializer = serializers.CategorySerializer(categories, many=True)

        popular_categories_data = []
        for category_data in serializer.data:
            # Fetch subcategories for each category
            subcategories = models.Subcategory.objects.filter(category_id=category_data['id'])
            subcategory_data = []
            for subcategory in subcategories:
                subcategory_product_count = subcategory.products.count()
                subcategory_data.append({
                    'id': subcategory.id,
                    'title': subcategory.title,
                    'product_count': subcategory_product_count
                })
            category_data['subcategories'] = subcategory_data
            popular_categories_data.append(category_data)

        return Response(popular_categories_data)



@api_view(['GET'])
def popular_products(request):
   
    try:
        popular_products = Product.objects.annotate(total_orders=Count('orderitems')).order_by('-total_orders')[:4]
        serializer = ProductListSerializer(popular_products, many=True)
        return Response({'popular_products': serializer.data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    

    





from collections import defaultdict
from django.contrib.admin import AdminSite
from django.db.models import Count
from django.urls import path
from django.db.models.functions import TruncDay
from django.shortcuts import render
from .models import Order, Product, Buyer, Vendor
from django.contrib.auth.models import User
import requests
from datetime import datetime, timedelta
from django.db.models.functions import TruncWeek



class CustomAdminView(AdminSite):
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('visualize/', self.admin_view(self.visualize_admin), name='visualize_admin'),
        ]
        return custom_urls + urls

    def visualize_admin(self, request):
        # Fetch categories from the API
        categories_response = requests.get('http://127.0.0.1:8000/Categories/')
        categories_data = categories_response.json().get('results', [])


        # Total registrations per day starting from May 1, 2024

        start_date = datetime(2024, 5, 1)
        total_registrations = (
            User.objects.filter(date_joined__date__gte=start_date)
            .annotate(day=TruncDay('date_joined'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        start_date = datetime(2024, 5, 1)
        total_registrations = (
            User.objects.filter(date_joined__date__gte=start_date)
            .annotate(day=TruncDay('date_joined'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )
        # Total users per week starting from May 1, 2024

        start_date = datetime(2024, 5, 1)
        end_date = datetime.now().date()  # Or specify the end date you want
        total_users = (
            User.objects.filter(date_joined__date__gte=start_date, date_joined__date__lte=end_date)
            .annotate(week=TruncWeek('date_joined'))
            .values('week')
            .annotate(count=Count('id'))
            .order_by('week')
        )

        # Total orders per day

        total_orders = (
            Order.objects.annotate(day=TruncDay('Order_time'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        # Total logins per day

        total_logins = (
            User.objects.filter(last_login__date__gte=start_date)
            .annotate(day=TruncDay('last_login'))
            .values('day')
            .annotate(count=Count('id'))
            .order_by('day')
        )

        # Data preparation for each chart

        user_labels = [entry['week'].strftime('%Y-%m-%d') for entry in total_users]
        user_data = [entry['count'] for entry in total_users]

        order_labels = [day.strftime('%Y-%m-%d') for day in total_orders.values_list('day', flat=True)]
        order_data = list(total_orders.values_list('count', flat=True))

        login_labels = [day.strftime('%Y-%m-%d') for day in total_logins.values_list('day', flat=True)]
        login_data = list(total_logins.values_list('count', flat=True))

        registration_labels = [day.strftime('%Y-%m-%d') for day in total_registrations.values_list('day', flat=True)]
        registration_data = list(total_registrations.values_list('count', flat=True))

        # Number of orders for each buyer

        buyer_labels = []
        buyer_data = []
        orders_by_buyer = Order.objects.values('Buyer__user__username').annotate(count=Count('id'))
        for order_count in orders_by_buyer:
            buyer_username = order_count['Buyer__user__username']
            if buyer_username:  # Ensure the username is not None
                buyer_labels.append(f"{buyer_username} ({order_count['count']} orders)")
                buyer_data.append(order_count['count'])

        # Number of products
        total_products = Product.objects.count()

        # Total number of buyers
        total_buyers = Buyer.objects.count()

        # Total number of vendors
        total_vendors = Vendor.objects.count()
        
        # Total number of users
        total_users_count = User.objects.count()

        # Number of users registered as buyers
        buyers_count = Buyer.objects.count()

        # Number of users registered as vendors
        vendors_count = Vendor.objects.count()

        # Products by category
        products_by_category = Product.objects.values('subcategory__category__title').annotate(count=Count('id'))

        # Products by subcategory with checks for None
        products_by_subcategory = defaultdict(int)
        for product in Product.objects.all():
            if product.subcategory:
                subcategory_title = product.subcategory.title
                if subcategory_title:  # Ensure the title is not None
                    products_by_subcategory[subcategory_title] += 1

        subcategory_labels = list(products_by_subcategory.keys())
        subcategory_data = list(products_by_subcategory.values())

        # All vendors fetching
        vendors = Vendor.objects.all()

        # Products by vendor 
        products_by_vendor = defaultdict(int)
        for vendor in vendors:
            if vendor.user:
                vendor_username = vendor.user.username
                if vendor_username:  # Ensure the username is not None
                    products_count = Product.objects.filter(Vendor=vendor).count()
                    products_by_vendor[vendor_username] = products_count

        # Sales percentage calculation
        total_order_items = Order.objects.aggregate(total_items=Count('order_items'))['total_items']
        sales_percentage = (total_order_items / total_products) * 100 if total_products > 0 else 0

        # Ordering percentage calculation
        ordering_percentage = min((len(total_orders) / total_buyers) * 100, 100) if total_buyers > 0 else 0

        product_labels = ['Total Products']
        product_data = [total_products]

        category_labels = [category['title'] for category in categories_data if category.get('title')]
        category_data_dict = {item['subcategory__category__title']: item['count'] for item in products_by_category}
        category_data = [category_data_dict.get(category['title'], 0) for category in categories_data]

        vendor_labels = ['Total Vendors']
        vendor_data = [total_vendors]

        # Products by vendor
        vendor_product_labels = list(products_by_vendor.keys())
        vendor_product_data = list(products_by_vendor.values())

        # Chart for total buyers
        total_buyers_labels = ['Total Buyers']
        total_buyers_data = [total_buyers]

        # Sales percentage
        sales_percentage_labels = ['Sales Percentage']
        sales_percentage_data = [sales_percentage]

        # Ordering percentage
        ordering_percentage_labels = ['Ordering Percentage']
        ordering_percentage_data = [ordering_percentage]

        # Buyers count
        buyers_count_labels = ['Buyers Count']
        buyers_count_data = [buyers_count]

        # Vendors count
        vendors_count_labels = ['Vendors Count']
        vendors_count_data = [vendors_count]

        context = {
            'user_labels': user_labels,
            'user_data': user_data,
            'order_labels': order_labels,
            'order_data': order_data,
            'buyer_labels': buyer_labels,
            'buyer_data': buyer_data,
            'login_labels': login_labels,
            'login_data': login_data,
            'registration_labels': registration_labels,
            'registration_data': registration_data,
            'product_labels': product_labels,
            'product_data': product_data,
            'category_labels': category_labels,
            'category_data': category_data,
            'vendor_labels': vendor_labels,
            'vendor_data': vendor_data,
            'vendor_product_labels': vendor_product_labels,
            'vendor_product_data': vendor_product_data,
            'total_buyers_labels': total_buyers_labels,
            'total_buyers_data': total_buyers_data,
            'sales_percentage_labels': sales_percentage_labels,
            'sales_percentage_data': sales_percentage_data,
            'ordering_percentage_labels': ordering_percentage_labels,
            'ordering_percentage_data': ordering_percentage_data,
            'buyers_count_labels': buyers_count_labels,
            'buyers_count_data': buyers_count_data,
            'vendors_count_labels': vendors_count_labels,
            'vendors_count_data': vendors_count_data,
            'total_products': total_products,
            'subcategory_labels': subcategory_labels,
            'subcategory_data': subcategory_data,
            'total_users_count': total_users_count,
        }

        return render(request, 'visualization.html', context)

# Create an instance of the custom admin site
custom_admin_site = CustomAdminView(name='customadmin')
