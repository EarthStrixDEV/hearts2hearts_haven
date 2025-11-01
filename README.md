# 💕 Hearts2Hearts Haven - H2H Fan Site

Welcome to **Hearts2Hearts Haven**, a beautiful fan-made website dedicated to the K-pop girl group **Hearts2Hearts (H2H)** and the amazing **S2U** fandom! 

![H2H Banner](https://img.shields.io/badge/H2H-Hearts2Hearts-FF69B4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ About Hearts2Hearts

Hearts2Hearts is an 8-member South Korean girl group that debuted on February 24, 2025, with the single "The Chase". The group consists of:

👑 **Jiwoo** (Leader, Main Dancer) • 🎤 **Carmen** (Main Vocalist) • ✨ **Yuha** (Visual) • 🎸 **Stella** (All-Rounder) • 🎵 **Juun** (Main Rapper) • 🍭 **A-na** (Maknae) • 😊 **Ian** (Mood Maker) • 🎶 **Ye-on** (Vocalist)

## 🎀 Website Features

This fan site includes:

- **🏠 Home Page**: Hero section with latest MV, quick links, and news updates
- **👭 Members Profile**: Detailed information about all 8 members with backstories, facts, and quotes
- **📸 Gallery**: Masonry grid layout with 100+ photos organized by category and member
- **🎵 Music & Videos**: YouTube embeds of all MVs, performances, and dance practices
- **📖 About**: Group history, fandom information, and discography
- **📅 Schedule**: Upcoming events, music show schedules, and voting deadlines
- **💌 Fan Corner**: Submit fanart, fanfic, and messages to H2H

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom pastel pink theme
- **Fonts**: Nunito & Noto Sans KR from Google Fonts
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages

## 🎨 Design Features

- **Pastel Pink Theme**: Beautiful gradient backgrounds (#FFB6C1 pastel pink palette)
- **Responsive Design**: Mobile-first approach, works perfectly on all devices
- **Smooth Animations**: Hover effects, transitions, and floating heart animations
- **Interactive Components**: Modal lightboxes, filters, search functionality
- **SEO Optimized**: Meta tags for better search engine visibility

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/hearts2hearts-haven.git
cd hearts2hearts-haven
```

2. Navigate to the project directory:
```bash
cd hearts2hearts_
```

3. Install dependencies:
```bash
npm install
# or
yarn install
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website!

## 📁 Project Structure

```
hearts2hearts_/
├── app/
│   ├── components/         # Reusable components
│   │   ├── Navigation.tsx  # Top navigation bar
│   │   └── Footer.tsx      # Footer with social links
│   ├── members/           # Members profile page
│   ├── gallery/           # Photo gallery page
│   ├── music/            # Music videos page
│   ├── about/            # About H2H page
│   ├── schedule/         # Schedule & events page
│   ├── contact/          # Fan corner page
│   ├── globals.css       # Global styles with custom CSS
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page
├── public/               # Static assets
├── package.json          # Dependencies
└── README.md            # You are here!
```

## 🎯 Key Pages

### Home Page
- Hero section with YouTube embed of latest performance
- Quick navigation cards to Members, Gallery, and Music
- Latest news section with recent updates
- Call-to-action buttons for Weverse and voting

### Members Page
- Interactive member cards with search functionality
- Detailed profiles with backstories, facts, and quotes
- Timeline of H2H's journey from trainee days to debut
- Modal popup for full member information

### Gallery Page
- Masonry grid layout (Pinterest-style)
- Filter by category (Predebut, Teasers, Music Shows, Behind the Scenes)
- Filter by member name
- Lightbox modal for full-size viewing

### Music Page
- YouTube embeds for all MVs and performances
- Filter by video type
- Complete discography with track listings
- Links to streaming platforms (Spotify, Apple Music, YouTube, Melon)

## 🌈 Color Palette

```css
--pastel-pink: #FFB6C1
--soft-pink: #FFC8D3
--light-pink: #FFE5EC
--soft-gray: #F5F5F5
--dark-gray: #6b6b6b
```

## 📱 Mobile Responsive

The website is fully responsive with breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🔗 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy! ✨

### Deploy to Netlify

1. Push your code to GitHub
2. Visit [netlify.com](https://netlify.com)
3. Connect your repository
4. Build command: `npm run build`
5. Publish directory: `.next`
6. Deploy! 🚀

### Deploy to GitHub Pages

1. Install `gh-pages` package
2. Add to `package.json`:
```json
"scripts": {
  "export": "next build && next export",
  "deploy": "gh-pages -d out"
}
```
3. Run `npm run export && npm run deploy`

## 🎉 Customization

### Changing Colors
Edit `globals.css` to change the color scheme:
```css
:root {
  --pastel-pink: #YOUR_COLOR;
  --soft-pink: #YOUR_COLOR;
}
```

### Adding More Members
Edit the `members` array in `app/members/page.tsx`

### Adding Photos to Gallery
Edit the `galleryImages` array in `app/gallery/page.tsx`

### Adding Videos
Edit the `videos` array in `app/music/page.tsx`

## 💖 Contributing

This is a fan-made project! If you want to contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ⚠️ Disclaimer

This is an **unofficial fan-made website** and is not affiliated with Hearts2Hearts, their agency, or any official entities. This project is created purely out of love and support for H2H and the S2U fandom.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

- **Hearts2Hearts (H2H)**: For being amazing and inspiring this project!
- **S2U Fandom**: For all the love and support
- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the beautiful styling system

## 💌 Contact

Created with 💕 by S2U for S2U

- Twitter: [@your_twitter](https://twitter.com/your_twitter)
- Instagram: [@your_instagram](https://instagram.com/your_instagram)
- Email: your.email@example.com

---

### 🎀 Stream FOCUS now! Support H2H! 

**Remember to vote for H2H at music shows and MAMA! Every vote counts, S2U! 🏆**

*"We've all been waiting for today" - Jiwoo* 💕
