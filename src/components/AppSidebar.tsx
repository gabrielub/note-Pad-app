"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SidebarGroupContent from "./SidebarGroupContent";
import useNote from "@/hooks/useNote";

export default function AppSidebar() {
  const { noteText } = useNote();

  // Local-only "notes" array
  const notes = noteText ? [{ id: "local-note", text: noteText }] : [];

  const user = true; // Optional: mock user for UI consistency

  return (
    <Sidebar>
      <SidebarContent className="custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="mb-2 mt-2 text-lg">
            {user ? (
              "Your Notes"
            ) : (
              <p>
                <Link href="/login" className="underline">
                  Login
                </Link>{" "}
                to see your notes
              </p>
            )}
          </SidebarGroupLabel>
          {user && <SidebarGroupContent notes={notes} />}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
