"use client";
import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Bookmark, Braces, Code2, RotateCcw } from "lucide-react";
const axios = require("axios");

const CodeSection = () => {
  const [submissionToken, setSubmissionToken] = useState(null);
  const [code, setCode] =
    useState(`#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your C++ code here\n    return 0;\n}
`);

  function handleEditorChange(value, event) {
    setCode(value);
  }

  const resetCode = () => {
    setCode("");
  };

  const createSubmission = async () => {
    let token = "";
    try {
      const languageIdMap = {
        cpp: 53,
        python: 70,
        javascript: 63,
        java: 62,
        // Add more language IDs as needed
      };

      const options = {
        method: "POST",
        url: "https://judge0-ce.p.rapidapi.com/submissions",
        params: {
          base64_encoded: "false",
          fields: "*",
        },
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key":
            "84d6b941b0mshde8c7e6f0ca860dp13fa7ejsn265af7ba306a", // Replace with your actual API key
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
        data: {
          language_id: languageIdMap[selectedLanguage],
          source_code: code, // Base64 encode the code
        },
      };

      const response = await axios.request(options);
      token = response.data.token;
      setSubmissionToken(token); // Store the token for future use (optional)

      // Call getSubmissionOutput after successful submission
      if (token) {
        getSubmissionOutput();
      }
    } catch (error) {
      console.log("Submission failed:", error.response);
    }
  };

  useEffect(() => {
    const getSubmissionOutput = async () => {
      if (!submissionToken) return; // Handle the case where no submission is made

      const options = {
        method: "GET",
        url: `https://judge0-ce.p.rapidapi.com/submissions/${submissionToken}/?base64_encoded=false`,
        params: {
          base64_encoded: "false",
          fields: "*",
        },
        headers: {
          "X-RapidAPI-Key":
            "84d6b941b0mshde8c7e6f0ca860dp13fa7ejsn265af7ba306a", // Replace with your actual API key
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        console.log("Submission Output:", response.data.stdout); // Access the output field (modify if different)
      } catch (error) {
        console.error("Error fetching submission output:", error.response);
      }
    };
    getSubmissionOutput();
  }, [submissionToken]);

  const [selectedLanguage, setSelectedLanguage] = useState("cpp"); // State variable to store selected language
  const [isOpen, setIsOpen] = useState(false); // State variable to manage dropdown visibility
  console.log(selectedLanguage);
  const handleSelectLanguage = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false); // Close the dropdown after selecting a language

    // Define a map of languages to default code snippets
    const defaultCodeMap = {
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your C++ code here\n    return 0;\n}`,
      java: `public class Main {\n    public static void main(String[] args) {\n        // Your Java code here\n    }\n}`,
      python: `print("hello world")`,
      javascript: `console.log("hello world")`,
    };

    // Set the default code for the selected language
    setCode(defaultCodeMap[language]);
  };

  return (
    <main className="w-full h-[93.15vh] flex justify-around bg-black p-1">
      <div className="w-[39%] h-full  bg-[#1E1E1E] border border-[#666] rounded-[12px]"></div>
      <div className="w-[59%] h-full rounded-[12px] border border-[#666] ">
        <div className="w-full h-10 bg-[#333333] rounded-t-[12px] gap-1 flex items-center px-4">
          <Code2 size={22} color="green" />
          <p className="text-[white] text-[15px] font-medium">Code</p>
        </div>
        <div className="w-full h-9 bg-[#1E1E1E] border-b border-[#666] flex justify-between px-4 items-center">
          <div className="dropdown">
            <button
              className="text-white px-2 py-1 bg-purple-600"
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedLanguage ? selectedLanguage : "cpp"}
            </button>
            {isOpen && (
              <div className="flex flex-col absolute z-50 bg-[#333] text-white px-4 py-2">
                <button onClick={() => handleSelectLanguage("cpp")}>c++</button>
                <button onClick={() => handleSelectLanguage("java")}>
                  java
                </button>
                <button onClick={() => handleSelectLanguage("python")}>
                  python
                </button>
                <button onClick={() => handleSelectLanguage("javascript")}>
                  javaScript
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3 text-white">
            <Bookmark size={20} />
            <Braces size={20} />
            <RotateCcw
              size={20}
              onClick={resetCode}
              className="cursor-pointer"
            />
          </div>
        </div>
        <Editor
          options={{
            fontSize: 20,
            autoClosingBrackets: 6,
          }}
          codeLens={24}
          value={code}
          acceptSuggestionOnEnter="smart"
          theme={"vs-dark"}
          height={"75vh"}
          onChange={handleEditorChange}
          defaultLanguage={`${selectedLanguage}`}
          defaultValue={``}
        />
        <div className="w-full h-10 rounded-b-[10px] bg-[#1E1E1E] px-4">
          <div className="flex gap-4 justify-end items-center">
            <button
              onClick={createSubmission}
              className="h-[35px] px-5  bg-[#454545] mt-1 text-white rounded-[12px]"
            >
              Run
            </button>
            <button className="h-[35px] px-5  bg-green-600 mt-1 text-white rounded-[12px]">
              Submit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CodeSection;
// 84d6b941b0mshde8c7e6f0ca860dp13fa7ejsn265af7ba306a
