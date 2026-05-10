import pytest
from app import app

@pytest.fixture
def client():
    # Flask provides a test client for simulating requests
    with app.test_client() as client:
        yield client

def test_homepage(client):
    # Replace "/" with the route you want to test
    response = client.get("/")
    assert response.status_code == 200
