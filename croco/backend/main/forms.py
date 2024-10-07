
from django import forms

class VendorRegistrationForm(forms.Form):
    first_name = forms.CharField(max_length=100)
    last_name = forms.CharField(max_length=100)
    username = forms.CharField(max_length=100)
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    mobile = forms.CharField(max_length=20)
    address = forms.CharField(widget=forms.Textarea)
    companyName = forms.CharField(max_length=100)
