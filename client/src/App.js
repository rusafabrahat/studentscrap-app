import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import DOMPurify from 'dompurify';

function App() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [texts, setTexts] = useState({});
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const collageRef = useRef(null);

  // load saved collage
  useEffect(() => {
    const savedData = localStorage.getItem('studentScrapCollage');
    if (savedData) {
      try {
        const { images: savedImages, texts: savedTexts } = JSON.parse(savedData);
        setImages(savedImages);
        setTexts(savedTexts);
      } catch (err) {
        console.error("Failed to parse saved data:", err);
      }
    }
  }, []);

  // save collage
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      localStorage.setItem('studentScrapCollage', JSON.stringify({ images, texts }));
    }, 500);
    return () => clearTimeout(debounceTimer);
  }, [images, texts]);

  // upload image
  const handleUpload = async () => {
    if (!file) return alert("Please select an image");
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const res = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setImages(prev => [...prev, res.data]);
      setTexts(prev => ({ ...prev, [res.data._id]: "Click to edit" }));
    } catch (err) {
      alert(`Upload failed: ${err.response?.data?.error || err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // delete image
  const handleDelete = (id) => {
    setImages(prev => prev.filter(img => img._id !== id));
    const newTexts = {...texts};
    delete newTexts[id];
    setTexts(newTexts);
  };

  // Download collage
  const downloadCollage = async () => {
    setDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const canvas = await html2canvas(collageRef.current, {
        backgroundColor: '#f8f5f2',
        scale: 2,
        useCORS: true,
        allowTaint: false,
      });
      const link = document.createElement('a');
      link.download = `studentscrap-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download error:', err);
      alert('Failed to download. Check console for details.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5f2] font-serif px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-gray-900">
            StudentScrap
          </h1>
          <p className="text-lg text-gray-600">Your visual study planner</p>
        </header>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white w-64"
            disabled={uploading || downloading}
          />
          <button
            onClick={handleUpload}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-medium disabled:opacity-50"
            disabled={uploading || downloading || !file}
          >
            {uploading ? "Uploading..." : "Add Image"}
          </button>
          <button
            onClick={downloadCollage}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
            disabled={downloading || images.length === 0}
          >
            {downloading ? "Generating..." : "Save Collage"}
          </button>
        </div>
        <div 
          ref={collageRef}
          className="relative bg-white rounded-xl shadow-lg p-6 min-h-[70vh] border border-gray-200 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"
        >
          {images.map((img) => (
            <Draggable key={img._id}>
              <div className="absolute z-10 w-56 group">
                <div className="relative">
                  <img
                    src={img.url}
                    alt="Collage item"
                    crossOrigin="anonymous"
                    className="w-full h-48 object-cover rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all"
                  />
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
                <div
                  contentEditable
                  onBlur={(e) => setTexts(prev => ({ 
                    ...prev, 
                    [img._id]: DOMPurify.sanitize(e.target.textContent) 
                  }))}
                  className="mt-2 px-3 py-2 bg-white rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-200 font-sans border border-gray-200 hover:border-gray-300"
                  suppressContentEditableWarning={true}
                >
                  {texts[img._id] || "Click to edit"}
                </div>
              </div>
            </Draggable>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;