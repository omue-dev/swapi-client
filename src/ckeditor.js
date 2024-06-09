// src/ckeditor.js
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import SourceEditing from '@ckeditor/ckeditor5-source-editing/src/sourceediting';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';

class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [
  Essentials,
  Bold,
  Italic,
  Paragraph,
  SourceEditing,
  Heading,
  Link,
  List,
  Table,
  TableToolbar,
  Markdown
];

ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      'heading', '|',
      'bold', 'italic', 'link', '|',
      'bulletedList', 'numberedList', 'insertTable', '|',
      'sourceEditing', 'undo', 'redo'
    ]
  },
  language: 'en',
  table: {
    contentToolbar: [
      'tableColumn', 'tableRow', 'mergeTableCells'
    ]
  }
};

export default ClassicEditor;
