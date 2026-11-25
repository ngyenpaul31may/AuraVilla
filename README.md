# AuraVilla — Real Estate & Luxury Home Showcase

<p align="center">
  <b>Nền tảng giới thiệu các ngôi nhà, biệt thự và bất động sản cao cấp (Hỗ trợ đa ngôn ngữ i18n, mặc định Tiếng Anh)</b><br>
  <i>Houses, Villas &amp; Real Estate Showcase Platform (Multi-language i18n, English Default)</i>
</p>

<p align="center">
  <a href="https://github.com/ngyenpaul31may/AuraVilla"><img src="https://img.shields.io/badge/Repo-AuraVilla-2E6F6D?style=flat-square&logo=github" alt="Repository"></a>
  <img src="https://img.shields.io/badge/Branch-main-blue?style=flat-square" alt="Branch">
  <img src="https://img.shields.io/badge/Tech-HTML5%20%C2%B7%20CSS3%20%C2%B7%20Vanilla%20JS-orange?style=flat-square" alt="Tech Stack">
  <img src="https://img.shields.io/badge/i18n-EN%20Default-green?style=flat-square" alt="i18n English Default">
  <img src="https://img.shields.io/badge/Themes-Light%20%26%20Dark-121417?style=flat-square" alt="Light and Dark Themes">
</p>

---

## Giới thiệu (About)

**AuraVilla** là website tĩnh (HTML5 / CSS3 / Vanilla JavaScript) tập trung giới thiệu các ngôi nhà, biệt thự (villas) và sản phẩm bất động sản cao cấp. Trang web trình bày trực quan thông số bất động sản (diện tích, mặt bằng, tiện ích, thư viện ảnh không gian) cùng luồng đăng ký tư vấn / đặt lịch xem nhà, hỗ trợ đa ngôn ngữ (**i18n**) với **Tiếng Anh (`en`) làm ngôn ngữ mặc định**.

- **Trưng bày bất động sản:** Giới thiệu chi tiết từng căn nhà, biệt thự, điểm nhấn kiến trúc và tiện ích xung quanh kèm modal xem chi tiết.
- **Đa ngôn ngữ (i18n):** Kiến trúc i18n gọn nhẹ bằng Vanilla JS, mặc định hiển thị Tiếng Anh (`en`) và hỗ trợ chuyển đổi linh hoạt sang Tiếng Việt (`vi`) hoặc mở rộng thêm ngôn ngữ khác.
- **2 Giao diện Sáng & Tối (Light / Dark Themes):** Hỗ trợ chuyển đổi `data-theme="light" | "dark"` qua CSS tokens (`src/css/style.css`) và `src/js/theme.js`, lưu lựa chọn vào `localStorage` kèm fallback theo `prefers-color-scheme`.
- **Kiến trúc gọn nhẹ:** Không phụ thuộc framework nặng, dễ triển khai trên static hosting và tối ưu cho cả desktop lẫn di động.

---

## Đa ngôn ngữ (i18n — Multi-language)

- **Ngôn ngữ mặc định (Default locale):** English (`en`), khai báo `<html lang="en">`.
- **Cấu trúc bản dịch:** Các file JSON tách riêng trong `src/i18n/` (`en.json` làm chuẩn mặc định, `vi.json`, dễ dàng bổ sung ngôn ngữ mới).
- **Cơ chế hoạt động:** Vanilla JS i18n nhẹ qua thuộc tính `data-i18n` (và `data-i18n-placeholder` / `data-i18n-aria`), lưu lựa chọn ngôn ngữ vào `localStorage`, tự động fallback về `en` khi thiếu key.

---

## Cấu trúc thư mục (Repository Structure)

```text
AuraVilla/
├── src/
│   ├── assets/
│   │   └── images/       # Ảnh kiến trúc bất động sản (.png) & favicon.svg
│   ├── css/
│   │   └── style.css     # Hệ thống Design Tokens & Stylesheet
│   ├── i18n/
│   │   ├── en.json       # Bản dịch Tiếng Anh (ngôn ngữ mặc định)
│   │   └── vi.json       # Bản dịch Tiếng Việt
│   ├── js/
│   │   ├── i18n.js       # Bộ xử lý đa ngôn ngữ (data-i18n, localStorage, fallback về en)
│   │   ├── theme.js      # Bộ chuyển đổi 2 theme Sáng / Tối (localStorage & prefers-color-scheme)
│   │   └── main.js       # Bộ lọc bất động sản, modal chi tiết & form tư vấn / xem nhà
│   └── index.html        # Trang chủ Landing Page (lang="en")
└── README.md             # Tài liệu tổng quan dự án
```

---

## Lộ trình phát triển (Roadmap)

- [x] Khởi tạo Git repository (`main`) và tài liệu `README.md`.
- [x] Xây dựng nhận diện thương hiệu, bảng màu (Design Tokens) và nội dung giới thiệu nhà ở / biệt thự (ưu tiên bản gốc Tiếng Anh).
- [x] Thiết kế & hoàn thiện giao diện Landing Page responsive (`src/index.html`, `src/css/style.css`).
- [x] Xây dựng hệ thống đa ngôn ngữ `i18n` mặc định Tiếng Anh (`en`), hỗ trợ Tiếng Việt (`vi`) và nút chuyển ngôn ngữ (`src/i18n/`, `src/js/i18n.js`).
- [x] Xây dựng danh mục sản phẩm nhà/biệt thự, bộ lọc theo nhu cầu & biểu mẫu đăng ký tư vấn / xem nhà (`src/js/main.js`).
- [ ] Tích hợp backend/CRM thực tế cho biểu mẫu nhận tư vấn & tối ưu nâng cao nếu cần.

---

## Cài đặt & Sử dụng (Getting Started)

```bash
git clone https://github.com/ngyenpaul31may/AuraVilla.git
cd AuraVilla
```

Chạy qua một static server cục bộ để `fetch` các file `src/i18n/*.json` hoạt động ổn định và xem trước giao diện:

```bash
npx serve src
# hoặc
python -m http.server 8000 --directory src
```

---

## Liên kết (Repository)

- **GitHub:** [ngyenpaul31may/AuraVilla](https://github.com/ngyenpaul31may/AuraVilla)
