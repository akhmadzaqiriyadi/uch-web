// components/TipTapEditor.tsx
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Markdown } from 'tiptap-markdown'
import { useState, useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link as LinkIcon, 
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Code,
  Quote,
  Sparkles
} from 'lucide-react'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
  editorClassName?: string
}

export default function TipTapEditor({ content, onChange, editorClassName }: TipTapEditorProps) {
  const [linkUrl, setLinkUrl] = useState('')
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [showImageInput, setShowImageInput] = useState(false)
  const [markdownContent, setMarkdownContent] = useState(content || '')

  // Initialize editor with Markdown extension
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-md my-4'
        }
      }),
      Markdown.configure({
        html: false,
        transformPastedText: true,
        transformCopiedText: true
      })
    ],
    content: markdownContent,
    onUpdate: ({ editor }) => {
      // Get markdown content from editor
      const markdown = editor.storage.markdown.getMarkdown()
      setMarkdownContent(markdown)
      onChange(markdown)
    },
  })

  // Update editor content when the content prop changes
  useEffect(() => {
    if (editor && content !== markdownContent) {
      editor.commands.setContent(content)
      setMarkdownContent(content)
    }
  }, [content, editor])

  const addLink = () => {
    if (linkUrl) {
      editor?.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
      setLinkUrl('')
      setShowLinkInput(false)
    }
  }

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl('')
      setShowImageInput(false)
    }
  }

  // Format selection as code
  const toggleCode = () => {
    editor?.chain().focus().toggleCode().run()
  }

  // Format selection as blockquote
  const toggleBlockquote = () => {
    editor?.chain().focus().toggleBlockquote().run()
  }

  // Convert content to markdown and update
  const convertToMarkdown = () => {
    if (editor) {
      const markdown = editor.storage.markdown.getMarkdown()
      setMarkdownContent(markdown)
      onChange(markdown)
    }
  }

  if (!editor) {
    return <div className="border rounded-md p-4">Loading editor...</div>
  }

  return (
    <div className="tiptap-editor">
      <div className="border border-gray-200 rounded-t-md bg-gray-50 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Heading 1"
        >
          <Heading1 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Heading 2"
        >
          <Heading2 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Heading 3"
        >
          <Heading3 className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Bold"
        >
          <Bold className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Italic"
        >
          <Italic className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={toggleCode}
          className={`p-2 rounded ${editor.isActive('code') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Code"
        >
          <Code className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={toggleBlockquote}
          className={`p-2 rounded ${editor.isActive('blockquote') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Quote"
        >
          <Quote className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Bullet List"
        >
          <List className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Ordered List"
        >
          <ListOrdered className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-200'}`}
          title="Add Link"
        >
          <LinkIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          className="p-2 rounded hover:bg-gray-200"
          title="Add Image"
        >
          <ImageIcon className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={convertToMarkdown}
          className="p-2 rounded hover:bg-gray-200"
          title="Refresh Markdown"
        >
          <Sparkles className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded hover:bg-gray-200 ml-auto"
          title="Undo"
        >
          <Undo className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded hover:bg-gray-200"
          title="Redo"
        >
          <Redo className="h-5 w-5" />
        </button>
      </div>
      
      {showLinkInput && (
        <div className="border-l border-r border-gray-200 p-2 bg-gray-50 flex">
          <input
            type="text"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="Enter URL"
            className="flex-1 p-1 text-sm border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={addLink}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      )}
      
      {showImageInput && (
        <div className="border-l border-r border-gray-200 p-2 bg-gray-50 flex">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Enter image URL"
            className="flex-1 p-1 text-sm border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={addImage}
            className="ml-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowImageInput(false)}
            className="ml-2 px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm"
          >
            Cancel
          </button>
        </div>
      )}
      
      <EditorContent 
        editor={editor} 
        className={`border border-gray-200 rounded-b-md ${editorClassName}`} 
      />
      
       Show a preview of the markdown output 
      <div className="mt-4">
        <div className="font-medium text-sm mb-1">Markdown Output:</div>
        <pre className="bg-gray-100 p-3 rounded-md text-sm overflow-auto max-h-[200px]">
          {markdownContent}
        </pre>
      </div>
     
    </div>
  )
}