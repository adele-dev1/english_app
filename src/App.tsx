import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleGenerativeAI } from "@google/generative-ai"

function App() {
  const [input, setInput] = useState("")
  const [inputCharacter, setCharacter] = useState("普通の人")
  const [messages, setMessages] = useState<string[]>([])

  const handleSendMessage = async () => {
    if (!input.trim()) return; // 空メッセージ防止

    const userMessage = { text: input, sender: "user" };
    setInput(""); // 入力フィールドをクリア

    console.log(input);
    setMessages((prevMessages) => [...prevMessages, input]);
    
    
    const genAI = new GoogleGenerativeAI("");//GeminiのAPIキー
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      ・あなたは${inputCharacter}です。
      ・あなたは英会話の練習相手です。
      ・以下のメッセージに対して端的に自然な英語で会話してください。
      ・単語のスペルや文法に間違いがある場合は日本語で指摘してください。
      ${input}
    `;
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    setMessages((prevMessages) => [...prevMessages, result.response.text()]);
  };
  
  return (
    <>
      <header className="fixed top-0 w-full bg-white shadow-md p-4 z-10">
        <h1>ENGLISH COVERSATION WITH ANYONE</h1>
        話したい人を入力してください。
        <input
          type="text"
          value={inputCharacter}
          onChange={(e) => setCharacter(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="話したい人物を選んでください"
        />
      </header>

      <div className="chat-container flex-1 overflow-y-auto p-4 mt-[80px] mb-[80px]">
      {messages.map((msg, index) => (
          <div
            key={index}
            className={`user-message p-2 my-2 rounded-lg max-w-xs`}
          >
            {msg}
          </div>
        ))}
      </div>
        
      <footer className="fixed bottom-0 w-full bg-white shadow-md p-4 z-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage} className="ml-2 p-2 bg-blue-500 text-white rounded-lg">
          Send
        </button>
      </footer>
    </>
  )
}

export default App
