"use client";

import {
  Editor,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnBulletList,
  BtnNumberedList,
  BtnLink,
  BtnClearFormatting,
  Separator,
} from "react-simple-wysiwyg";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: Props) {
  function handleChange(e: any) {
    onChange(e.target.value);
  }

  return (
    <div className="rich-text-wrapper rounded-xl overflow-hidden border border-white/10 shadow-lg">
      <EditorProvider>
        <Editor
          value={value}
          onChange={handleChange}
          style={{
            minHeight: "400px",
            padding: "2rem",
            backgroundColor: "#ffffff",
            color: "#1a1a1a",
            fontSize: "1.1rem",
            lineHeight: "1.75",
          }}
          containerProps={{ style: { height: "100%" } }}
        >
          <Toolbar
            style={{
              backgroundColor: "#f4f4f5",
              borderBottom: "1px solid #e4e4e7",
            }}
          >
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
            <BtnClearFormatting />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}
