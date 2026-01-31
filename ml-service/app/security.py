import os
import hmac
import hashlib
import time
import logging
from fastapi import Request, HTTPException, Security, Depends
from fastapi.security.api_key import API_KEY_HEADER, API_KeyHeader
from starlette.status import HTTP_403_FORBIDDEN

# Setup AI Audit Logger
logging.basicConfig(level=logging.INFO)
audit_logger = logging.getLogger("ML_SECURITY_AUDIT")

# 1. API Key Configuration
# In production, these would be in .env
ML_API_KEY = os.getenv("ML_SERVICE_API_KEY", "agrolink_secure_ml_key_2026")
ML_SECRET_KEY = os.getenv("ML_SERVICE_SECRET", "super_secret_ml_protection_code")

API_KEY_NAME = "X-ML-API-Key"
api_key_header = API_KeyHeader(name=API_KEY_NAME, auto_error=False)

async def validate_api_key(api_key: str = Security(api_key_header)):
    """
    Ensures the request comes from an authorized caller (Node.js Backend).
    """
    if api_key == ML_API_KEY:
        return api_key
    
    audit_logger.warning(f"API KEY VIOLATION: Invalid key from unknown source.")
    raise HTTPException(
        status_code=HTTP_403_FORBIDDEN, 
        detail="Unauthorized: ML Model Access Denied. Invalid API Key."
    )

async def verify_signature(request: Request):
    """
    HMAC Signature Verification Policy.
    Protects against Request Tampering and Replay Attacks.
    
    Formula: HMAC_SHA256(Secret, Timestamp + RequestPath + Body)
    """
    signature = request.headers.get("X-ML-Signature")
    timestamp = request.headers.get("X-ML-Timestamp")
    
    if not signature or not timestamp:
        raise HTTPException(status_code=403, detail="Security Violation: Missing Signature or Timestamp.")

    # 1. Expiration Check (Prevent Replay Attacks - 5 minute window)
    current_time = int(time.time())
    if abs(current_time - int(timestamp)) > 300:
        raise HTTPException(status_code=403, detail="Security Violation: Request Expired (Timestamp Mismatch).")

    # 2. Get Raw Body for Hashing
    body = await request.body()
    body_str = body.decode() if body else ""
    
    # 3. Reconstruct Payload String
    # Note: Path is included to ensure signature is unique per endpoint
    payload = f"{timestamp}{request.url.path}{body_str}"
    
    # 4. Compute HMAC
    expected_signature = hmac.new(
        ML_SECRET_KEY.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()

    # 5. Constant-time comparison to prevent timing attacks
    if not hmac.compare_digest(signature, expected_signature):
        # We log this for audit purposes
        audit_logger.critical(f"TAMPERING DETECTED: Signature mismatch from IP {request.client.host} on path {request.url.path}")
        raise HTTPException(status_code=403, detail="Security Violation: Request Signature Mismatch. Data may be tampered.")

    audit_logger.info(f"Model Access Verified: Valid signature received for {request.url.path}")
    return True

# Simple In-Memory Rate Limiter for Project Demonstration
# In a production environment, use Redis with slowapi
class SimpleRateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.limits = {} # {ip: [timestamps]}
        self.max_requests = requests_per_minute

    def check_rate(self, ip: str):
        now = time.time()
        # Clean old timestamps
        if ip not in self.limits:
            self.limits[ip] = []
        
        self.limits[ip] = [t for t in self.limits[ip] if now - t < 60]
        
        if len(self.limits[ip]) >= self.max_requests:
            return False
        
        self.limits[ip].append(now)
        return True

limiter = SimpleRateLimiter(requests_per_minute=20)

async def rate_limit(request: Request):
    """
    Throttles requests to prevent ML Model Scraping and Brute-Force Abuse.
    """
    client_ip = request.client.host
    if not limiter.check_rate(client_ip):
        audit_logger.error(f"RATE LIMIT EXCEEDED: Defensive throttling active for IP {client_ip}")
        raise HTTPException(
            status_code=429, 
            detail="Rate Limit Exceeded: Protection Protocol Active. Please slow down inference requests."
        )
    return True
