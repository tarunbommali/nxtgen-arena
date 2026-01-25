# 📅 Day 24: Testing Methodologies - Write Code That Works

**Module:** Cloud & DevOps (Days 21-25)  
**Time Required:** 2-3 hours  
**Difficulty:** ⭐⭐⭐⭐☆

---

## 🎯 Objectives

Master software testing:
- Unit tests, Integration tests, E2E tests
- Test-Driven Development (TDD)
- Code coverage
- Testing best practices

**Why testing?** Untested code = Unreliable code. Professional developers write tests!

---

## 📚 Theory (25 mins)

### **Testing Pyramid**

```
        /\
       /E2E\         ← Few (slow, expensive)
      /──────\
     /Integr─\      ← Some (medium speed)
    /──────────\
   /   Unit     \   ← Many (fast, cheap)
  /──────────────\
```

---

### **Types of Tests**

**1. Unit Tests:**
```python
# Test single function
def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5  # Pass
    assert add(-1, 1) == 0  # Pass
```

**2. Integration Tests:**
```python
# Test multiple components together
def test_api_and_database():
    response = client.post('/api/users', json={'name': 'Test'})
    assert response.status_code ==201
    
    # Check database updated
    user = db.query...
    assert user.name == 'Test'
```

**3. E2E (End-to-End):**
```python
# Test complete workflow
def test_user_registration_flow():
    1. Open browser
    2. Fill registration form
    3. Submit
    4. Verify email sent
    5. Click confirmation link
    6. Login successful
```

---

## 💻 Hands-On (90-100 mins)

### **Task 1: Unit Testing with pytest** (40 mins)

```python
# tests/test_models.py
import pytest
from app.models import User, Product, Order

class TestUser:
    def test_create_user(self):
        user = User(email="test@example.com", name="Test User")
        assert user.email == "test@example.com"
        assert user.is_active == True  # Default value
    
    def test_invalid_email(self):
        with pytest.raises(ValueError):
            User(email="invalid-email", name="Test")
    
    def test_password_hashing(self):
        user = User(email="test@example.com")
        user.set_password("password123")
        
        assert user.password_hash != "password123"  # Should be hashed
        assert user.check_password("password123") == True
        assert user.check_password("wrong") == False

class TestProduct:
    def test_product_price_validation(self):
        with pytest.raises(ValueError):
            Product(name="iPhone", price=-100)  # Negative price
    
    def test_stock_management(self):
        product = Product(name="iPhone", stock=10)
        product.decrease_stock(3)
        assert product.stock == 7
        
        with pytest.raises(ValueError):
            product.decrease_stock(10)  # Insufficient stock
```

**Run tests:**
```bash
pytest tests/ -v
pytest tests/ --cov=app --cov-report=html
# View coverage: open htmlcov/index.html
```

---

### **Task 2: Integration Testing (API + Database)** (30 mins)

```python
# tests/test_api.py
import pytest
from app import create_app, db

@pytest.fixture
def client():
    app = create_app('testing')
    
    with app.app_context():
        db.create_all()
        yield app.test_client()
        db.drop_all()

def test_complete_order_flow(client):
    # 1. Register user
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'Test@123',
        'name': 'Test User'
    })
    assert response.status_code == 201
    token = response.json['token']
    
    # 2. Create product (as admin)
    response = client.post('/api/products', 
        headers={'Authorization': f'Bearer {token}'},
        json={
            'name': 'iPhone 15',
            'price': 79999,
            'stock': 100
        })
    assert response.status_code == 201
    product_id = response.json['id']
    
    # 3. Add to cart
    response = client.post('/api/cart', 
        headers={'Authorization': f'Bearer {token}'},
        json={'product_id': product_id, 'quantity': 2})
    assert response.status_code == 200
    
    # 4. Place order
    response = client.post('/api/orders',
        headers={'Authorization': f'Bearer {token}'},
        json={'payment_method': 'UPI'})
    assert response.status_code == 201
    
    # 5. Verify stock decreased
    response = client.get(f'/api/products/{product_id}')
    assert response.json['stock'] == 98  # 100 - 2
```

---

### **Task 3: Test-Driven Development (TDD)** (20 mins)

**RED → GREEN → REFACTOR**

```python
# 1. RED: Write failing test first
def test_calculate_discount():
    assert calculate_discount(1000, 10) == 900  # FAILS (function doesn't exist)

# 2. GREEN: Write minimum code to pass
def calculate_discount(price, percent):
    return price - (price * percent / 100)

# Test passes! ✅

# 3. REFACTOR: Improve code
def calculate_discount(price: float, percent: float) -> float:
    """Calculate price after discount."""
    if not 0 <= percent <= 100:
        raise ValueError("Discount must be 0-100%")
    return round(price * (1 - percent/100), 2)

# All tests still pass! ✅
```

---

### **Task 4: Mocking External Services** (20 mins)

```python
# tests/test_external_services.py
from unittest.mock import patch, Mock
import requests

# Function to test
def send_sms(phone, message):
    response = requests.post('https://api.sms.com/send', 
        json={'phone': phone, 'message': message})
    return response.status_code == 200

# Test without calling real API
@patch('requests.post')
def test_send_sms(mock_post):
    # Mock the API response
    mock_response = Mock()
    mock_response.status_code = 200
    mock_post.return_value = mock_response
    
    # Test
    result = send_sms('9876543210', 'Test SMS')
    
    assert result == True
    mock_post.assert_called_once()
```

---

## ✅ Verification

- [ ] Written at least 10 unit tests
- [ ] Integration test for complete workflow
- [ ] Code coverage > 80%
- [ ] Understand TDD approach
- [ ] Can mock external dependencies

---

## 🚀 Wrap Up

**Tomorrow:** Day 25 - SDLC (Software Development Lifecycle) + Module 5 Complete!

[← Day 23: CI/CD](./Day%2023%20-%20CI-CD%20Pipeline.md) | [Day 25: SDLC →](./Day%2025%20-%20Software%20Development%20Lifecycle%20(SDLC).md)
