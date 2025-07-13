# Sử dụng SDK image để build ứng dụng
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Đặt thư mục làm việc trong container là /src.
# Khi Render dùng Root Directory là SmokingSupport/, thì /src tương ứng với thư mục SmokingSupport trên Git.
WORKDIR /src

# Copy file .csproj của dự án WebSmokingSupport.
# Đường dẫn này phải tương đối từ WORKDIR hiện tại (/src).
# Vì WebSmokingSupport.csproj nằm trong thư mục con WebSmokingSupport, nên đường dẫn là WebSmokingSupport/WebSmokingSupport.csproj
COPY WebSmokingSupport/WebSmokingSupport.csproj ./WebSmokingSupport/

# Chạy lệnh restore các package NuGet cho dự án WebSmokingSupport.
# Đảm bảo lệnh này tham chiếu đúng đến file .csproj đã được copy vào container.
RUN dotnet restore WebSmokingSupport/WebSmokingSupport.csproj

# Copy toàn bộ mã nguồn từ thư mục hiện tại (SmokingSupport/ trên Git) vào WORKDIR (/src) trong container.
# Điều này sẽ copy cả thư mục WebSmokingSupport và các thư mục/file khác.
COPY . .

# Chạy lệnh publish ứng dụng WebSmokingSupport.
# Đảm bảo lệnh này tham chiếu đúng đến thư mục dự án chính.
# WORKDIR hiện tại là /src, nên đường dẫn đến dự án là WebSmokingSupport/.
# Thêm --no-restore để tránh restore lại nếu đã restore ở trên.
RUN dotnet publish WebSmokingSupport/WebSmokingSupport.csproj -c Release -o /app/publish --no-restore

# Sử dụng runtime image để chạy ứng dụng
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Đặt thư mục làm việc trong container là /app
WORKDIR /app

# Copy các file đã publish từ giai đoạn build vào runtime image
COPY --from=build /app/publish .

# Khai báo cổng mà ứng dụng sẽ lắng nghe
EXPOSE 80

# Lệnh khởi chạy ứng dụng
# Đảm bảo tên DLL (WebSmokingSupport.dll) là chính xác
ENTRYPOINT ["dotnet", "WebSmokingSupport.dll", "--urls", "http://+:80"]