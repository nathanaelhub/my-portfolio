#!/bin/bash

echo "🔍 GALLERY IMAGE DIAGNOSTIC"
echo "=========================="
echo ""

echo "1️⃣ FILES IN public/images/gallery/"
echo "-----------------------------------"
ls -lh public/images/gallery/ | grep -v "^total" | awk '{print "  ✅", $9, "(" $5 ")"}'
echo ""

echo "2️⃣ EXPECTED PATHS IN content.tsx"
echo "---------------------------------"
grep "getImagePath.*gallery" src/resources/content.tsx | grep -o '"/images/gallery/[^"]*"' | sed 's/"//g' | while read path; do
  echo "  📝 $path"
done
echo ""

echo "3️⃣ DEPLOYED HTML IMAGE URLS"
echo "----------------------------"
curl -s "https://nathanaelhub.github.io/my-portfolio/gallery" | grep -o 'src="/my-portfolio/images/gallery/[^"]*"' | sort -u | sed 's/src="//;s/"$//' | while read url; do
  echo "  🌐 $url"
done
echo ""

echo "4️⃣ IMAGE ACCESSIBILITY TEST"
echo "----------------------------"
for img in horizontal-1.jpg horizontal-2.jpg horizontal-3.jpg horizontal-4.jpg vertical-1.jpg vertical-2.jpg vertical-3.jpg vertical-4.jpg; do
  url="https://nathanaelhub.github.io/my-portfolio/images/gallery/$img"
  status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
  if [ "$status" = "200" ]; then
    echo "  ✅ $img → HTTP $status"
  else
    echo "  ❌ $img → HTTP $status"
  fi
done
echo ""

echo "5️⃣ CHECK DEPLOYED OUT DIRECTORY"
echo "--------------------------------"
if [ -d "out/images/gallery" ]; then
  echo "  ✅ out/images/gallery/ exists"
  ls -lh out/images/gallery/ | grep -v "^total" | awk '{print "    -", $9, "(" $5 ")"}'
else
  echo "  ❌ out/images/gallery/ NOT FOUND"
fi
echo ""

echo "📊 SUMMARY"
echo "=========="
echo "All checks complete. Review results above."
