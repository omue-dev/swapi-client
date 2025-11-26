import React, { useRef, useState, useEffect } from 'react';
import { cleanAndFormatDescription } from '../../utils/utils';
import { Product } from '../../interfaces/types';
import TextField from '@mui/material/TextField';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';

// MUI Icons
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import LinkIcon from '@mui/icons-material/Link';
import CodeIcon from '@mui/icons-material/Code';
import TitleIcon from '@mui/icons-material/Title';
import LooksOneIcon from '@mui/icons-material/LooksOne';
import LooksTwoIcon from '@mui/icons-material/LooksTwo';
import Looks3Icon from '@mui/icons-material/Looks3';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

interface ProductDescriptionProps {
  product: Product | null;
  setProduct: React.Dispatch<React.SetStateAction<Product | null>>;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({ product, setProduct }) => {
  const editableRef = useRef<HTMLDivElement | null>(null);
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [showHtml, setShowHtml] = useState(false);

  // 🔹 Beim ersten Rendern den HTML-Inhalt einsetzen
  useEffect(() => {
    if (editableRef.current && product?.description) {
      editableRef.current.innerHTML = product.description;
    }
  }, [product?.description]);

  // 🧼 Bereinigen/Formatieren manuell per Button
  const handleCleanClick = () => {
    if (!editableRef.current) return;
    const raw = showHtml ? editableRef.current.innerText : editableRef.current.innerHTML;
    const cleanHtml = cleanAndFormatDescription(raw);
    setProduct(prev => ({ ...prev!, description: cleanHtml }));
  };

  // 🧩 HTML beim Einfügen erhalten (Copy & Paste aus Word/GPT)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    const clipboardData = e.clipboardData;
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');

    // Wenn HTML existiert → direkt einfügen
    if (html) {
      document.execCommand('insertHTML', false, html);
    } else {
      // Fallback: Nur Text
      document.execCommand('insertText', false, text);
    }
  };

  // ✨ Formatierungsaktionen (Fett, Kursiv usw.)
  const exec = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
  };

  // 🔗 Link einfügen
  const handleLink = () => {
    const url = prompt('Link-Adresse eingeben (z. B. https://...)');
    if (url) exec('createLink', url);
  };

  // 👁️ Hover zeigt aktuelles HTML-Tag an
  const handleMouseOver = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target && ['H1', 'H2', 'H3', 'P', 'UL', 'OL', 'LI'].includes(target.tagName)) {
      setHoveredTag(target.tagName);
    } else {
      setHoveredTag(null);
    }
  };

  const handleMouseOut = () => setHoveredTag(null);

  return (
    <Box mt={2}>
      {/* 🧾 Short Text */}
      <TextField
        label="Short Text"
        multiline
        fullWidth
        rows={4}
        value={product?.shortText || ''}
        onChange={(e) =>
          setProduct((prev) => ({
            ...prev!,
            shortText: e.target.value,
          }))
        }
      />

      <Box mt={3}>
        <Typography variant="subtitle1" gutterBottom>
          Description
        </Typography>

        {/* 🛠️ Toolbar */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            border: '1px solid #ddd',
            borderRadius: 2,
            mb: 1,
            p: 0.5,
          }}
        >
          <Tooltip title="Paragraph"><IconButton onClick={() => exec('formatBlock', 'p')}><TitleIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Überschrift 1"><IconButton onClick={() => exec('formatBlock', 'h1')}><LooksOneIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Überschrift 2"><IconButton onClick={() => exec('formatBlock', 'h2')}><LooksTwoIcon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Überschrift 3"><IconButton onClick={() => exec('formatBlock', 'h3')}><Looks3Icon fontSize="small" /></IconButton></Tooltip>
          <Tooltip title="Fett"><IconButton onClick={() => exec('bold')}><FormatBoldIcon /></IconButton></Tooltip>
          <Tooltip title="Kursiv"><IconButton onClick={() => exec('italic')}><FormatItalicIcon /></IconButton></Tooltip>
          <Tooltip title="Unterstrichen"><IconButton onClick={() => exec('underline')}><FormatUnderlinedIcon /></IconButton></Tooltip>
          <Tooltip title="Ungeordnete Liste"><IconButton onClick={() => exec('insertUnorderedList')}><FormatListBulletedIcon /></IconButton></Tooltip>
          <Tooltip title="Geordnete Liste"><IconButton onClick={() => exec('insertOrderedList')}><FormatListNumberedIcon /></IconButton></Tooltip>
          <Tooltip title="Link"><IconButton onClick={handleLink}><LinkIcon /></IconButton></Tooltip>
          <Tooltip title={showHtml ? 'WYSIWYG anzeigen' : 'HTML-Code anzeigen'}>
            <IconButton
              onClick={() => setShowHtml((prev) => !prev)}
              color={showHtml ? 'secondary' : 'default'}
            >
              <CodeIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bereinigen/Formatieren (utils)">
            <IconButton onClick={handleCleanClick} color="primary">
              <CleaningServicesIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 🧠 ContentEditable-Feld */}
        <Tooltip
          title={hoveredTag ? `Aktuell: <${hoveredTag.toLowerCase()}>` : ''}
          placement="top-start"
          arrow
        >
          <Box
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onPaste={handlePaste}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            dangerouslySetInnerHTML={{
              __html: showHtml
                ? (product?.description || '')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;') // zeigt HTML-Code an
                : product?.description || '', // rendert echtes HTML
            }}
            sx={{
              border: '1px solid #ccc',
              borderRadius: 2,
              padding: 2,
              minHeight: 150,
              fontSize: '1rem',
              lineHeight: 1.5,
              outline: 'none',
              cursor: 'text',
              fontFamily: showHtml ? 'monospace' : 'inherit',
              whiteSpace: showHtml ? 'pre-wrap' : 'normal',
            }}
          />
        </Tooltip>
      </Box>
    </Box>
  );
};

export default ProductDescription;
