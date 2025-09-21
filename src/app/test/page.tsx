import { Media } from '@/components';
import { getImagePath } from '@/utils/image';

export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>🧪 Minimal Test Page</h1>
      <p>This is a static test page to isolate deployment issues.</p>
      
      <hr style={{ margin: '2rem 0' }} />
      
      <h2>Test 1: Regular IMG Tag (Raw Path)</h2>
      <img 
        src="/images/avatar.jpg" 
        alt="Avatar - Raw Path" 
        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid red' }}
      />
      <p>Status: <span id="test1">❓ Loading...</span></p>
      
      <h2>Test 2: Regular IMG Tag (getImagePath)</h2>
      <img 
        src={getImagePath("/images/avatar.jpg")} 
        alt="Avatar - getImagePath" 
        style={{ width: '100px', height: '100px', objectFit: 'cover', border: '2px solid blue' }}
      />
      <p>Status: <span id="test2">❓ Loading...</span></p>
      
      <h2>Test 3: Media Component</h2>
      <Media 
        src="/images/gallery/horizontal-1.jpg"
        alt="Gallery Image"
        style={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid green' }}
      />
      <p>Status: <span id="test3">❓ Loading...</span></p>
      
      <h2>Test 4: Gallery Image (Raw Path)</h2>
      <img 
        src="/images/gallery/horizontal-2.jpg" 
        alt="Gallery - Raw Path" 
        style={{ width: '200px', height: '150px', objectFit: 'cover', border: '2px solid orange' }}
      />
      <p>Status: <span id="test4">❓ Loading...</span></p>
      
      <hr style={{ margin: '2rem 0' }} />
      
      <h2>URL Information</h2>
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
        <p><strong>Current URL:</strong> <span id="currentUrl">Loading...</span></p>
        <p><strong>Base Path Expected:</strong> /my-portfolio</p>
        <p><strong>Avatar getImagePath result:</strong> {getImagePath("/images/avatar.jpg")}</p>
      </div>
      
      <h2>Expected Results</h2>
      <ul>
        <li>Test 1 (Red border): Should work on GitHub Pages due to assetPrefix</li>
        <li>Test 2 (Blue border): Should work - getImagePath should return same as Test 1</li>
        <li>Test 3 (Green border): Should work - Media component using our utilities</li>
        <li>Test 4 (Orange border): Should work - another gallery image</li>
      </ul>
      
      <script dangerouslySetInnerHTML={{
        __html: `
          // Update URL info
          document.getElementById('currentUrl').textContent = window.location.href;
          
          // Test image loading
          setTimeout(() => {
            const images = document.querySelectorAll('img');
            images.forEach((img, index) => {
              const testId = 'test' + (index + 1);
              const statusElement = document.getElementById(testId);
              if (statusElement) {
                if (img.complete && img.naturalHeight !== 0) {
                  statusElement.textContent = '✅ Loaded';
                  statusElement.style.color = 'green';
                } else {
                  statusElement.textContent = '❌ Failed';
                  statusElement.style.color = 'red';
                }
              }
            });
          }, 2000);
        `
      }} />
    </div>
  );
}