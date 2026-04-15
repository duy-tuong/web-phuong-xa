# ===== BUILD STAGE =====
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy file project trước (tối ưu cache)
COPY *.csproj ./
RUN dotnet restore

# Copy toàn bộ source
COPY . ./
RUN dotnet publish -c Release -o out

# ===== RUNTIME STAGE =====
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

COPY --from=build /app/out .

EXPOSE 80

ENTRYPOINT ["dotnet", "backend.dll"]