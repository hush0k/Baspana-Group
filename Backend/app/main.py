from fastapi import FastAPI

from .routers import auth, complexes, properties, user

app = FastAPI(title = "Baspana Group Backend API")

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(properties.router, prefix="/api/properties", tags=["Properties"])
app.include_router(complexes.router, prefix="/api/complexes", tags=["Complexes"])


@app.get("/")
async def root():
	return {"message": "Database is successfully started"}
