# PIRRO – Germany Used Bicycle Inspection & Mobile Diagnostics Platform

## 1. პროექტის შესახებ (Project Overview)
**PIRRO** არის ციფრული მარკეტპლეისი, რომელიც გერმანიის ბაზარზე (ბერლინი, მიუნხენი, ჰამბურგი, ფრანკფურტი) აკავშირებს მყიდველებს სერტიფიცირებულ მობილურ ექსპერტებთან. პლატფორმა უზრუნველყოფს ორ ძირითად სერვისს:
* მეორადი მექანიკური ველოსიპედების ყიდვამდელ სრულ დიაგნოსტიკასა და შერჩევას.
* გზაში მცირე მექანიკური ხარვეზების ოპერატიულ აღმოფხვრასა და მობილურ დახმარებას.

## 2. ტექნოლოგიური სტეკი (Tech Stack)
პროექტი აგებულია მოდერნული ვებ-ტექნოლოგიებით:
* **Frontend:** React (Functional Components, Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`), JSX.
* **Build Tool:** Vite (სწრაფი ბილდისა და მოდულიანი განახლებისთვის).
* **Styling:** Tailwind CSS, მორგებული CSS სტილები და მინისეფექტიანი (**Glassmorphism**) დიზაინი.
* **Icons:** Lucide React.
* **State & Persistence:** Context API (Language, Theme, Auth) და ბრაუზერის `LocalStorage` უსაფრთხოების `try...catch` მექანიზმებით.
* **Version Control:** Git & GitHub.

## 3. პროექტის ფაილების არქიტექტურა (Folder Structure)
```text
src/
├── assets/          # გრაფიკული და ვიზუალური ფაილები (E-Bike.webp და სხვ.)
├── components/      # მცირე რეუსებადი კომპონენტები (ჩატი, რუკა, ენისა და თემის ღილაკები)
├── context/         # გლობალური კონტექსტები (LanguageContent, ThemeContent, Auth)
├── data/            # დემო მონაცემები (demolnspectors.js - ექსპერტების ბაზა)
├── i18n/            # მრავალენოვანი ლექსიკონები (translation.js - EN, DE, GE)
├── pages/           # ძირითადი გვერდები (Home, Contract, About, Contact)
├── utils/           # დამხმარე ფუნქციები (localStorage.js)
├── App.jsx          # მთავარი აპლიკაციის კომპონენტი და როუტინგი
├── main.css / index.css # ძირითადი სტილები და Tailwind კონფიგურაცია
└── main.jsx         # აპლიკაციის შესასვლელი წერტილი და პროვაიდერები