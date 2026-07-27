import React, { useEffect, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import TextAlign from '@tiptap/extension-text-align';
import CharacterCount from '@tiptap/extension-character-count';
import { cn } from '@/lib/utils';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Minus,
  Undo,
  Redo,
  Quote,
} from 'lucide-react';

interface RichTextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minLength?: number;
  maxLength?: number;   // Límite de caracteres (por defecto 800)
  showCharCount?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Escribe aquí...',
  className,
  disabled = false,
  minLength,
  maxLength = 800,
  showCharCount = true,
}) => {
  // Estados para undo/redo, heading activo y conteo de caracteres
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [activeHeading, setActiveHeading] = useState<number | null>(null);
  const [charCount, setCharCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
        link: false,
      }),
      Underline,
      HorizontalRule,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
    ],
    content: value || '<p></p>',
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
      updateEditorState(editor);
      // Actualizar conteo de caracteres
      setCharCount(editor.getText().length);
    },
    immediatelyRender: false,
  });

  // Función para actualizar los estados a partir del editor
  const updateEditorState = useCallback((editor: any) => {
    if (!editor) return;
    setCanUndo(editor.can().undo());
    setCanRedo(editor.can().redo());

    // Detectar heading activo
    let heading: number | null = null;
    for (let level = 1; level <= 6; level++) {
      if (editor.isActive('heading', { level })) {
        heading = level;
        break;
      }
    }
    setActiveHeading(heading);

    // Actualizar conteo (por si no se disparó onUpdate)
    setCharCount(editor.getText().length);
  }, []);

  // Suscribirse a eventos del editor
  useEffect(() => {
    if (!editor) return;
    updateEditorState(editor);

    const onUpdate = () => updateEditorState(editor);
    const onSelectionUpdate = () => updateEditorState(editor);

    editor.on('update', onUpdate);
    editor.on('selectionUpdate', onSelectionUpdate);

    return () => {
      editor.off('update', onUpdate);
      editor.off('selectionUpdate', onSelectionUpdate);
    };
  }, [editor, updateEditorState]);

  // Sincronizar contenido externo
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '<p></p>');
    }
  }, [editor, value]);

  if (!editor) return null;

  const textContent = editor.getText() || '';
  // Usamos charCount del estado, pero también podemos usar editor.getText().length
  const currentCharCount = charCount;

  // Manejadores
  const handleHeadingChange = (level: number | null) => {
    if (level === null) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().setHeading({ level }).run();
    }
    // El evento 'update' actualizará el estado
  };

  const insertHorizontalRule = () => {
    editor.chain().focus().setHorizontalRule().run();
  };

  const setAlignment = (alignment: 'left' | 'center' | 'right' | 'justify') => {
    editor.chain().focus().setTextAlign(alignment).run();
  };

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-950/50',
        'focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500/50',
        disabled && 'opacity-60 cursor-not-allowed',
        className
      )}
    >
      {!disabled && (
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 p-2 dark:border-slate-800">
          {/* Negrita, Cursiva, Subrayado */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={<Bold className="h-4 w-4" />}
            label="Negrita"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={<Italic className="h-4 w-4" />}
            label="Cursiva"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={<UnderlineIcon className="h-4 w-4" />}
            label="Subrayado"
          />

          <ToolbarDivider />

          {/* Desplegable de encabezados */}
          <div className="relative">
            <select
              value={activeHeading ?? ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '') {
                  handleHeadingChange(null);
                } else {
                  handleHeadingChange(parseInt(val, 10));
                }
              }}
              className="h-8 rounded-lg border border-slate-200 bg-transparent px-2 py-0.5 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="">Párrafo</option>
              <option value="1">H1</option>
              <option value="2">H2</option>
              <option value="3">H3</option>
              <option value="4">H4</option>
              <option value="5">H5</option>
              <option value="6">H6</option>
            </select>
          </div>

          <ToolbarDivider />

          {/* Listas */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={<List className="h-4 w-4" />}
            label="Lista viñetas"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={<ListOrdered className="h-4 w-4" />}
            label="Lista numerada"
          />

          <ToolbarDivider />

          {/* Cita */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            icon={<Quote className="h-4 w-4" />}
            label="Cita"
          />

          <ToolbarDivider />

          {/* Regla horizontal */}
          <ToolbarButton
            onClick={insertHorizontalRule}
            icon={<Minus className="h-4 w-4" />}
            label="Línea horizontal"
          />

          <ToolbarDivider />

          {/* Alineación */}
          <ToolbarButton
            onClick={() => setAlignment('left')}
            isActive={editor.isActive({ textAlign: 'left' })}
            icon={<AlignLeft className="h-4 w-4" />}
            label="Alinear izquierda"
          />
          <ToolbarButton
            onClick={() => setAlignment('center')}
            isActive={editor.isActive({ textAlign: 'center' })}
            icon={<AlignCenter className="h-4 w-4" />}
            label="Centrar"
          />
          <ToolbarButton
            onClick={() => setAlignment('right')}
            isActive={editor.isActive({ textAlign: 'right' })}
            icon={<AlignRight className="h-4 w-4" />}
            label="Alinear derecha"
          />
          <ToolbarButton
            onClick={() => setAlignment('justify')}
            isActive={editor.isActive({ textAlign: 'justify' })}
            icon={<AlignJustify className="h-4 w-4" />}
            label="Justificar"
          />

          <ToolbarDivider />

          {/* Undo / Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!canUndo}
            icon={<Undo className="h-4 w-4" />}
            label="Deshacer"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!canRedo}
            icon={<Redo className="h-4 w-4" />}
            label="Rehacer"
          />

          {/* Contador de caracteres (con límite) */}
          {showCharCount && (
            <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">
              {currentCharCount} / {maxLength}
            </span>
          )}
        </div>
      )}

      {/* Menú burbuja */}
      {editor && !disabled && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 150 }}
          className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-700 dark:bg-slate-900"
        >
          <BubbleButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={<Bold className="h-3.5 w-3.5" />}
          />
          <BubbleButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={<Italic className="h-3.5 w-3.5" />}
          />
          <BubbleButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
            icon={<UnderlineIcon className="h-3.5 w-3.5" />}
          />
        </BubbleMenu>
      )}

      <EditorContent
        editor={editor}
        className={cn(
          'prose prose-slate max-w-none p-4 dark:prose-invert',
          'min-h-[180px] focus:outline-none',
          disabled && 'cursor-not-allowed'
        )}
      />

      {/* Estilos mejorados (incluye tamaños de encabezado) */}
      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #94a3b8;
          pointer-events: none;
          height: 0;
        }
        .dark .ProseMirror p.is-editor-empty:first-child::before {
          color: #475569;
        }
        .ProseMirror {
          outline: none;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
        }
        .ProseMirror ul ul {
          list-style-type: circle;
        }
        .ProseMirror ol ol {
          list-style-type: lower-alpha;
        }
        .ProseMirror blockquote {
          border-left: 3px solid #0ea5e9;
          padding-left: 1rem;
          color: #64748b;
          font-style: italic;
        }
        .dark .ProseMirror blockquote {
          color: #94a3b8;
        }
        .ProseMirror hr {
          margin: 1rem 0;
          border: 0;
          border-top: 2px solid #e2e8f0;
        }
        .dark .ProseMirror hr {
          border-color: #334155;
        }

        /* Estilos para encabezados (tamaños de fuente) */
        .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 1rem 0 0.5rem;
        }
        .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 700;
          line-height: 1.3;
          margin: 0.75rem 0 0.5rem;
        }
        .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.75rem 0 0.5rem;
        }
        .ProseMirror h4 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.5rem 0 0.25rem;
        }
        .ProseMirror h5 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.5rem 0 0.25rem;
        }
        .ProseMirror h6 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
          margin: 0.5rem 0 0.25rem;
          color: #64748b;
        }
        .dark .ProseMirror h6 {
          color: #94a3b8;
        }
        .ProseMirror p {
          margin: 0 0 0.5rem;
        }
      `}</style>
    </div>
  );
};

// ─── Subcomponentes (igual que antes) ──────────────────────────────

const ToolbarButton = ({
  onClick,
  isActive,
  icon,
  label,
  disabled = false,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'rounded-lg p-1.5 text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
      isActive
        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
        : 'text-slate-600 dark:text-slate-400',
      disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent'
    )}
    title={label}
  >
    {icon}
  </button>
);

const ToolbarDivider = () => (
  <span className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
);

const BubbleButton = ({
  onClick,
  isActive,
  icon,
}: {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'rounded-md p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800',
      isActive
        ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'
        : 'text-slate-600 dark:text-slate-400'
    )}
  >
    {icon}
  </button>
);

export default RichTextEditor;
