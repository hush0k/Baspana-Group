from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from . import config
from .routers import apartment, auth, commercial_unit, favorites, image, order, residential_complex, review, user, \
	building

app = FastAPI(title = "Baspana Group Backend API")


app.add_middleware(
	CORSMiddleware,
	allow_origins = [
		"http://localhost:3000",
		"http://frontend:3000",
		"http://127.0.0.1:3000"
	],
	allow_credentials = True,
	allow_methods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allow_headers = ["*"],
	expose_headers = ["*"],
	max_age = 3600,
)


app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(residential_complex.router, prefix="/api/complexes", tags=["Complexes"])
app.include_router(building.router, prefix="/api/buildings", tags=["Buildings"])
app.include_router(apartment.router, prefix="/api/apartments", tags=["Apartments"])
app.include_router(commercial_unit.router, prefix="/api/commercial_units", tags=["Commercial Units"])
app.include_router(image.router, prefix="/api/images", tags=["Images"])
app.include_router(order.router, prefix="/api/orders", tags=["Orders"])
app.include_router(favorites.router, prefix="/api/favorites", tags=["Favorites"])
app.include_router(review.router, prefix="/api/reviews", tags=["Reviews"])

@app.get("/")
async def root():
	return {"message": "Database is successfully started"}
