import { getImagePath } from "@/utils/image";

export default function TestImages() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Image Test Page</h1>
      
      <h2>Test 1: Basic HTML img tag with getImagePath</h2>
      <img 
        src={getImagePath("/images/avatar.jpg")} 
        alt="Avatar test"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      
      <h2>Test 2: Basic HTML img tag with hardcoded path</h2>
      <img 
        src="/my-portfolio/images/avatar.jpg" 
        alt="Avatar test hardcoded"
        style={{ width: "100px", height: "100px", objectFit: "cover" }}
      />
      
      <h2>Test 3: Gallery image with getImagePath</h2>
      <img 
        src={getImagePath("/images/gallery/horizontal-1.jpg")} 
        alt="Gallery test"
        style={{ width: "200px", height: "auto" }}
      />
      
      <h2>Test 4: Gallery image with hardcoded path</h2>
      <img 
        src="/my-portfolio/images/gallery/horizontal-1.jpg" 
        alt="Gallery test hardcoded"
        style={{ width: "200px", height: "auto" }}
      />
      
      <div>
        <h3>Path debugging:</h3>
        <p>getImagePath(&quot;/images/avatar.jpg&quot;) = {getImagePath("/images/avatar.jpg")}</p>
        <p>process.env.NODE_ENV = {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}