from fastapi import FastAPI


from .routers import apartment, auth, commercial_unit, residential_complex, user, building

app = FastAPI(title = "Baspana Group Backend API")

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(user.router, prefix="/api/users", tags=["Users"])
app.include_router(residential_complex.router, prefix="/api/complexes", tags=["Complexes"])
app.include_router(building.router, prefix="/api/buildings", tags=["Buildings"])
app.include_router(apartment.router, prefix="/api/apartments", tags=["Apartments"])
app.include_router(commercial_unit.router, prefix="/api/commercial_units", tags=["Commercial Units"])

@app.get("/")
async def root():
	return {"message": "Database is successfully started"}
