import React, { useContext, useEffect, useRef, useState } from "react";
import { pipeline } from "@xenova/transformers";
import { information } from "../assets/InformationData";
import MarkdownIt from "markdown-it";
import Markdown from "../components/Markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

import { env } from "@xenova/transformers";
import Navbar from "../components/Navbar";
import { BeatLoader } from "react-spinners";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

env.allowLocalModels = false;
env.useBrowserCache = false;

const genAI = new GoogleGenerativeAI("AIzaSyDPBX4bbIvXcupKTOc63rfpqismkktMLeU");

function Faq() {
  const { userData, user } = useContext(AuthContext);
  const [displayName, setDisplayname] = useState("");
  const [history, setHistory] = useState(information);

  const [sentiment, setSentiment] = useState("");
  const [model, setModel] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [chatContent, setChatContent] = useState([]);
  const [askContinue, setAskContinue] = useState(false);
  const [end, setEnd] = useState(false);

  const textareaRef = useRef(null);

  const [timeoutId, setTimeoutId] = useState(null); // State to store the timeout ID
  const [secondTimeoutId, setSecondTimeoutId] = useState(null); // State to store the second timeout ID

  const navigate = useNavigate();
  const md = new MarkdownIt();

  useEffect(() => {
    if (!user) {
      navigate("/signin");
    } else {
      setHistory([
        ...history,
        {
          role: "user",
          parts: [
            {
              text: `Data diri: Nama Lengkap: ${userData.nama}, Email: ${userData.email}`,
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Data diri berhasil kami ingat, Kami akan memberikan informasi seputar Binus University",
            },
          ],
        },
      ]);
      setDisplayname(userData.nama);
    }
  }, []);

  useEffect(() => {
    // Fetch the generative model when the component mounts

    const fetchModel = async () => {
      try {
        setLoading(true);
        const generativeModel = await genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });
        setModel(generativeModel);
      } catch (error) {
        console.error("Error loading generative model:", error);
      } finally {
        setLoading(false);
        setPageLoading(false);
      }
    };
    fetchModel();
  }, []);

  useEffect(() => {
    adjustTextareaHeight();
  }, [prompt]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height
    textarea.style.height = `${textarea.scrollHeight + 10}px`;
  };

  const summarize = async () => {
    const chat = model.startChat({
      history: history,
      generationConfig: {},
    });
    const result = await chat.sendMessage("Summarize the conversation in short sentence using the previous used conversation language. Excluding the name of the user.");
    const res = await result.response;
    const text = await res.text(); // Await the text response
    console.log(text); // tinggal masukin ke firebase
  };

  const resetTimers = () => {
    if (timeoutId) {
      clearTimeout(timeoutId); // Clear the previous timeout
    }
    if (secondTimeoutId) {
      clearTimeout(secondTimeoutId); // Clear the second timeout if it exists
    }
    setAskContinue(false); // Hide the "Ask Continue" message
  };

  const resetTimer = () => {
    resetTimers();
    const newTimeoutId = setTimeout(() => {
      console.log("No response for 30 seconds");
      setAskContinue(true);

      // Start the second timer
      const newSecondTimeoutId = setTimeout(() => {
        console.log("No response for 20 seconds after the first 30 seconds");
        summarize();
        // Add any additional actions you want to perform here
      }, 20000); // 10 seconds in milliseconds

      setSecondTimeoutId(newSecondTimeoutId);
    }, 30000); // 30 seconds in milliseconds

    setTimeoutId(newTimeoutId); // Set the new timeout ID
  };

  const getResponse = async () => {
    if (model) {
      if (!prompt) {
        return;
      }
      try {
        setLoading(true);
        resetTimer();
        // Add the user's prompt to the chat content and history
        setChatContent((prevChatContent) => [
          ...prevChatContent,
          { user: prompt, bot: "" },
        ]);
        const newHistory = [
          ...history,
          { role: "user", parts: [{ text: prompt }] },
        ];
        setHistory(newHistory);
        const tempPrompt = prompt;
        setPrompt("");
        console.log(newHistory);

        const chat = model.startChat({
          history: newHistory,
          generationConfig: {},
        });
        const result = await chat.sendMessage(tempPrompt);
        const res = await result.response;
        const text = await res.text(); // Await the text response

        // Update the bot response in the chat content
        setChatContent((prevChatContent) => {
          const updatedChatContent = [...prevChatContent];
          updatedChatContent[updatedChatContent.length - 1].bot = text;
          return updatedChatContent;
        });
        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "model", parts: [{ text: text }] },
        ]);
      } catch (error) {
        console.error("Error generating content:", error);
      } finally {
        setLoading(false);
        setPrompt("");
      }
    }
  };

  const getSentiment = async () => {
    try {
      console.log("clicked");
      const classifier = await pipeline("sentiment-analysis");
      console.log("here");
      const result = await classifier(prompt);
      setSentiment(result[0].label);
    } catch (error) {
      console.error("Error getting sentiment:", error);
      setSentiment("Error: " + error.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      getResponse();
    }
  };

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      ></link>

      <div className="w-screen min-h-screen flex flex-col font-sans bg-background">
        {pageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-black">
            <BeatLoader loading={loading} size={25} color="white" margin={5} />
          </div>
        )}
        <Navbar />

        <div className="mx-auto py-5 items-center justify-center">
          <div className="w-[100vh] mb-20">
            <div className="w-full">
              <div className="justify-start flex">
                {displayName !== "" ? (
                  <div className="mb-5 text-white bg-blueres p-5 rounded-3xl max-w-[65%]">{`Halo ${displayName}👋, apa yang bisa saya bantu hari ini mengenai Binus University?`}</div>
                ) : (
                  <div className="my-5 text-white bg-bluefield p-5 rounded-3xl max-w-[65%]">
                    <BeatLoader
                      loading={true}
                      size={10}
                      color="white"
                      margin={3}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto w-full">
              {chatContent.map((content, index) => (
                <div key={index} className="w-full">
                  <div className="justify-end flex">
                    <div className="mb-5 text-white bg-blueuser p-5 rounded-3xl max-w-[65%]">
                      {content.user}
                    </div>
                  </div>
                  <div className="justify-start flex">
                    {content.bot ? (
                      <div className="mb-5 text-white bg-blueres p-5 rounded-3xl max-w-[65%]">
                        <Markdown key={index} markdown={content.bot} />
                      </div>
                    ) : (
                      <div className="my-5 text-white bg-bluefield p-5 rounded-3xl max-w-[65%]">
                        <BeatLoader
                          loading={loading}
                          size={10}
                          color="white"
                          margin={3}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full">
              <div className="justify-start flex">
                {askContinue && (
                  <div className="mb-5 text-white bg-blueres p-5 rounded-3xl max-w-[65%]">{`${displayName}, apakah masih ada yang ingin Anda tanyakan? 😊`}</div>
                )}
              </div>
            </div>
            <div className="fixed bottom-0 w-full min-h[4vh] my-4 flex items-center">
              <textarea
                id="multiliner"
                placeholder="Type something ..."
                className="px-3 pt-3 rounded-xl bg-bluefield text-white min-w-[100vh] font-sans mr-5 resize-none overflow-hidden"
                value={prompt}
                onKeyDown={handleKeyDown}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (chatContent.length > 0) {
                    resetTimer();
                  }
                }}
                ref={textareaRef}
              />
              <button
                onClick={getResponse}
                disabled={loading}
                className="rounded-xl text-black bg-white h-[4rem] px-5"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faq;
