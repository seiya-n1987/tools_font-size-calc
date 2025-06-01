// Google Fonts Picker対応
let selectedFont = 'Noto Sans JP'; // デフォルト

// プレビューのフォントサイズをウィンドウ幅に応じて切り替える
let responsiveFontData = [];

function updatePreviewArea(breakpoints, fontSizes, fontFamily) {
  const previewArea = document.getElementById('previewArea');
  // プレビューサンプルを格納する専用divを用意
  let samplesDiv = document.getElementById('previewSamples');
  if (!samplesDiv) {
    samplesDiv = document.createElement('div');
    samplesDiv.id = 'previewSamples';
    previewArea.appendChild(samplesDiv);
  }
  samplesDiv.innerHTML = '';
  if (!breakpoints.length || !fontSizes.length) return;
  breakpoints.forEach((bp, i) => {
    const size = fontSizes[i];
    const sample = document.createElement('div');
    sample.className = 'preview-sample';
    const label = document.createElement('div');
    label.className = 'preview-label';
    label.textContent = `BP: ${bp}px / ${size}px`;
    const text = document.createElement('div');
    text.className = 'preview-text';
    text.textContent = 'Aa あいう Font Preview';
    text.style.fontSize = size + 'px';
    text.style.fontFamily = `'${fontFamily}', sans-serif`;
    sample.appendChild(label);
    sample.appendChild(text);
    samplesDiv.appendChild(sample);
  });
}

function updateResponsivePreview(fontFamily) {
  const previewArea = document.getElementById('previewArea');
  let preview = document.getElementById('responsivePreview');
  if (!preview) {
    preview = document.createElement('div');
    preview.id = 'responsivePreview';
    preview.className = 'preview-text';
    previewArea.appendChild(preview);
  }
  // サブフォント用プレビュー
  let subPreview = document.getElementById('responsiveSubPreview');
  if (!subPreview) {
    subPreview = document.createElement('div');
    subPreview.id = 'responsiveSubPreview';
    subPreview.className = 'preview-text';
    subPreview.style.marginTop = '0.5em';
    previewArea.appendChild(subPreview);
  }
  // ウィンドウ幅に合うブレイクポイントを探す
  const w = window.innerWidth;
  let size = null;
  let subSize = null;
  if (responsiveFontData.length) {
    for (let i = 0; i < responsiveFontData.length; i++) {
      if (w >= responsiveFontData[i].bp) {
        size = responsiveFontData[i].size;
        subSize = responsiveFontData[i].subSize;
        break;
      }
    }
    if (size === null) {
      size = responsiveFontData[responsiveFontData.length - 1].size;
      subSize = responsiveFontData[responsiveFontData.length - 1].subSize;
    }
  }
  preview.textContent = 'Aa あいう Font Preview';
  preview.style.fontFamily = `'${fontFamily}', sans-serif`;
  preview.style.fontSize = size ? size + 'px' : '';

  // サブフォントサイズがある場合のみ表示
  if (subSize) {
    subPreview.textContent = 'Aa あいう SubFont Preview';
    subPreview.style.fontFamily = `'${fontFamily}', sans-serif`;
    subPreview.style.fontSize = subSize + 'px';
    subPreview.style.display = '';
  } else {
    subPreview.style.display = 'none';
  }
}

