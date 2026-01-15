from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware

from . import config
from .routers import (
    ai_assistant,
    apartment,
    auth,
    building,
    commercial_unit,
    favorites,
    image,
    infrastructure,
    order,
    panorama,
    promotion,
    residential_complex,
    review,
    user,
    wallet,
)

app = FastAPI (title = "Baspana Group Backend API")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print("Validation error details:")
    print(exc.errors())
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()},
    )

class EmptyStringToNoneMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.query_params:
            query_params = dict(request.query_params)
            filtered_params = {k: v if v != '' else None for k, v in query_params.items()}
            from starlette.datastructures import QueryParams
            request._query_params = QueryParams([(k, v) for k, v in filtered_params.items() if v is not None])
        return await call_next(request)

app.add_middleware(EmptyStringToNoneMiddleware)

app.add_middleware (
	CORSMiddleware,
	allow_origins = [
		"http://localhost:3000",
		"http://frontend:3000",
		"http://127.0.0.1:3000",
		"http://localhost:3001",
		"http://127.0.0.1:3001"
	],
	allow_credentials = True,
	allow_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allow_headers = ["*"],
	expose_headers = ["*"],
	max_age = 3600,
)

app.include_router (auth.router, prefix = "/api/auth", tags = ["Authentication"])
app.include_router (user.router, prefix = "/api/users", tags = ["Users"])
app.include_router (residential_complex.router, prefix = "/api/complexes", tags = ["Complexes"])
app.include_router (building.router, prefix = "/api/buildings", tags = ["Buildings"])
app.include_router (apartment.router, prefix = "/api/apartments", tags = ["Apartments"])
app.include_router (commercial_unit.router, prefix = "/api/commercial_units", tags = ["Commercial Units"])
app.include_router (image.router, prefix = "/api/images", tags = ["Images"])
app.include_router (infrastructure.router, prefix = "/api/infrastructure", tags = ["Infrastructure"])
app.include_router (order.router, prefix = "/api/orders", tags = ["Orders"])
app.include_router (favorites.router, prefix = "/api/favorites", tags = ["Favorites"])
app.include_router (review.router, prefix = "/api/reviews", tags = ["Reviews"])
app.include_router (wallet.router, prefix = "/api/wallet", tags = ["Wallet"])
app.include_router (promotion.router, prefix = "/api/promotions", tags = ["Promotions"])
app.include_router (panorama.router, prefix = "/api/panoramas", tags = ["Panoramas"])
app.include_router (ai_assistant.router, prefix = "/api", tags = ["AI Assistant"])


@app.get ("/")
async def root ():
	return {"message": "Database is successfully started"}
