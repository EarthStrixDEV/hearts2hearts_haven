# 🎨📸🎥 Enhanced Email System with Image Upload & YouTube Embed

## ✅ New Features Added

### 📸 **Image Upload Support**
- **File Upload Field**: Users can attach images to their submissions
- **Supported Formats**: JPG, PNG, GIF (Max 5MB)
- **Email Display**: Images are embedded directly in the email with beautiful styling
- **Attachment**: Original image file is also attached to the email

### 🎥 **YouTube Embed Support**
- **YouTube URL Field**: Users can paste YouTube video links
- **Smart Detection**: Automatically extracts video ID from various YouTube URL formats
- **Embedded Player**: YouTube videos are embedded directly in the email
- **Fallback Link**: "Watch on YouTube" link provided for email clients that don't support embeds

## 🔧 **Technical Implementation**

### **Contact Form Updates** (`hearts2hearts_/app/contact/page.tsx`)
```typescript
// New form state
const [formData, setFormData] = useState({
  name: "",
  email: "",
  type: "fanart",
  message: "",
  image: null as File | null,        // NEW
  youtubeUrl: "",                    // NEW
});

// File upload handler
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;
  setFormData({ ...formData, image: file });
};

// YouTube URL handler
const handleYouTubeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData({ ...formData, youtubeUrl: e.target.value });
};
```

### **API Route Updates** (`hearts2hearts_/app/api/send-email/route.ts`)
```typescript
// FormData handling instead of JSON
const formData = await request.formData();
const image = formData.get('image') as File | null;
const youtubeUrl = formData.get('youtubeUrl') as string;

// Image processing
if (image && image.size > 0) {
  const imageBuffer = await image.arrayBuffer();
  imageBase64 = Buffer.from(imageBuffer).toString('base64');
  imageAttachment = {
    filename: image.name,
    content: Buffer.from(imageBuffer),
    contentType: image.type,
    cid: 'submitted-image'
  };
}

// YouTube ID extraction
function extractYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
```

## 🎨 **Enhanced Email Template**

### **Image Display**
```html
${imageBase64 ? `
  <div class="field">
    <div class="field-label">📸 Attached Image</div>
    <div class="image-container">
      <img src="data:${image?.type || 'image/jpeg'};base64,${imageBase64}" 
           alt="Submitted image" />
    </div>
  </div>
` : ''}
```

### **YouTube Embed**
```html
${youtubeEmbedHtml}
<!-- Generates: -->
<div class="field">
  <div class="field-label">🎥 YouTube Video</div>
  <div class="youtube-container">
    <iframe width="100%" height="315" 
            src="https://www.youtube.com/embed/${youtubeId}" 
            frameborder="0" allowfullscreen>
    </iframe>
    <p><a href="${youtubeUrl}" target="_blank">Watch on YouTube</a></p>
  </div>
</div>
```

## 📧 **Email Features**

### **Visual Enhancements**
- **Baby Blue Theme**: Consistent with site design
- **Responsive Images**: Auto-resize for email clients
- **YouTube Embeds**: Interactive video players
- **Professional Layout**: Clean, organized presentation
- **Shadow Effects**: Subtle shadows on images for depth

### **Content Organization**
- **Sender Information**: Name, email, subject
- **Message Content**: Formatted text with line breaks
- **Attached Image**: Embedded with proper styling
- **YouTube Video**: Embedded player with fallback link
- **Footer**: Professional branding

## 🚀 **Usage Examples**

### **Fanart Submission**
1. User selects "🎨 Fanart" type
2. Uploads their artwork image
3. Adds description in message
4. Submits → Email includes embedded image

### **Cover Video Submission**
1. User selects "🎵 Song Cover" type
2. Pastes YouTube video URL
3. Adds description
4. Submits → Email includes embedded YouTube player

### **Mixed Media Submission**
1. User can upload both image AND YouTube link
2. Both are displayed in the email
3. Perfect for showcasing multiple works

## 📱 **Responsive Design**

- **Mobile Friendly**: Forms work on all devices
- **Email Compatibility**: Works across email clients
- **Image Optimization**: Auto-resize for email display
- **YouTube Responsive**: Embeds scale properly

## 🔒 **Security & Validation**

- **File Type Validation**: Only image files accepted
- **Size Limits**: 5MB maximum file size
- **URL Validation**: YouTube URL format checking
- **XSS Protection**: Proper HTML escaping

## 🎉 **Ready to Use!**

The enhanced email system now supports:
- ✅ Image uploads with email embedding
- ✅ YouTube video embeds
- ✅ Beautiful baby blue themed templates
- ✅ Professional email formatting
- ✅ Mobile responsive design
- ✅ Multiple submission types

Users can now submit rich media content that will be beautifully displayed in emails sent to `warapon.jitsook@gmail.com`!
