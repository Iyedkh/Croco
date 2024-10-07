from django.contrib import admin
from . import models

class StoreAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']


admin.site.register(models.Store, StoreAdmin)

# Register Vendor model
admin.site.register(models.Vendor)

# Category Admin
class SubcategoryInline(admin.StackedInline):
    model = models.Subcategory
    extra = 1  # Number of extra subcategory forms to display

class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title']
    inlines = [SubcategoryInline]

admin.site.register(models.Category, CategoryAdmin)

# Buyer Admin
class BuyerAdmin(admin.ModelAdmin):
    list_display = ['get_username', 'mobile']

    def get_username(self, obj):
        """Returns the username of the buyer."""
        return obj.user.username

    get_username.short_description = 'Username'

admin.site.register(models.Buyer, BuyerAdmin)

# Product Image Inline Admin
class ProductImagesInline(admin.StackedInline):
    model = models.ProductImage

# Product Admin
class ProductAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ProductImagesInline]
    list_display = ['title', 'store', 'subcategory', 'price', 'quantity']

admin.site.register(models.Product, ProductAdmin)

# Order Admin
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'Buyer', 'Order_time', 'Order_status']

admin.site.register(models.Order, OrderAdmin)

# Wishlist Admin
class WishlistAdmin(admin.ModelAdmin):
    list_display = ['id', 'product', 'Buyer']

admin.site.register(models.Wishlist, WishlistAdmin)

# Subcategory Admin
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category']

admin.site.register(models.Subcategory, SubcategoryAdmin)

# Unregister models if they were previously registered
try:
    admin.site.unregister(models.BuyerAddress)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(models.OrderItems)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(models.ProductRatings)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(models.ProductImage)
except admin.sites.NotRegistered:
    pass

try:
    admin.site.unregister(models.Order)
except admin.sites.NotRegistered:
    pass
