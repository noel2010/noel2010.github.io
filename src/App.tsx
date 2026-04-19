import React, { useState, useRef } from 'react';
import { Plus, Trash2, MoveUp, MoveDown, Download, Eye, Edit3, Upload, FileText, Save } from 'lucide-react';

// ============================================================
// DESIGN SYSTEM - All CSS variables and styles in one place
// These match the document style from the PDF generator above
// ============================================================
const STYLES = `
  body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background: #f5f5f5;
  }
  .content {
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  h1 {
    color: #1e40af;
    font-weight: bold;
    font-size: 28px;
    border-bottom: 3px solid #2563eb;
    padding-bottom: 10px;
    margin-bottom: 30px;
  }
  h2 {
    color: #1e40af;
    font-weight: bold;
    font-size: 22px;
    margin-top: 30px;
    margin-bottom: 15px;
    page-break-after: avoid;
  }
  h3 {
    color: #1e40af;
    font-weight: bold;
    font-size: 18px;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }
  p {
    line-height: 1.8;
    margin: 15px 0;
  }
  /* Blue info box */
  .box {
    background: #eff6ff;
    border: 2px solid #2563eb;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    page-break-inside: avoid;
  }
  /* Red warning box */
  .warning {
    background: #fef2f2;
    border: 2px solid #dc2626;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    page-break-inside: avoid;
  }
  /* Green success box */
  .success {
    background: #f0fdf4;
    border: 2px solid #16a34a;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    page-break-inside: avoid;
  }
  /* Yellow tips box */
  .info {
    background: #fefce8;
    border: 2px solid #eab308;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    page-break-inside: avoid;
  }
  /* Purple exercise box */
  .exercise {
    background: #f3e8ff;
    border: 2px solid #9333ea;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    page-break-inside: avoid;
  }
  /* Green left-border example box */
  .example {
    background: #f1f5f9;
    padding: 20px;
    border-radius: 6px;
    border-left: 4px solid #10b981;
    margin: 15px 0;
    page-break-inside: avoid;
  }
  /* Centered formula box */
  .formula-box {
    background: #eff6ff;
    border: 3px solid #2563eb;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    margin: 20px 0;
    page-break-inside: avoid;
  }
  ul, ol {
    margin: 10px 0;
    padding-left: 25px;
  }
  li {
    margin: 8px 0;
  }
  strong {
    color: #1e40af;
  }
  hr {
    border: none;
    border-top: 2px solid #e5e7eb;
    margin: 30px 0;
  }
`;

