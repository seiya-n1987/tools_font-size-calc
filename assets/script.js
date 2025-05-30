function calculateFontSizes() {
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

  if (!baseWidth || !baseFontSize || !maxFontSize || !minFontSize) {
    alert('すべての数値を正しく入力してください');
    return;
  }
  if (breakpoints.length === 0) {
    alert('ブレイクポイントを1つ以上入力してください');
    return;
  }
  if (breakpoints.length > 5) {
    alert('ブレイクポイントは最大5つまでです');
    return;
  }

  // サブフォント比率
  let subFontRatio = (subFontSize && baseFontSize) ? (subFontSize / baseFontSize) : null;

  const tbody = document.getElementById('resultBody');
  tbody.innerHTML = '';

  breakpoints.forEach(bp => {
    let calcSize = baseFontSize * (bp / baseWidth);
    if (calcSize > maxFontSize) calcSize = maxFontSize;
    if (calcSize < minFontSize) calcSize = minFontSize;

    // 小数点は切り上げで整数化（必要に応じて変更可）
    calcSize = Math.ceil(calcSize);

    // 倍数指定があれば最も近い倍数に丸める
    if (!isNaN(multiple) && multiple > 0) {
      calcSize = Math.round(calcSize / multiple) * multiple;
    }

    // サブフォントサイズの計算
    let subCalcSize = '';
    if (subFontRatio) {
      subCalcSize = Math.ceil(calcSize * subFontRatio);
      if (!isNaN(multiple) && multiple > 0) {
        subCalcSize = Math.round(subCalcSize / multiple) * multiple;
      }
    }

    const tr = document.createElement('tr');
    const tdBp = document.createElement('td');
    tdBp.textContent = bp;
    const tdSize = document.createElement('td');
    tdSize.textContent = calcSize;
    const tdSub = document.createElement('td');
    tdSub.textContent = subCalcSize;

    tr.appendChild(tdBp);
    tr.appendChild(tdSize);
    tr.appendChild(tdSub);
    tbody.appendChild(tr);
  });

  document.getElementById('resultTable').style.display = 'table';
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
}); 