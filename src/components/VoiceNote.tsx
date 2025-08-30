"use client";

import { useState, useEffect } from "react";
import { Mic, StopCircle } from "lucide-react";
import useNote from "@/hooks/useNote";

export default function VoiceNote() {
  const { noteText, setNoteText } = useNote();
  const [listening, setListening] = useState(false);
  const [recog, setRecog] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      console.warn("Speech Recognition API not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // keep listening
    recognition.interimResults = true; // show real-time results
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Show interim transcript in real-time
      setNoteText(prev => `${prev.split("[temp]")[0] || ""}${interimTranscript}[temp]`);
      // Append finalized transcript
      if (finalTranscript) {
        setNoteText(prev => `${prev.replace("[temp]", "")} ${finalTranscript}`.trim());
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
      // Clean up any leftover interim marker
      setNoteText(prev => prev.replace("[temp]", ""));
    };

    setRecog(recognition);
  }, [setNoteText]);

  const toggleListening = () => {
    if (!recog) return;

    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      recog.start();
      setListening(true);
    }
  };

  return (
    <button
      onClick={toggleListening}
      className={`flex items-center px-4 py-2 rounded ${
        listening ? "bg-red-600 text-white" : "bg-blue-600 text-white"
      }`}
    >
      {listening ? <StopCircle size={16} /> : <Mic size={16} />}
    </button>
  );
}
