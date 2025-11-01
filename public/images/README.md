# 📸 Images Folder

## วิธีใช้งาน

วางรูปของน้องๆ Hearts2Hearts ในโฟลเดอร์นี้ แล้วอ้างอิงใน code ด้วย `/images/filename.jpg`

## แนะนำ

### สำหรับ Hero Background (หน้าแรก)
- **ชื่อไฟล์**: `h2h-group.jpg` หรือ `h2h-hero-bg.jpg`
- **ขนาด**: 1600px x 400px ขึ้นไป
- **Format**: JPG หรือ PNG
- **คำอธิบาย**: รูปกลุ่มน้องๆ 8 คน แถวเรียงหนึ่งแถว

### สำหรับ Member Profiles
- **ชื่อไฟล์**: `jiwoo.jpg`, `carmen.jpg`, `yuha.jpg`, etc.
- **ขนาด**: 400px x 500px ขึ้นไป
- **Format**: JPG หรือ PNG
- **คำอธิบาย**: รูปโปรไฟล์แต่ละคน

### สำหรับ Gallery
- **ชื่อไฟล์**: `gallery-01.jpg`, `gallery-02.jpg`, etc.
- **ขนาด**: ตามต้นฉบับ (จะ optimize อัตโนมัติ)
- **Format**: JPG หรือ PNG
- **คำอธิบาย**: รูปจาก predebut, teasers, music shows, BTS

## ตัวอย่าง Structure

```
public/images/
├── h2h-group.jpg          # Hero background
├── members/
│   ├── jiwoo.jpg
│   ├── carmen.jpg
│   ├── yuha.jpg
│   ├── stella.jpg
│   ├── juun.jpg
│   ├── ana.jpg
│   ├── ian.jpg
│   └── yeon.jpg
├── gallery/
│   ├── predebut/
│   ├── teasers/
│   ├── music-shows/
│   └── bts/
└── README.md             # คุณอยู่ที่นี่!
```

## 💡 Tips

1. ใช้ tools เช่น TinyPNG หรือ Squoosh เพื่อ compress รูปก่อน upload
2. ตั้งชื่อไฟล์ให้สื่อความหมาย (ใช้ lowercase และ hyphen)
3. Next.js จะ optimize รูปอัตโนมัติเมื่อใช้ Image component
4. เก็บ original files ไว้ที่อื่นเป็น backup

---

💕 Made with love for H2H & S2U

