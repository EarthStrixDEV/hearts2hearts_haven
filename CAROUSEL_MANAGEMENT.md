# 🎠 Gallery Carousel Management System

ระบบจัดการรูปภาพ Gallery Showcase Carousel สำหรับหน้าแรกของเว็บไซต์ Hearts2Hearts Haven

## 📋 ฟีเจอร์ที่เพิ่มใหม่

### 🎯 **Gallery Carousel CMS Module**
- ✅ **จัดการรูปภาพ Carousel** ที่แสดงในหน้าแรก
- ✅ **เรียงลำดับรูปภาพ** ตามต้องการ
- ✅ **เปิด/ปิดการแสดงผล** รูปภาพแต่ละรูป
- ✅ **จัดหมวดหมู่รูปภาพ** (Performance, Promotional, Event, etc.)
- ✅ **ตัวอย่างรูปภาพแบบ Real-time** ในหน้าแก้ไข

### 🔗 **API Integration**
- ✅ **REST API** สำหรับ CRUD operations (`/api/carousel`)
- ✅ **JSON Database** (`cms-data/carousel.json`)
- ✅ **Dynamic Loading** ในหน้าแรกแทนการ hardcode

### 🎨 **DataTable Integration**
- ✅ **Row Selection** สำหรับลบหลายรูปพร้อมกัน
- ✅ **Search & Filter** ค้นหารูปภาพ
- ✅ **Sorting** เรียงตามคอลัมน์ต่างๆ
- ✅ **Responsive Design** ใช้งานได้ทุกอุปกรณ์

## 📁 ไฟล์ที่เพิ่ม/แก้ไข

### ✨ **ไฟล์ใหม่**
```
📁 cms-data/
  └── carousel.json                    # ข้อมูล Carousel Images

📁 app/api/carousel/
  └── route.ts                        # API endpoints

📁 app/cms/carousel/
  └── page.tsx                        # CMS Management Page
```

### 🔧 **ไฟล์ที่แก้ไข**
```
📁 app/
  └── page.tsx                        # หน้าแรก - ใช้ API แทน hardcode

📁 app/cms/
  └── page.tsx                        # Dashboard - เพิ่มลิงก์ Carousel
```

## 🚀 การใช้งาน

### 1. **เข้าสู่ CMS**
```
https://yourdomain.com/cms/carousel
```

### 2. **จัดการรูปภาพ**
- 🖼️ **เพิ่มรูปใหม่**: กดปุ่ม "เพิ่มรูปภาพใหม่"
- ✏️ **แก้ไขรูป**: กดปุ่ม "แก้ไข" ในแถวที่ต้องการ
- 🗑️ **ลบรูป**: เลือกรูปและกดปุ่ม "ลบที่เลือก"
- 🔍 **ค้นหา**: ใช้ช่องค้นหาด้านบน

### 3. **ฟิลด์ข้อมูล**
- **ชื่อรูปภาพ** (Required): ชื่อที่จะแสดงใน Carousel
- **URL รูปภาพ** (Required): ลิงก์รูปภาพ
- **หมวดหมู่**: Performance, Promotional, Event, etc.
- **ลำดับ**: เลขลำดับการแสดงผล (1, 2, 3, ...)
- **สถานะ**: เปิด/ปิดการแสดงผล
- **คำอธิบาย**: รายละเอียดเพิ่มเติม

## 🎯 API Endpoints

### GET `/api/carousel`
```json
// Response: Array of active carousel images sorted by order
[
  {
    "id": "1",
    "title": "Style Moment 🎤",
    "imageUrl": "https://...",
    "description": "Hearts2Hearts performing...",
    "category": "Performance",
    "order": 1,
    "isActive": true,
    "createdAt": "2025-11-02T10:00:00Z",
    "updatedAt": "2025-11-02T10:00:00Z"
  }
]
```

### POST `/api/carousel`
```json
// Request Body
{
  "title": "New Image Title",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Description...",
  "category": "Performance"
}
```

### PUT `/api/carousel`
```json
// Request Body
{
  "id": "1",
  "title": "Updated Title",
  "imageUrl": "https://example.com/new-image.jpg",
  "order": 2,
  "isActive": false
}
```

### DELETE `/api/carousel?id=1`
```json
// Response
{
  "message": "Carousel image deleted successfully"
}
```

## 🎨 หน้าแรก Integration

### Before (Hardcoded)
```jsx
<SwiperSlide>
  <Image src="https://hardcoded-url.jpg" />
  <h3>Hardcoded Title</h3>
</SwiperSlide>
```

### After (Dynamic)
```jsx
{carouselImages.map((image) => (
  <SwiperSlide key={image.id}>
    <Image src={image.imageUrl} />
    <h3>{image.title}</h3>
    <p>{image.description}</p>
  </SwiperSlide>
))}
```

## 📊 ข้อมูล JSON Structure

```json
{
  "id": "string",           // Unique identifier
  "title": "string",        // Display title
  "imageUrl": "string",     // Image URL
  "description": "string",  // Optional description
  "category": "string",     // Image category
  "order": "number",        // Display order
  "isActive": "boolean",    // Show/hide status
  "createdAt": "string",    // ISO date string
  "updatedAt": "string"     // ISO date string
}
```

## 🎯 หมวดหมู่ที่รองรับ

- 🎤 **Performance** - การแสดงบนเวที
- 📢 **Promotional** - รูปโปรโมท
- 🎉 **Event** - งานอีเวนต์
- 🤗 **Fan Event** - งานแฟนมีตติ้ง
- 🎬 **Behind the Scenes** - เบื้องหลัง
- 🎵 **Music Video** - มิวสิควิดีโอ

## 🔧 การปรับแต่ง

### เพิ่มหมวดหมู่ใหม่
```tsx
// ใน carousel/page.tsx
<option value="New Category">New Category</option>
```

### เปลี่ยนการเรียงลำดับ
```tsx
// ใน API route.ts
const sortedImages = carouselImages
  .filter(img => img.isActive)
  .sort((a, b) => a.order - b.order); // เรียงตาม order
```

### ปรับ Autoplay Speed
```tsx
// ใน page.tsx
autoplay={{
  delay: 3000, // 3 วินาที (เดิม 2000)
  disableOnInteraction: false,
}}
```

## 🎉 ผลลัพธ์

✅ **Admin สามารถจัดการรูปภาพ Carousel ได้อย่างง่ายดาย**
✅ **หน้าแรกแสดงรูปภาพแบบ Dynamic จาก CMS**
✅ **ระบบ Search, Sort, และ Bulk Actions ครบครัน**
✅ **ตัวอย่างรูปภาพแบบ Real-time**
✅ **API ที่ใช้งานง่ายและมีประสิทธิภาพ**

---

🎀 **Hearts2Hearts Haven CMS** - จัดการเนื้อหาได้อย่างมืออาชีพ! 💕
