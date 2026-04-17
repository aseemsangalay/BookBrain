"""
BrainLog FastAPI application entrypoint.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import CORS_ORIGINS
from app.routes import router

app = FastAPI(
    title="BrainLog API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url=None,
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Error handler ─────────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": "internal_server_error", "message": str(exc), "status": 500},
    )


# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
