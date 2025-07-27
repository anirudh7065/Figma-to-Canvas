import {
  GlobalWorkerOptions,
  getDocument,
  type PageViewport,
  type PDFPageProxy,
} from "pdfjs-dist";

GlobalWorkerOptions.workerSrc =
  "./node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs";

export const Canvas = async (
  file: File,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  setCode: React.Dispatch<React.SetStateAction<string>>
) => {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext("2d")!;
  let generatedCode = "// PDF to Canvas.js Code\n\n";

  if (file.type === "application/pdf") {
    const pdf = await getDocument(URL.createObjectURL(file)).promise;

    // 1️⃣ Get all pages & total height
    const pages: { page: PDFPageProxy; viewport: PageViewport }[] = [];
    let totalHeight = 0;
    let maxWidth = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1 });
      pages.push({ page, viewport });
      totalHeight += viewport.height;
      maxWidth = Math.max(maxWidth, viewport.width);
    }

    // 2️⃣ Resize the canvas for all pages
    canvas.width = maxWidth;
    canvas.height = totalHeight;

    // 3️⃣ Render each page in its vertical position
    let currentY = 0;
    for (let i = 0; i < pages.length; i++) {
      const { page, viewport } = pages[i];

      // Save context so each page is isolated
      ctx.save();
      ctx.translate(0, currentY); // Shift drawing position

      await page.render({
        canvasContext: ctx,
        viewport,
      }).promise;

      ctx.restore();

      generatedCode += `// Page ${i + 1}\npage.render(${i + 1}, ${
        viewport.width
      }x${viewport.height});\n\n`;

      currentY += viewport.height; // Move Y for next page
    }

    setCode(generatedCode);
  } else {
    // If it's an image
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      setCode(
        `ctx.drawImage("${file.name}", 0, 0, ${img.width}, ${img.height});`
      );
    };
    img.src = URL.createObjectURL(file);
  }
};
