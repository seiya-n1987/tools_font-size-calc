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