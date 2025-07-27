from pydantic import BaseModel
from typing import Optional, List

class user(BaseModel):
    user_id : Optional[int] = None
    phone : Optional[str] = None
    password : Optional[str] = None
    name : Optional[str] = None
    dob : Optional[str] = None 
    street : Optional[str] = None 
    area : Optional[str] = None 
    city : Optional[str] = None 
    pincode : Optional[str] = None
    mode : Optional[str] = None
 
class product(BaseModel):
    user_id : Optional[int] = None
    name : Optional[str] = None
    pro_id : Optional[int] = None
    key : Optional[str] = None
    spec_id : Optional[int] = None
    quantity : Optional[int] = None
    price : Optional[float] = None
    
class order(BaseModel):
    user_id: int
    mode: str  # card / upi / cash on delivery
    
class ProductSpec(BaseModel):
    size: str
    quantity: int

class AddProduct(BaseModel):
    pro_name: str
    pro_description: str
    fit: str
    category: str
    material: str
    sex: str
    price: float
    image_link: str
    specs: List[ProductSpec] 

class ProductRating(BaseModel):
    pro_id: int
    rating: float  