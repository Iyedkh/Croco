from django.db import models
from django.contrib.auth.models import User


# Store Model
class Store(models.Model):
    STORE_CHOICES = [
        ('Croco nutrition', 'Croco Nutrition'),
        ('Croco wear', 'Croco Wear'),
        ('Croco team', 'Croco Team'),
    ]

    name = models.CharField(max_length=50, choices=STORE_CHOICES, unique=True)
    description = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to='store_images/', null=True, blank=True)  # Optional image for the store

    def __str__(self):
        return self.get_name_display()  # Shows the readable name of the store


# Vendor Model
class Vendor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mobile = models.PositiveBigIntegerField(unique=True, null=True)
    companyName = models.CharField(max_length=100, null=True)
    profile_img = models.ImageField(upload_to='Vendor_imgs/', null=True)
    address = models.CharField(max_length=255, default='default address')

    def __str__(self):
        return self.user.username


# Category Model
class Category(models.Model):
    title = models.CharField(max_length=200)
    detail = models.TextField(null=True)
    image = models.ImageField(upload_to='category_images/', null=True, blank=True)

    def __str__(self):
        return self.title


class Subcategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    title = models.CharField(max_length=200)
    detail = models.TextField(null=True)
    image = models.ImageField(upload_to='subcategory_images/', null=True, blank=True)

    def __str__(self):
        return self.title


# Product Model
class Product(models.Model):
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products', default=1)
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, related_name='products')
    Vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True)
    title = models.CharField(max_length=200)
    slug = models.CharField(max_length=300, unique=True, null=True)
    detail = models.TextField(null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tags = models.TextField(null=True)
    image = models.ImageField(upload_to='product_imgs/', null=True)
    demo_url = models.URLField(null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    discount = models.DecimalField(max_digits=5, decimal_places=0, default=0)

    def __str__(self):
        return self.title

    def tag_list(self):
        if self.tags:
            return self.tags.split(',')
        else:
            return []
        



# Buyer Model
class Buyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    mobile = models.CharField(max_length=15)
    address = models.CharField(max_length=255, default='default address')
    profile_img = models.ImageField(upload_to='buyer_imgs/', null=True)
    companyName = models.CharField(max_length=100, null=True)

    def __str__(self):
        return self.user.username


# Buyer Address Model
class BuyerAddress(models.Model):
    Buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='Buyer_addresses')
    address = models.TextField(null=True)
    default_address = models.BooleanField(default=False)

    def __str__(self):
        return self.address


# Order Model
class Order(models.Model):
    Buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='Buyer_orders')
    Order_time = models.DateTimeField(auto_now_add=True)
    Order_status = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.Order_time}'


# Order Items Model
class OrderItems(models.Model):
    Order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_items')
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    qty = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return self.Product.title


# Product Rating Model
class ProductRatings(models.Model):
    Buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE, related_name='ratings')
    Product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='Product_ratings')
    rating = models.IntegerField()
    reviews = models.TextField()
    add_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.rating} - {self.reviews}'


# Product Images Model
class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_imgs')
    image = models.ImageField(upload_to='product_imgs/', null=True)

    def __str__(self):
        if self.image:
            return self.image.url
        else:
            return f"No image for product image {self.pk}"


# Wishlist Model
class Wishlist(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    Buyer = models.ForeignKey(Buyer, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'WishList'

    def __str__(self):
        return f"{self.product.title} - {self.Buyer.user.first_name}"


# Notification Model
class Notification(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    status = models.CharField(max_length=100)
    message = models.TextField()

    def __str__(self):
        return self.message

