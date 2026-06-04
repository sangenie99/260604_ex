// 환경변수 불러오기
require("dotenv").config();

// 의존성
const express = require("express");
const { GoogleGenAI } = require('@google/genai');
const Groq = require("groq-sdk");

// 전역변수
const PORT = 3434;
const app = express();
const genAI = new GoogleGenAI ({ apiKey: process.env.GEMINI_API_KEY})
const groq = new Groq ({ apiKey: process.env.GROQ_API_KEY})

// 미들 웨어
app.use(express.json()) //body

//대화
app.post("/chat/gen", async (req,res) => {
    const {body} = req;
    const {ask = "질문없음", model="gemma-4-26b-a4b-it"} = req.body
    console.log(ask)
    const response = await genAI.models.generateContent({
        model,
        contents: ask,
    })
    res.json({asnwer: response.text})
})


app.post("/chat/groq", async (req,res) => {
    const {body} = req;
    const {ask = "질문없음", model="openai/gpt-oss-120b"} = req.body
    console.log(ask)
    const response = await groq.chat.completions.create({
        messages: [{role: "user", content: ask}],
        model,
    });
    res.json({
        answer: response.choices[0].message.content,
    });
})


//서버 활성화 (연결할 포트 지정)
app.listen(PORT, ()=> {
    console.log(`${PORT}로 연결됨`)
})