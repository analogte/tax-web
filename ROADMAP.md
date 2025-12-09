# 💼 Business Accounting Mode - Implementation Roadmap

## 📋 Overview

แอป "ภาษีเรื่องง่าย" จะเพิ่มโหมดธุรกิจ/ค้าขาย สำหรับ:
- บันทึกรายรับ/รายจ่าย
- เก็บหลักฐานดิจิทัล (รูปใบเสร็จ)
- จัดการลูกค้า/ลูกหนี้/เจ้าหนี้
- รายงานสรุป + เชื่อมโยงภาษี
- Subscription model สร้างรายได้

---

## 🗓️ Phase 1: รายรับ/รายจ่ายพื้นฐาน (Week 1-2)

### Database Schema
- [ ] สร้าง `transactions` table (id, type, amount, category, date, note, created_at)
- [ ] สร้าง `categories` table (id, name, type, icon, color)
- [ ] เพิ่ม default categories (ขายสินค้า, ค่าวัตถุดิบ, ค่าขนส่ง, ฯลฯ)

### UI - หน้าหลักธุรกิจ
- [ ] สร้าง `BusinessModeScreen` - หน้าหลักโหมดธุรกิจ
- [ ] แสดงสรุปยอด (รายรับ, รายจ่าย, คงเหลือ)
- [ ] แสดงรายการล่าสุด 10 รายการ
- [ ] ปุ่มเพิ่มรายรับ/รายจ่าย

### UI - เพิ่มรายการ
- [ ] สร้าง `AddTransactionSheet` (bottom sheet)
- [ ] เลือกประเภท (รายรับ/รายจ่าย)
- [ ] กรอกจำนวนเงิน
- [ ] เลือกหมวดหมู่
- [ ] เลือกวันที่
- [ ] หมายเหตุ (optional)

### Navigation
- [ ] เพิ่มปุ่มเข้าโหมดธุรกิจใน CoverScreen หรือ CalculatorScreen
- [ ] Tab navigation (สรุป, รายการ, รายงาน)

---

## 🗓️ Phase 2: แนบรูป + รายงาน (Week 3)

### แนบรูปภาพ/หลักฐาน
- [ ] เพิ่ม `image_path` column ใน transactions
- [ ] ใช้ `image_picker` package
- [ ] ถ่ายรูป / เลือกจาก gallery
- [ ] แสดง thumbnail ในรายการ
- [ ] กดดูรูปเต็มจอ

### รายงาน
- [ ] สร้าง `ReportScreen`
- [ ] สรุปรายวัน (วันนี้, เมื่อวาน)
- [ ] สรุปรายเดือน (เลือกเดือน)
- [ ] สรุปรายปี
- [ ] กราฟแท่ง รายรับ vs รายจ่าย
- [ ] กราฟ pie หมวดหมู่ค่าใช้จ่าย

---

## 🗓️ Phase 3: ลูกค้า/ลูกหนี้/เจ้าหนี้ (Week 4)

### Database
- [ ] สร้าง `contacts` table (id, name, phone, type, note)
- [ ] สร้าง `debts` table (id, contact_id, amount, type, due_date, status)
- [ ] เพิ่ม `contact_id` column ใน transactions

### UI - รายชื่อ
- [ ] สร้าง `ContactsScreen`
- [ ] แท็บ: ลูกค้า / เจ้าหนี้ / ลูกหนี้
- [ ] เพิ่ม/แก้ไข/ลบ contact
- [ ] ค้นหา contact

### UI - หนี้สิน
- [ ] สร้าง `DebtsScreen`
- [ ] แสดงหนี้ค้างรับ (ลูกหนี้)
- [ ] แสดงหนี้ค้างจ่าย (เจ้าหนี้)
- [ ] ทำเครื่องหมาย "ชำระแล้ว"
- [ ] แจ้งเตือนหนี้ใกล้ครบกำหนด

---

## 🗓️ Phase 4: Cloud Sync + Subscription (Week 5-6)

