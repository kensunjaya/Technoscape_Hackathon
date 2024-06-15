import React, { useContext, useEffect, useRef, useState } from "react";
import { pipeline } from "@xenova/transformers";
import { information } from "../assets/InformationData";
import MarkdownIt from "markdown-it";
import Markdown from "../components/Markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../firebaseSetup";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import { env } from "@xenova/transformers";
import Navbar from "../components/Navbar";
import { BeatLoader } from "react-spinners";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { set } from "firebase/database";

env.allowLocalModels = false;
// env.useBrowserCache = false;

const genAI = new GoogleGenerativeAI("AIzaSyDPBX4bbIvXcupKTOc63rfpqismkktMLeU");

function Faq() {
  const { userData, user, contactHistory, setContactHistory } = useContext(AuthContext);
  const [displayName, setDisplayname] = useState("");
  const [history, setHistory] = useState(information);

  const [sentiment, setSentiment] = useState("");
  const [model, setModel] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [chatContent, setChatContent] = useState([]);
  const [askContinue, setAskContinue] = useState(false);
  const [timeoutEnabled, setTimeoutEnabled] = useState(true); // State to enable/disable the timeout

  const textareaRef = useRef(null);

  const [timeoutId, setTimeoutId] = useState(null); // State to store the timeout ID
  const [secondTimeoutId, setSecondTimeoutId] = useState(null); // State to store the second timeout ID

  const navigate = useNavigate();
  const md = new MarkdownIt();

  // let classifier = null;

  const getHistory = async () => {
    try {
      setPageLoading(true);
      const docRef = doc(db, "histories", "binus");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data())
        setContactHistory(docSnap.data());
      } else {
        console.log("Data does not exist in database!");
        setContactHistory(null);
      }
    } catch (e) {
      console.error("Error getting document:", e);
      setContactHistory(null);
    } finally {
      setPageLoading(false);
    }
  };

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
      getHistory();
    }
  }, []);

  useEffect(() => {
    // Fetch the generative model when the component mounts

    const fetchModel = async () => {
      try {
        setPageLoading(true);
        // classifier = await pipeline("sentiment-analysis");
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

  const summarize = async (category) => {
    const chat = model.startChat({
      history: history,
      generationConfig: {},
    });
    let result;
    let sentiment;
    if (category) {
      result = await chat.sendMessage(
        "Describe the category of our conversation in one word only (example: registration)."
      );
    } else {
      result = await chat.sendMessage(
        "Please summarize the conversation topic in one paragraph only and in language what user's asked (so if the question is asked in indonesian, then the summary must also in indonesian). DO NOT INCLUDE the user's personal data such as email and name."
      );
      sentiment = await chat.sendMessage(
        "Based on the conversation, was my mood positive or negative? Please answer with positive or negative only. One word"
      )
    }
    const res = await result.response;
    const res2 = await sentiment.response;
    const text = await res.text(); // Await the text response
    const sen = await res2.text();
    // console.log(text); // tinggal masukin ke firebase
    try {
      const userDocRef = doc(db, "users", userData.email); // Get a reference to the user's document
      const historyDocRef = doc(db, "histories", "binus"); // Get a reference to the user's history document
      let tempHistory = contactHistory.chat;
      let tempRiwayat = userData.riwayat;
      tempRiwayat.push(text);
      tempHistory.push({content: text, sentiment: sen })
      await updateDoc(userDocRef, {
        riwayat: tempRiwayat, // Update the riwayat field with the summarized result
      });
      await updateDoc(historyDocRef, {
        chat: tempHistory, // Update the chat field with the summarized result
      })
      console.log("User riwayat updated successfully");
    } catch (error) {
      console.error("Error updating user riwayat:", error);
    }
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
        if (timeoutEnabled) {
          setTimeoutEnabled(false);
          summarize(false);
          alert("Thank you for chatting with me! Open history tab to see the conversation summary.");
          navigate("/info");
        }
        // Add any additional actions you want to perform here
      }, 20000); // 20 seconds in milliseconds

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
        setChatContent((prevChatContent) => {
          const updatedChatContent = [...prevChatContent];
          updatedChatContent[updatedChatContent.length - 1].bot =
            "Sorry, I couldn't answer that right now 😞, could you please ask another question?";
          return updatedChatContent;
        });
      } finally {
        setLoading(false);
        setPrompt("");
      }
    }
  };

  const getSentiment = async () => {
    try {
      console.log("clicked");

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
                    setTimeoutEnabled(true);
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
              <button
                onClick={
                  () => {
                    setTimeoutEnabled(false);
                    summarize(false);
                    alert("Thank you for chatting with me! Open history tab to see the conversation summary.");
                    navigate("/info");
                  }
                }
                disabled={loading}
                className="ml-5 rounded-xl text-red-500 bg-background border-[2px] border-red-500 h-[4rem] px-5"
              >
                End Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Faq;
