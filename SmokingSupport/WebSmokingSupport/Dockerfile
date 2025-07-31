FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY WebSmokingSupport.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 80
# Đã sửa đổi để ép ứng dụng lắng nghe trên cổng 80
ENTRYPOINT ["dotnet", "WebSmokingSupport.dll", "--urls", "http://+:80"]
