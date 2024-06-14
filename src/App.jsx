import React, { useEffect, useState } from 'react';
import { pipeline } from '@xenova/transformers';

import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = false;

const genAI = new GoogleGenerativeAI("AIzaSyDPBX4bbIvXcupKTOc63rfpqismkktMLeU");


function App() {
  const [sentiment, setSentiment] = useState("");
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
        setSentiment('Prompt cannot be empty');
        return;
      }
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text(); // Await the text response
        setSentiment(text);
        console.log(text);
      } catch (error) {
        console.error('Error generating content:', error);
        setSentiment('Error: ', error.message);
      }
    } else {
      setSentiment('Generative model not loaded');
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
      setSentiment(result[0].label);
    } catch (error) {
      console.error('Error getting sentiment:', error);
      setSentiment('Error: ', error.message);
    }
  };

  return (
    <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
    <div className="w-screen min-h-screen flex justify-center items-center font-sans">
      <div className="m-10">
        <div className="my-5">{sentiment}</div>
        <div className="justify-center flex">  
          <input type="text" placeholder="prompt" className="p-3 rounded-xl bg-white text-black min-w-[50vh] font-sans mr-5" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button onClick={getResponse} className="rounded-xl">Send</button>
        </div>
      </div>
    </div>
      </>
  );
}

export default App;