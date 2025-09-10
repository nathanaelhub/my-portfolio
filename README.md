# Nathanael Johnson's Portfolio

This is Nathanael Johnson's personal portfolio website, built on the Magic Portfolio template. It showcases his work as an Applied AI graduate student, research projects, and technical skills.

**Live Site:** [nathanaelhub.github.io/my-portfolio](https://nathanaelhub.github.io/my-portfolio)

![Portfolio Preview](public/images/projects/mental-health-llm/cover.png)

## About This Portfolio

This portfolio features:
- **Mental Health LLM Evaluation** - Research on bias and fairness in Large Language Models for mental health applications
- **AI/ML Projects** - Including airline revenue optimization, F1 race prediction, portfolio optimization, and Airbnb analysis
- **Personal Information** - About page with education, experience, and technical skills
- **Photo Gallery** - Collection of personal photography and interests

## Technical Stack

Built with:
- **Next.js 15.5.2** - React framework with static export for GitHub Pages
- **Once UI** - Design system and components
- **MDX** - Content management for projects and blog posts
- **TypeScript** - Type-safe development
- **GitHub Pages** - Static hosting with automated deployment

## Getting Started

**1. Clone the repository**
```bash
git clone https://github.com/nathanaelhub/my-portfolio.git
cd my-portfolio
```

**2. Install dependencies**
```bash
npm install
```

**3. Run development server**
```bash
npm run dev
```

**4. Build for production**
```bash
npm run build
```

## Configuration

### Content Configuration
Edit personal information and content:
```
src/resources/content.tsx
```

### Site Configuration
Update site settings and styling:
```
src/resources/once-ui.config.ts
```

### Creating New Projects
Add new project pages:
```
src/app/work/projects/[your-project].mdx
```

### Creating Blog Posts
Add new blog posts:
```
src/app/blog/posts/[your-post].mdx
```

## GitHub Pages Deployment

This portfolio is configured for automatic deployment to GitHub Pages:

1. **Static Export**: The site uses Next.js static export (`output: "export"`) for GitHub Pages compatibility
2. **Base Path**: Production builds include `/my-portfolio` base path for GitHub Pages subdirectory
3. **GitHub Actions**: Automated deployment workflow in `.github/workflows/deploy.yml`
4. **Image Handling**: Custom image path utility for proper asset loading on GitHub Pages

### Manual Deployment

To deploy manually:
```bash
npm run build
git add .
git commit -m "Update portfolio"
git push origin main
```

The GitHub Action will automatically build and deploy to the `gh-pages` branch.

## Image Management

- **Avatar**: Replace `public/images/avatar.jpg` with your profile photo
- **Project Images**: Add project images to `public/images/projects/[project-name]/`
- **Gallery Images**: Add personal photos to `public/images/gallery/`
- **Favicon**: Update `public/favicon.png` with your personal icon

All images automatically include the correct base path for GitHub Pages deployment.

## Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── about/          # About page
│   ├── blog/           # Blog posts
│   ├── work/           # Project showcase
│   └── gallery/        # Photo gallery
├── components/         # Reusable UI components
├── resources/          # Content and configuration
└── utils/              # Utility functions
```

## Personal Branding

This portfolio represents Nathanael Johnson:
- **Role**: Applied AI Graduate Student at Lipscomb University
- **Location**: Saba, Netherlands Antilles
- **Interests**: AI applications in healthcare, finance, and data science
- **Contact**: njjohnson1@mail.lipscomb.edu

## Social Links

- **GitHub**: [nathanaelhub](https://github.com/nathanaelhub)
- **LinkedIn**: [nathanaeljdjohnson](https://www.linkedin.com/in/nathanaeljdjohnson/)
- **Medium**: [@nathanaeljdj](https://medium.com/@nathanaeljdj)
- **Twitter**: [@Natex07](https://x.com/Natex07)

## Credits

Built on the Magic Portfolio template by [Once UI](https://once-ui.com) for [Next.js](https://nextjs.org).

Original template creators:
- Lorant One: [Threads](https://www.threads.net/@lorant.one) / [LinkedIn](https://www.linkedin.com/in/lorant-one/)

## License

This portfolio follows the CC BY-NC 4.0 License from the original Magic Portfolio template.
- Attribution is required
- Commercial usage is not allowed
- Extends to [Dopler CC](https://dopler.app/license) with [Once UI Pro](https://once-ui.com/pricing) license

See `LICENSE.txt` for more information.