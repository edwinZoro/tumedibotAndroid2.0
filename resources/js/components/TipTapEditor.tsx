// components/TipTapEditor.tsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { cn } from '@/lib/utils'; // Si no tienes esta utilidad, puedes usar una función simple para concatenar clases.

interface TipTapEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Escribe aquí...',
  className,
  disabled = false,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Configuramos las extensiones que queremos
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
    ],
    content: value || '<p></p>',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      // Cada vez que el contenido cambia, notificamos al formulario
      const html = editor.getHTML();
      onChange?.(html);
    },
    immediatelyRender: false, // Para evitar problemas con SSR (si usas Next.js)
  });

  // Sincronizar el contenido del editor con el valor del formulario
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>');
    }
  }, [editor, value]);

  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/50',
        'focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50',
        disabled && 'opacity-70 cursor-not-allowed',
        className
      )}
    >
      {/* Barra de herramientas básica */}
      {editor && !disabled && (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              editor.isActive('bold')
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            type="button"
          >
            Negrita
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              editor.isActive('italic')
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            type="button"
          >
            Cursiva
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              editor.isActive('bulletList')
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            type="button"
          >
            • Viñetas
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              editor.isActive('orderedList')
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            type="button"
          >
            1. Lista
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              editor.isActive('paragraph')
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            type="button"
          >
            Texto
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              'rounded-md px-3 py-1 text-sm font-medium transition-colors',
              editor.isActive('heading', { level: 2 })
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            )}
            type="button"
          >
            Título
          </button>
        </div>
      )}

      {/* El editor */}
      <EditorContent
        editor={editor}
        className={cn(
          'prose prose-slate max-w-none p-4 dark:prose-invert',
          'min-h-[150px] focus:outline-none',
          disabled && 'cursor-not-allowed'
        )}
      />

      {/* Placeholder visual (el de StarterKit no siempre se muestra bien) */}
      {!editor?.getText() && !disabled && (
        <div className="pointer-events-none -mt-12 px-4 text-sm text-slate-400 dark:text-slate-500">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default TipTapEditor;