### Backend Setup
- [ ] เลือก: Firebase / Supabase
- [ ] สร้าง project และ database
- [ ] Authentication (Email/Google)

### Sync
- [ ] สร้าง `SyncService`
- [ ] Sync transactions ขึ้น cloud
- [ ] Sync contacts ขึ้น cloud
- [ ] Sync รูปภาพ (Cloud Storage)
- [ ] Offline-first: ใช้ได้แม้ไม่มี internet

### Subscription
- [ ] เลือก: RevenueCat / In-App Purchase
- [ ] แผน Free: 50 รายการ/เดือน, ไม่ sync
- [ ] แผน Premium: ไม่จำกัด, cloud sync, backup
- [ ] สร้าง `PaywallScreen`
- [ ] ตรวจสอบสถานะ subscription

---

## 🗓️ Phase 5: OCR สแกนใบเสร็จ (Week 7-8)

### OCR Setup
- [ ] ใช้ Google ML Kit Text Recognition
- [ ] เพิ่ม `google_mlkit_text_recognition` package

### ฟังก์ชัน
- [ ] สแกนใบเสร็จ → ดึงข้อความ
- [ ] ตรวจจับ: วันที่, จำนวนเงิน, ร้านค้า
- [ ] Auto-fill ข้อมูลลงฟอร์ม
- [ ] ผู้ใช้ตรวจสอบและยืนยัน

### Premium Feature
- [ ] OCR เป็นฟีเจอร์ Premium เท่านั้น

---

## 🔗 เชื่อมโยงกับภาษี

### After Phase 1-2
- [ ] ดึงรายได้จาก transactions → คำนวณภาษี
- [ ] แสดง "รายได้จากธุรกิจ" ใน CalculatorScreen
- [ ] คำนวณค่าใช้จ่าย 60% (หักแบบเหมา) หรือตามจริง

---

## 📊 Database Schema (ตัวอย่าง)

```sql
-- รายการรายรับ/รายจ่าย
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY,
  type TEXT NOT NULL, -- 'income' | 'expense'
  amount REAL NOT NULL,
  category_id INTEGER,
  contact_id INTEGER,
  date TEXT NOT NULL,
  note TEXT,
  image_path TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- หมวดหมู่
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'income' | 'expense'
  icon TEXT,
  color TEXT
);

-- รายชื่อ (ลูกค้า/เจ้าหนี้/ลูกหนี้)
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  type TEXT NOT NULL, -- 'customer' | 'creditor' | 'debtor'
  note TEXT
);

-- หนี้สิน
CREATE TABLE debts (
  id INTEGER PRIMARY KEY,
  contact_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL, -- 'receivable' | 'payable'
  due_date TEXT,
  status TEXT DEFAULT 'pending', -- 'pending' | 'paid'
  note TEXT
);
```

---

## 📱 UI Preview (Phase 1)

```
┌─────────────────────────────────────┐
│  💼 ธุรกิจของฉัน          [+ เพิ่ม] │
├─────────────────────────────────────┤
│                                     │
│   รายรับเดือนนี้    +45,000 บาท     │
│   รายจ่ายเดือนนี้   -18,000 บาท     │
│   ────────────────────────          │
│   คงเหลือ          +27,000 บาท      │
│                                     │
├─────────────────────────────────────┤
│  📋 รายการล่าสุด                     │
│                                     │
│  [🛒] ขายสินค้า       +1,500   วันนี้│
│  [📦] ค่าวัตถุดิบ       -800   วันนี้│
│  [🚚] ค่าขนส่ง          -150   เมื่อวาน│
│  [🛒] ขายสินค้า       +2,300   เมื่อวาน│
│                                     │
│         [ดูทั้งหมด]                  │
└─────────────────────────────────────┘
```

---

## ✅ สถานะปัจจุบัน

| Phase | สถานะ |
|-------|--------|
| Phase 1 | ⏳ รอเริ่ม |
| Phase 2 | ⏳ รอ |
| Phase 3 | ⏳ รอ |
| Phase 4 | ⏳ รอ |
| Phase 5 | ⏳ รอ |
