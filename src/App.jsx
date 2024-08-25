import { useState } from 'react';
import './App.css'
import axios from 'axios';
import toast from 'react-hot-toast';
import copyImg from "./assets/copy.png"
function App() {
  let [url, seturl] = useState('')
  const [shorten, setshorten] = useState('')

  const api = import.meta.env.VITE_API_KEY;
  
  const isValidUrl = (url) => {
    const regex = /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,6}([\/\w\d-]*)*$/i;
    return regex.test(url);
  };

  const handleShorten = async () => {
    if (url == '') {
      return;
    }
    
    let Formattedurl = url.trim();
    
    if (!isValidUrl(Formattedurl)) {
      toast.error("Invalid URL format");
      return;
    }
    
    if (!Formattedurl.startsWith('http://') && !Formattedurl.startsWith('https://')) {
      Formattedurl = 'https://' + Formattedurl;
    }
    const data = {
      longUrl: Formattedurl,
      shortUrlFqdn: "lnkbrd.com"
    }

    try {
      const response = await axios.post('https://api.linkbird.io/api/v1/links', data, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${api}`,
          'Content-Type': 'application/json',
        },
      })
      setshorten(response.data.shortUrl);
      toast.success('All set');
    } catch (error) {
      toast.error('Something Went Wrong');
      return error;
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shorten)
      .then(() => toast.success('URL copied to clipboard'))
      .catch(() => toast.error('Failed to copy URL'));
  };
  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center bg-gray-100'>
      <div className='max-w-lg w-full p-6 bg-white rounded-lg shadow-lg'>
        <h1 className='text-3xl mb-1 text-center font-semibold text-black  md:text-3xl'>URL Shortener</h1>
        <p className='text-lg mb-6 text-center text-gray-600 md:text-lg'>Shorten your long URLs with ease.</p>
        <div className='flex flex-col items-center'>
          <input
            type='text'
            className='border border-gray-300 p-3 mb-4 w-full max-w-md rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base'
            placeholder='Enter a long URL'
            value={url}
            onChange={(e) => seturl(e.target.value)}
          />
          <button
            onClick={handleShorten}
            className='bg-black text-white p-3 rounded-md shadow-md w-full max-w-md focus:outline-none font-bold text-sm md:text-base'
          >
            Shorten URL
          </button>
        </div>
        {shorten && (
          <div className='mt-6'>
            <p className='text-xl font-semibold text-gray-800 mb-2  md:text-xl'>Your Shortened URL:</p>
            <div className='border p-4 rounded-md bg-gray-100 flex items-center flex-wrap justify-between'>
              <a href={shorten} className='font-semibold text-blue-600 underline hover:text-blue-800 text-sm md:text-base'>
                {shorten}
              </a>
              <button
                onClick={handleCopy}
                className='ml-4 p-2 rounded-md focus:outline-none'
                aria-label='Copy URL'
              >
                <img src={copyImg} alt='copy' className='w-6 h-6' />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
