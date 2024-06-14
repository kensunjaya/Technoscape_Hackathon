import React, { useEffect, useState } from 'react';
import { pipeline } from '@xenova/transformers';

import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from '@xenova/transformers';
import Navbar from './components/Navbar';

env.allowLocalModels = false;
env.useBrowserCache = false;

const genAI = new GoogleGenerativeAI("AIzaSyDPBX4bbIvXcupKTOc63rfpqismkktMLeU");


function App() {
  const [response, setResponse] = useState("");
  const [model, setModel] = useState(null);
  const [prompt, setPrompt] = useState("");

  useEffect(() => {
    console.log(import.meta.env)
    // Fetch the generative model when the component mounts
    const fetchModel = async () => {
      try {
        const generativeModel = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        setModel(generativeModel);
      } catch (error) {
        console.error('Error loading generative model:', error);
      }
    };
    fetchModel();
  }, []);

  const getResponse = async () => {
    if (model) {
      if (!prompt) {
        setResponse('Prompt cannot be empty');
        return;
      }
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text(); // Await the text response
        setResponse(text);
        console.log(text);
      } catch (error) {
        console.error('Error generating content:', error);
        setResponse('Error: ', error.message);
      }
    } else {
      setResponse('Generative model not loaded');
    }
  };


  // const getResponse = async (prompt) => {
  //   // const prompt = "Write a story about a magic backpack."

  //   const result = await model.generateContent(prompt);
  //   const response = await result.response;
  //   const text = response.text();
  //   setSentiment(text);
  //   console.log(text);

  // };
  

  const getSentiment = async () => {
    try {
      console.log("clicked")
      const classifier = await pipeline('sentiment-analysis');
      console.log("here")
      const result = await classifier(prompt);
      setResponse(result[0].label);
    } catch (error) {
      console.error('Error getting sentiment:', error);
      setResponse('Error: ', error.message);
    }
  };

  return (
    <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
    
    <div className="w-screen min-h-screen flex font-sans bg-background">
      <Navbar />
      <div className="mx-10 py-5 flex items-end justify-start">
        <div>
          <div className="my-5 text-white bg-blueres p-5 rounded-3xl w-[50%]">{response}</div>
          <div className="flex">  
            <input type="text" placeholder="Type something ..." className="p-3 rounded-xl bg-bluefield text-white min-w-[100vh] font-sans mr-5" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
            <button onClick={getResponse} className="rounded-xl text-black bg-white">Send</button>
          </div>
        </div>
      </div>
    </div>
      </>
  );
}

export default App;