function calculateFontSizes() {
  // すべてのinputからエラークラスを外す
  const inputIds = [
    'baseWidth', 'baseFontSize', 'subFontSize', 'maxFontSize', 'minFontSize', 'multiple'
  ];
  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('input-error');
  });
  document.querySelectorAll('.breakpoint').forEach(input => {
    input.classList.remove('input-error');
  });

  // エラーまとめ用
  const errorSummary = document.getElementById('error-summary');
  errorSummary.innerHTML = '';
  errorSummary.style.display = 'none';
  let errorList = [];

  const baseWidth = Number(document.getElementById('baseWidth').value);
  const baseFontSize = Number(document.getElementById('baseFontSize').value);
  const subFontSize = Number(document.getElementById('subFontSize').value);
  const maxFontSize = Number(document.getElementById('maxFontSize').value);
  const minFontSize = Number(document.getElementById('minFontSize').value);
  const multiple = Number(document.getElementById('multiple').value);

  // ブレイクポイントの値を取得
  const breakpointInputs = document.querySelectorAll('.breakpoint');
  let breakpoints = Array.from(breakpointInputs)
    .map(input => Number(input.value))
    .filter(n => !isNaN(n) && n > 0);

  let hasError = false;

  if (!baseWidth) {
    errorList.push('基準ディスプレイ横幅を入力してください');
    document.getElementById('baseWidth').classList.add('input-error');
    hasError = true;
  }
  if (!baseFontSize) {
    errorList.push('基準フォントサイズを入力してください');
    document.getElementById('baseFontSize').classList.add('input-error');
    hasError = true;
  }
  if (!maxFontSize) {
    errorList.push('最大フォントサイズを入力してください');
    document.getElementById('maxFontSize').classList.add('input-error');
    hasError = true;
  }
  if (!minFontSize) {
    errorList.push('最小フォントサイズを入力してください');
    document.getElementById('minFontSize').classList.add('input-error');
    hasError = true;
  }
  if (breakpoints.length === 0) {
    errorList.push('ブレイクポイントを1つ以上入力してください');
    breakpointInputs.forEach(input => input.classList.add('input-error'));
    hasError = true;
  }
  if (breakpoints.length > 5) {
    errorList.push('ブレイクポイントは最大5つまでです');
    breakpointInputs.forEach(input => input.classList.add('input-error'));
    hasError = true;
  }

  if (hasError) {
    errorSummary.innerHTML = '<ul style="margin:0;padding-left:1.2em;">' + errorList.map(e => `<li>${e}</li>`).join('') + '</ul>';
    errorSummary.style.display = 'block';
    document.getElementById('resultTable').style.display = 'none';
    return;
  } else {
    errorSummary.innerHTML = '';
    errorSummary.style.display = 'none';
  }

  // サブフォント比率
  let subFontRatio = (subFontSize && baseFontSize) ? (subFontSize / baseFontSize) : null;

  const tbody = document.getElementById('resultBody');
  tbody.innerHTML = '';

  // レスポンシブ用データ
  responsiveFontData = [];

  breakpoints.forEach(bp => {
    let calcSize = baseFontSize * (bp / baseWidth);
    if (calcSize > maxFontSize) calcSize = maxFontSize;
    if (calcSize < minFontSize) calcSize = minFontSize;
    calcSize = Math.ceil(calcSize);
    if (!isNaN(multiple) && multiple > 0) {
      calcSize = Math.round(calcSize / multiple) * multiple;
    }
    let subCalcSize = null;
    if (subFontRatio) {
      subCalcSize = Math.ceil(calcSize * subFontRatio);
      if (!isNaN(multiple) && multiple > 0) {
        subCalcSize = Math.round(subCalcSize / multiple) * multiple;
      }
    }
    responsiveFontData.push({ bp, size: calcSize, subSize: subCalcSize });
    const tr = document.createElement('tr');
    const tdBp = document.createElement('td');
    tdBp.textContent = bp;
    const tdSize = document.createElement('td');
    tdSize.textContent = calcSize;
    const tdSub = document.createElement('td');
    tdSub.textContent = subCalcSize || '';
    tr.appendChild(tdBp);
    tr.appendChild(tdSize);
    tr.appendChild(tdSub);
    tbody.appendChild(tr);
  });

  // ブレイクポイント降順にソート
  responsiveFontData.sort((a, b) => b.bp - a.bp);

  document.getElementById('resultTable').style.display = 'table';

  // Google Fonts Pickerで選択されたフォント名を使う
  updateResponsivePreview(selectedFont);
}

function addRealtimeEvents() {
  const ids = [
    'baseWidth', 'baseFontSize', 'subFontSize', 'maxFontSize', 'minFontSize', 'multiple'
  ];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculateFontSizes);
  });
  document.querySelectorAll('.breakpoint').forEach(input => {
    input.addEventListener('input', calculateFontSizes);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addRealtimeEvents();
  calculateFontSizes(); // 初期表示

  // モーダル制御
  const helpIcon = document.getElementById('helpIcon');
  const helpModal = document.getElementById('helpModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  if (helpIcon && helpModal && closeModalBtn) {
    helpIcon.addEventListener('click', () => {
      helpModal.style.display = 'block';
    });
    closeModalBtn.addEventListener('click', () => {
      helpModal.style.display = 'none';
    });
    // モーダル外クリックで閉じる
    window.addEventListener('click', (e) => {
      if (e.target === helpModal) {
        helpModal.style.display = 'none';
      }
    });
  }

  // Google Fonts Picker初期化
  if (window.jQuery && $('#fontPicker').fontpicker) {
    $('#fontPicker').fontpicker({
      // 日本語フォントも含めたい場合はfamiliesで追加可能
      families: [
        'Noto Sans JP', 'Roboto', 'Merriweather', 'Montserrat', 'Oswald', 'Lato', 'Open Sans', 'Raleway', 'M PLUS 1p', 'Sawarabi Gothic', 'Kosugi Maru', 'Shippori Mincho', 'Yuji Syuku', 'Zen Maru Gothic'
      ],
      // デフォルト
      pickertype: 'full',
      lazyLoad: true,
      sort: 'popularity',
      search: true
    });
    $('#fontPicker').on('change', function(e) {
      selectedFont = $(this).val() || 'Noto Sans JP';
      calculateFontSizes();
    });
    // 初期値
    $('#fontPicker').val(selectedFont);
    $('#fontPicker').trigger('change');
  }

  window.addEventListener('resize', () => {
    updateResponsivePreview(selectedFont);
  });
}); 