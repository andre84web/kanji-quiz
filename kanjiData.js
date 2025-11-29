// kanjiData.js
// Dati di esempio: puoi estendere questo file con tutti i kanji N5 seguendo lo stesso formato.

export const KANJI_GROUPS = [
  {
    id: 'n5_numbers',
    label: 'Numeri (一〜十)',
    items: [
      { kanji: '一', reading: 'いち' },
      { kanji: '二', reading: 'に' },
      { kanji: '三', reading: 'さん' },
      { kanji: '四', reading: 'よん' },
      { kanji: '五', reading: 'ご' },
      { kanji: '六', reading: 'ろく' },
      { kanji: '七', reading: 'なな' },
      { kanji: '八', reading: 'はち' },
      { kanji: '九', reading: 'きゅう' },
      { kanji: '十', reading: 'じゅう' }
    ]
  },
  {
    id: 'n5_days',
    label: 'Giorni / Tempo base',
    items: [
      { kanji: '日', reading: 'にち' },
      { kanji: '月', reading: 'つき' },
      { kanji: '年', reading: 'とし' },
      { kanji: '時', reading: 'じ' }
    ]
  },
  {
    id: 'n5_people',
    label: 'Persone / Pronomi',
    items: [
      { kanji: '人', reading: 'ひと' },
      { kanji: '口', reading: 'くち' },
      { kanji: '名', reading: 'な' }
    ]
  },
  {
    id: 'n5_school',
    label: 'Scuola / Studio',
    items: [
      { kanji: '学', reading: 'がく' },
      { kanji: '先', reading: 'せん' },
      { kanji: '生', reading: 'せい' },
      { kanji: '校', reading: 'こう' }
    ]
  }
];

// Nota: più avanti puoi creare altri gruppi (ad es. tutti i N5) aggiungendo oggetti
// con { id, label, items: [{ kanji, reading }, ...] } in questo array.
