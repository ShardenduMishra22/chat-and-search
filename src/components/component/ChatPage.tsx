"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import { GoogleGenAI } from "@google/genai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY });

const ChatPage = () => {
  const [query, setQuery] = useState("");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: query,
      });
      const message = result.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response available.";
      setResponseText(message);
    } catch (error) {
      console.error("Error:", error);
      setResponseText("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Ask Agent</h1>
      <div className="flex space-x-2">
        <Input
          placeholder="Type your question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleSend} disabled={loading}>
          <Send className="mr-2" />
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
      {responseText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4"
        >
          <Card>
            <CardContent>{responseText}</CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ChatPage;
