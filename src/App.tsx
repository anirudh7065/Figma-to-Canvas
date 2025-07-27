import { useState, useRef, useEffect } from "react";
import { Canvas } from "./lib/fileUpload";

export default function FileToCanvas() {
  const [code, setCode] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showCanvas, setShowCanvas] = useState(false);


  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setShowCanvas(true);
    setFile(file);
  };

  useEffect(() => {
    if (showCanvas && file && canvasRef.current) {
      Canvas(file, canvasRef, setCode);
    }
  }, [showCanvas, file]);


  return (
    <main className="w-[100vw] h-[100vh] flex flex-col gap-5 justify-center items-center">

      <h1 className="text-3xl bg-blue-800 font-extrabold my-6  py-4 px-8 rounded-4xl border-2 border-black">Figma, PNG, JPEG, PDF to Canvas.js Converter</h1>



      <div className="conatiner flex justify-center w-[80vw] max-h-[60vh] items-center border-2 border-black rounded-4xl overflow-clip bg-white">
        {!showCanvas && <div className="h-[60vh] w-[80vw]  bg-white rounded-4xl text-black text-3xl font-bold flex justify-center items-center flex-col gap-4" >
          <p>Hello Welcome to this site.</p>
          <p>Where you can convert Figma, PNG, JPEG, PDF and SVG to Canvas.js</p>
        </div>
        }


        {
          showCanvas && (
            <>
              <div className={`max-h-[60vh] max-w-[40vw] overflow-auto scrollbar-hide`}>
                <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
              </div>
              <textarea id="code" readOnly value={code} className={`scrollbar-hide py-4 resize-none focus:outline-none w-[40vw] h-[60vh] overflow-auto text-center text-xl border-l-2 border-black text-black`} />
            </>
          )
        }
      </div>
      <div className="btns flex gap-4 w-screen justify-center items-center">

        <button onClick={() => inputRef.current?.click()} className="bg-black text-white px-4 py-2 rounded-3xl">Upload File</button>
        <input type="file" accept=".png,.jpeg,.jpg,.pdf,.svg" onChange={handleFileUpload} className="hidden" ref={inputRef} />

        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="bg-blue-500 text-white px-4 py-2 rounded-3xl"
        >
          Copy Code
        </button>
      </div>


    </main>
  );
}
