"use client";

import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph } from "docx";
import { useState } from "react";
import { Download } from "lucide-react"; // icon to match buttons
import useNote from "@/hooks/useNote";
import { Button } from "./ui/button"; // ensure same button component

interface Props {
  noteId: string;
}

export default function ShareNoteButton({ noteId }: Props) {
  const { noteText } = useNote();
  const [open, setOpen] = useState(false);

  // Export handlers
  const exportTXT = () => {
    const blob = new Blob([noteText], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `note-${noteId}.txt`);
    setOpen(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(noteText, 10, 10);
    doc.save(`note-${noteId}.pdf`);
    setOpen(false);
  };

  const exportDOCX = async () => {
    const doc = new Document({
      sections: [{ children: [new Paragraph(noteText)] }],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `note-${noteId}.docx`);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Dropdown button (icon only) */}
      <Button onClick={() => setOpen(!open)} className="flex items-center bg-blue-600 text-white hover:bg-blue-700">
        <Download size={16} />
      </Button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-32 rounded-md shadow-lg z-50">
          <button
            className="w-full px-4 py-2 text-left bg-blue-600 hover:bg-blue-700 text-white rounded-t-md"
            onClick={exportPDF}
          >
            PDF
          </button>
          <button
            className="w-full px-4 py-2 text-left bg-blue-600 hover:bg-blue-700 text-white"
            onClick={exportDOCX}
          >
            DOCX
          </button>
          <button
            className="w-full px-4 py-2 text-left bg-blue-600 hover:bg-blue-700 text-white rounded-b-md"
            onClick={exportTXT}
          >
            TXT
          </button>
        </div>
      )}
    </div>
  );
}
