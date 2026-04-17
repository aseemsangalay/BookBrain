import os
from dotenv import load_dotenv

load_dotenv()

# Supabase
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

# Clerk
CLERK_JWKS_URL = os.environ.get("CLERK_JWKS_URL", "")
CLERK_SECRET_KEY = os.environ.get("CLERK_SECRET_KEY", "")

# Anthropic (only required when AI_PROVIDER=anthropic)
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# App
CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:3000").split(",")
AUTH_MODE = os.environ.get("AUTH_MODE", "prod")  # "dev" skips JWT; "prod" validates Clerk JWT
