from rest_framework import serializers
from . import models


# Store Serializer
class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Store
        fields = ['id', 'name', 'description', 'image']

    def __init__(self, *args, **kwargs):
        super(StoreSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')


# Vendor Serializers
class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vendor
        fields = ['id', 'user', 'address']

    def __init__(self, *args, **kwargs):
        super(VendorSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')


class VendorDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vendor
        fields = ['id', 'user', 'mobile', 'profile_img', 'address']

    def __init__(self, *args, **kwargs):
        super(VendorDetailSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        response = super().to_representation(instance)
        response['user'] = UserSerializer(instance.user).data
        return response


# Product Serializers
class ProductListSerializer(serializers.ModelSerializer):
    Product_ratings = serializers.StringRelatedField(many=True, read_only=True)
    tag_list = serializers.SerializerMethodField()
    subcategory = serializers.PrimaryKeyRelatedField(read_only=True)
    store = StoreSerializer(read_only=True)  # Added store information

    class Meta:
        model = models.Product
        fields = ['id', 'subcategory', 'Vendor', 'title', 'slug', 'tag_list', 'detail', 'price', 'Product_ratings', 'image', 'quantity', 'discount', 'store']  # Include store

    def get_tag_list(self, obj):
        return obj.tag_list()


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductImage
        fields = ['id', 'product', 'image']


class ProductDetailSerializer(serializers.ModelSerializer):
    Product_ratings = serializers.StringRelatedField(many=True, read_only=True)
    product_imgs = ProductImageSerializer(many=True, read_only=True)
    subcategory = serializers.PrimaryKeyRelatedField(queryset=models.Subcategory.objects.all())
    Vendor = serializers.PrimaryKeyRelatedField(queryset=models.Vendor.objects.all())
    store = StoreSerializer(read_only=True)  # Added store information

    class Meta:
        model = models.Product
        fields = ['id', 'subcategory', 'Vendor', 'title', 'slug', 'tag_list', 'detail', 'price', 'Product_ratings', 'product_imgs', 'demo_url', 'image', 'quantity', 'discount', 'store']  # Include store


class ProductRatingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ProductRatings
        fields = ['id', 'Buyer', 'Product', 'rating', 'reviews', 'add_time']

    def __init__(self, *args, **kwargs):
        super(ProductRatingsSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1


# Buyer Serializers
class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Buyer
        fields = ['id', 'user', 'mobile', 'address', 'companyName']

    def __init__(self, *args, **kwargs):
        super(BuyerSerializer, self).__init__(*args, **kwargs)
        request = self.context.get('request')
        self.Meta.depth = 1


class BuyerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Buyer
        fields = ['id', 'user', 'mobile', 'profile_img', 'companyName']

    def __init__(self, *args, **kwargs):
        super(BuyerDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ['id', 'first_name', 'last_name', 'username', 'email']


class BuyerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.BuyerAddress
        fields = ['id', 'Buyer', 'address', 'default_address']

    def __init__(self, *args, **kwargs):
        super(BuyerAddressSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1


# Order Serializers
class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Order
        fields = ['id', 'Buyer', 'Order_status']


class OrderItemSerializer(serializers.ModelSerializer):
    product_title = serializers.CharField(source='Product.title', read_only=True)
    product_image = serializers.ImageField(source='Product.image', read_only=True)

    class Meta:
        model = models.OrderItems
        fields = ['id', 'Order', 'Product', 'qty', 'price', 'product_title', 'product_image']


class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.OrderItems
        fields = ['id', 'Order', 'Product']

    def __init__(self, *args, **kwargs):
        super(OrderDetailSerializer, self).__init__(*args, **kwargs)
        self.Meta.depth = 1


# Category Serializers
class SubcategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Subcategory
        fields = ['id', 'title', 'detail', 'image']


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)

    class Meta:
        model = models.Category
        fields = ['id', 'title', 'detail', 'image', 'subcategories']


class CategoryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Category
        fields = ['id', 'title', 'detail']

    def __init__(self, *args, **kwargs):
        super(CategoryDetailSerializer, self).__init__(*args, **kwargs)


# Wishlist Serializer
class WishlistSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Wishlist
        fields = ['id', 'product', 'Buyer']
        extra_kwargs = {
            'Buyer': {'required': False},
            'Product': {'required': False},
        }
