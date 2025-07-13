# ----- Build stage -----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj file và restore
COPY WebSmokingSupport.csproj ./
RUN dotnet restore

# Copy toàn bộ mã nguồn và publish
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# ----- Runtime stage -----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

COPY --from=build /app/publish .

# Mở port 80 (nếu dùng port khác thì sửa)
EXPOSE 80

# Chạy ứng dụng
ENTRYPOINT ["dotnet", "WebSmokingSupport.dll"]
