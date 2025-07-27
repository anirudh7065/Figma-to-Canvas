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
    <main className="w-[100vw] h-[100vh] py-10 flex flex-col gap-5 md:justify-center items-center">

      <h1 className="max-md:text-lg md:text-3xl md:bg-blue-800 font-extrabold py-4 text-center max-sm:w-[96%] px-8 rounded-4xl md:border-2 border-black">Figma, PNG, JPEG, PDF to Canvas.js Converter</h1>



      <div className="conatiner flex max-md:flex-col justify-center w-[80vw] md:max-h-[60vh] items-center border-2 border-black md:rounded-4xl overflow-clip bg-white">
        {!showCanvas && <div className="md:h-[60vh] p-6 w-[80vw] max-md:text-xl text-center  bg-white rounded-4xl text-black text-3xl font-bold flex justify-center items-center flex-col gap-4" >
          <p>Hello Welcome to this site.</p>
          <p>Where you can convert Figma, PNG, JPEG, PDF and SVG to Canvas.js</p>
        </div>
        }


        {
          showCanvas && (
            <>
              <div className={`md:max-h-[60vh] h-[60vh] md:max-w-[40vw] overflow-auto scrollbar-hide`}>
                <canvas ref={canvasRef} className="max-w-full h-auto"></canvas>
              </div>
              <div className="flex justify-center items-center bg-slate-900 md:h-[60vh] w-[2px] h-[12px] max-md:w-[80vw]"></div>
              <textarea id="code" readOnly value={code} className={`scrollbar-hide py-4 resize-none focus:outline-none md:w-[40vw] h-[60vh] max-md:h-[40vh] overflow-auto md:text-center md:text-xl  border-black text-black`} />
            </>
          )
        }
      </div>
      <div className="btns flex max-md:flex-col gap-4 w-screen justify-center items-center max-md:py-10">

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