const DocumentGenerator = () => {
  const [title, setTitle] = useState('Moj Dokument');
  const [sections, setSections] = useState([
    { id: 1, type: 'heading', content: 'Uvod', level: 2 },
    { id: 2, type: 'paragraph', content: 'Ovo je primjer paragrafa. Klikni za uređivanje.' },
    { id: 3, type: 'box', boxType: 'info', content: 'Ovo je plavi info box.' },
    { id: 4, type: 'box', boxType: 'tips', content: 'Ovo je žuti box za savjete i napomene.' },
    { id: 5, type: 'box', boxType: 'warning', content: 'Ovo je crveni box za upozorenja i greške.' },
  ]);
  const [preview, setPreview] = useState(true);
  const [nextId, setNextId] = useState(6);
  const [showLoadMenu, setShowLoadMenu] = useState(false);

  const fileInputRef = useRef(null);

  const blockTypes = [
    { value: 'heading',   label: 'Naslov',       icon: 'H'  },
    { value: 'paragraph', label: 'Paragraf',      icon: 'P'  },
    { value: 'box',       label: 'Info Box',      icon: '📦' },
    { value: 'tips',      label: 'Savjeti',       icon: '💡' },
    { value: 'warning',   label: 'Upozorenje',    icon: '⚠️' },
    { value: 'success',   label: 'Uspjeh',        icon: '✓'  },
    { value: 'example',   label: 'Primjer',       icon: '🔍' },
    { value: 'exercise',  label: 'Zadatak',       icon: '📝' },
    { value: 'formula',   label: 'Formula',       icon: '∑'  },
    { value: 'list',      label: 'Lista',         icon: '•'  },
    { value: 'divider',   label: 'Razdjelnik',    icon: '—'  },
  ];

  const addSection = (type) => {
    const boxVariants = ['warning', 'success', 'exercise', 'tips'];
    const newSection = {
      id: nextId,
      type: boxVariants.includes(type) ? 'box' : type,
      boxType: boxVariants.includes(type) ? type : 'info',
      content: type === 'heading' ? 'Novi Naslov' :
               type === 'list'    ? ['Stavka 1', 'Stavka 2'] :
               type === 'divider' ? null :
               'Novi sadržaj...',
      level: type === 'heading' ? 2 : undefined
    };
    setSections([...sections, newSection]);
    setNextId(nextId + 1);
  };

  const updateSection = (id, field, value) => {
    setSections(sections.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const deleteSection = (id) => setSections(sections.filter(s => s.id !== id));

  const moveSection = (id, direction) => {
    const index = sections.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === sections.length - 1)) return;
    const arr = [...sections];
    const ni = direction === 'up' ? index - 1 : index + 1;
    [arr[index], arr[ni]] = [arr[ni], arr[index]];
    setSections(arr);
  };

  const updateListItem   = (sid, i, v) => setSections(sections.map(s => s.id === sid ? { ...s, content: s.content.map((c, idx) => idx === i ? v : c) } : s));
  const addListItem      = (sid)        => setSections(sections.map(s => s.id === sid ? { ...s, content: [...s.content, 'Nova stavka'] } : s));
  const deleteListItem   = (sid, i)     => setSections(sections.map(s => s.id === sid ? { ...s, content: s.content.filter((_, idx) => idx !== i) } : s));

  // ─────────────────────────────────────────────────
  // HTML GENERATION
  // ─────────────────────────────────────────────────
  const buildBodyContent = () => sections.map(s => {
    if (s.type === 'heading')   return `<h${s.level}>${s.content}</h${s.level}>`;
    if (s.type === 'paragraph') return `<p>${s.content}</p>`;
    if (s.type === 'box')       return `<div class="${s.boxType === 'tips' ? 'info' : s.boxType}">${s.content}</div>`;
    if (s.type === 'example')   return `<div class="example"><p><strong>Primjer:</strong></p><p>${s.content}</p></div>`;
    if (s.type === 'formula')   return `<div class="formula-box">${s.content}</div>`;
    if (s.type === 'divider')   return `<hr>`;
    if (s.type === 'list')      return `<ul>${s.content.map(i => `<li>${i}</li>`).join('')}</ul>`;
    return '';
  }).join('\n    ');

  const generateHTML = () => `<!DOCTYPE html>
<html lang="hr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>${STYLES}</style>
</head>
<body>
  <div class="content">
    <h1>${title}</h1>
    ${buildBodyContent()}
  </div>
</body>
</html>`;

  const downloadHTML = () => {
    const blob = new Blob([generateHTML()], { type: 'text/html' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ─────────────────────────────────────────────────
  // PDF GENERATION
  // The trick: inject html2pdf from CDN dynamically,
  // then call it on a hidden div with the document HTML.
  // page-break-inside: avoid on boxes keeps them intact.
  // ─────────────────────────────────────────────────
  const downloadPDF = () => {
    const loadLib = (src) => new Promise((resolve) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const script  = document.createElement('script');
      script.src    = src;
      script.onload = resolve;
      document.head.appendChild(script);
    });

    loadLib('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')
      .then(() => {
        // Build a full standalone HTML string and use fromHTML
        const html = `
          <style>${STYLES}</style>
          <div class="content" style="box-shadow:none;">
            <h1>${title}</h1>
            ${buildBodyContent()}
          </div>
        `;

        const opt = {
          margin:      15,
          filename:    `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`,
          image:       { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        window.html2pdf().set(opt).from(html).save();
      });
  };

  // ─────────────────────────────────────────────────
  // PROJECT SAVE / LOAD
  // ─────────────────────────────────────────────────
  const saveProject = () => {
    const project = { title, sections, nextId, version: '1.0' };
    const blob    = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = `${title.toLowerCase().replace(/\s+/g, '-')}-project.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadProject = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader    = new FileReader();
    reader.onload   = (ev) => {
      try {
        const p = JSON.parse(ev.target.result);
        setTitle(p.title || 'Učitan Dokument');
        setSections(p.sections || []);
        setNextId(p.nextId || p.sections.length + 1);
        setShowLoadMenu(false);
      } catch {
        alert('Greška pri učitavanju. Provjerite je li to valjana .json datoteka.');
      }
    };
    reader.readAsText(file);
  };

  const newDocument = () => {
    if (sections.length > 0 && !confirm('Jeste li sigurni? Nespremljan rad će biti izgubljen.')) return;
    setTitle('Novi Dokument');
    setSections([]);
    setNextId(1);
    setShowLoadMenu(false);
  };



  // ─────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────
  const BOX_COLORS = {
    info:     'bg-blue-50   border-2 border-blue-600',
    tips:     'bg-yellow-50 border-2 border-yellow-500',
    warning:  'bg-red-50    border-2 border-red-600',
    success:  'bg-green-50  border-2 border-green-600',
    exercise: 'bg-purple-50 border-2 border-purple-600',
  };

  const renderSection = (section) => {
    const base = 'rounded-lg p-4 my-3';

    if (!preview) {
      return (
        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 space-y-2">
          {section.type === 'divider' && <p className="text-gray-400 italic text-sm">— Razdjelnik (horizontalna linija) —</p>}

          {section.type === 'heading' && <>
            <select value={section.level} onChange={e => updateSection(section.id, 'level', parseInt(e.target.value))} className="px-2 py-1 border rounded">
              <option value={2}>H2 (Veći naslov)</option>
              <option value={3}>H3 (Manji naslov)</option>
            </select>
            <input type="text" value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} className="w-full px-3 py-2 border rounded" />
          </>}

          {section.type === 'paragraph' && <textarea value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} className="w-full px-3 py-2 border rounded min-h-[100px]" />}

          {section.type === 'box' && <>
            <select value={section.boxType} onChange={e => updateSection(section.id, 'boxType', e.target.value)} className="px-2 py-1 border rounded">
              <option value="info">Info (Plavo)</option>
              <option value="tips">Savjeti (Žuto)</option>
              <option value="warning">Upozorenje (Crveno)</option>
              <option value="success">Uspjeh (Zeleno)</option>
              <option value="exercise">Zadatak (Ljubičasto)</option>
            </select>
            <textarea value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} className="w-full px-3 py-2 border rounded min-h-[100px]" />
          </>}

          {(section.type === 'example' || section.type === 'formula') &&
            <textarea value={section.content} onChange={e => updateSection(section.id, 'content', e.target.value)} className="w-full px-3 py-2 border rounded min-h-[100px]" />}

          {section.type === 'list' && <div className="space-y-2">
            {section.content.map((item, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={item} onChange={e => updateListItem(section.id, i, e.target.value)} className="flex-1 px-3 py-2 border rounded" />
                <button onClick={() => deleteListItem(section.id, i)} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">×</button>
              </div>
            ))}
            <button onClick={() => addListItem(section.id)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">+ Dodaj stavku</button>
          </div>}
        </div>
      );
    }

    // Preview mode
    if (section.type === 'heading') {
      const Tag = `h${section.level}`;
      const cls = section.level === 2 ? 'text-2xl font-bold text-blue-900 mt-8 mb-4' : 'text-xl font-bold text-blue-900 mt-6 mb-3';
      return React.createElement(Tag, { className: cls }, section.content);
    }
    if (section.type === 'paragraph') return <p className="leading-relaxed my-4">{section.content}</p>;
    if (section.type === 'box')       return <div className={`${base} ${BOX_COLORS[section.boxType]}`}>{section.content}</div>;
    if (section.type === 'example')   return <div className={`${base} bg-gray-100 border-l-4 border-green-500`}><p className="font-bold text-blue-900">Primjer:</p><p className="mt-2">{section.content}</p></div>;
    if (section.type === 'formula')   return <div className={`${base} bg-blue-50 border-4 border-blue-600 text-center text-xl font-bold`}>{section.content}</div>;
    if (section.type === 'divider')   return <hr className="my-6 border-t-2 border-gray-200" />;
    if (section.type === 'list')      return <ul className="list-disc pl-6 my-4 space-y-2">{section.content.map((item, i) => <li key={i}>{item}</li>)}</ul>;
  };

  // ─────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">


        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="text-2xl font-bold text-blue-900 border-b-2 border-blue-600 focus:outline-none flex-1 mr-4"
            />
            <div className="flex gap-2 flex-shrink-0">


              {/* File Menu */}
              <div className="relative">
                <button onClick={() => setShowLoadMenu(!showLoadMenu)} className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1 text-sm">
                  <FileText size={16} /> Datoteka
                </button>
                {showLoadMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                    <button onClick={newDocument} className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 text-sm rounded-t-lg"><Plus size={16} /> Novi Dokument</button>
                    <button onClick={() => fileInputRef.current?.click()} className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"><Upload size={16} /> Učitaj Projekt</button>
                    <button onClick={() => { saveProject(); setShowLoadMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"><Save size={16} /> Spremi Projekt</button>
                    <hr className="border-gray-200" />
                    <button onClick={() => { downloadHTML(); setShowLoadMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 text-sm"><Download size={16} /> Preuzmi HTML</button>
                    <button onClick={() => { downloadPDF(); setShowLoadMenu(false); }} className="w-full px-4 py-3 text-left hover:bg-gray-100 flex items-center gap-2 text-sm rounded-b-lg"><Download size={16} /> Preuzmi PDF</button>
                  </div>
                )}
              </div>

              <input ref={fileInputRef} type="file" accept=".json" onChange={loadProject} className="hidden" />

              {/* Preview Toggle */}
              <button onClick={() => setPreview(!preview)} className={`px-3 py-2 rounded flex items-center gap-1 text-sm ${preview ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                {preview ? <Eye size={16} /> : <Edit3 size={16} />}
                {preview ? 'Pregled' : 'Uredi'}
              </button>
            </div>
          </div>

          {/* Block Buttons */}
          <div className="flex flex-wrap gap-2">
            {blockTypes.map(t => (
              <button key={t.value} onClick={() => addSection(t.value)} className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 text-xs">
                <span>{t.icon}</span>{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Document Body */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-900 border-b-4 border-blue-600 pb-3 mb-8">{title}</h1>

          {sections.length === 0
            ? <div className="text-center py-16 text-gray-400"><p className="text-xl mb-2">Prazan dokument</p><p className="text-sm">Klikni gumbe iznad da dodaš sadržaj</p></div>
            : sections.map((section, index) => (
              <div key={section.id} className="group relative mb-2">
                {!preview && (
                  <div className="absolute -left-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveSection(section.id, 'up')}   disabled={index === 0}                    className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"><MoveUp   size={14} /></button>
                    <button onClick={() => moveSection(section.id, 'down')} disabled={index === sections.length - 1} className="p-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-30"><MoveDown size={14} /></button>
                    <button onClick={() => deleteSection(section.id)}                                                 className="p-1 bg-red-500 text-white rounded hover:bg-red-600"                ><Trash2   size={14} /></button>
                  </div>
                )}
                {renderSection(section)}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default DocumentGenerator;