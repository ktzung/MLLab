/* MLLab engine — chia tập, precision/recall, quá khớp; kết quả tất định */
window.ML_ENGINE = (function () {
  const r1 = (n) => Math.round(n * 10) / 10;
  const fmt = (n) => Number(n).toLocaleString("vi-VN", { maximumFractionDigits: 1 });

  function split(v) {
    const samples = Math.max(1, Number(v.samples));
    const train = Math.round((samples * Number(v.trainPct)) / 100);
    const val = Math.round((samples * Number(v.valPct)) / 100);
    const test = samples - train - val;
    const testPct = r1((test / samples) * 100);
    const ok = testPct >= 15 ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Tập kiểm tra đủ dày" : "Tập kiểm tra quá mỏng",
      meta: `${fmt(train)} huấn luyện · ${fmt(val)} kiểm định · ${fmt(test)} kiểm tra`,
      statusText: ok ? `Tập kiểm tra ${testPct}% · đạt mốc 15%` : `Tập kiểm tra ${testPct}% · dưới mốc 15%`,
      tags: ["Chia tập", `${fmt(samples)} mẫu`, `test ${testPct}%`],
      trace: [
        { step: "train", label: "Tập huấn luyện", result: "ok", note: `${fmt(samples)} × ${v.trainPct}% = ${fmt(train)} mẫu` },
        { step: "val", label: "Tập kiểm định", result: "ok", note: `${fmt(samples)} × ${v.valPct}% = ${fmt(val)} mẫu` },
        { step: "test", label: "Tập kiểm tra", result: ok ? "ok" : "warn", note: `${fmt(samples)} − ${fmt(train)} − ${fmt(val)} = ${fmt(test)} mẫu` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? "Đủ mẫu để kết luận đáng tin" : "Cần ít nhất 15% mẫu cho tập kiểm tra" }
      ],
      payloadTitle: "Chi tiết phép chia",
      payload: {
        "tổng mẫu": fmt(samples),
        "tỉ lệ huấn luyện": `${v.trainPct}%`,
        "tỉ lệ kiểm định": `${v.valPct}%`,
        "mẫu huấn luyện": fmt(train),
        "mẫu kiểm định": fmt(val),
        "mẫu kiểm tra": fmt(test)
      },
      metrics: [
        { label: "Huấn luyện", value: fmt(train) },
        { label: "Kiểm định", value: fmt(val) },
        { label: "Kiểm tra", value: `${fmt(test)}` },
        { label: "Kết luận", value: ok ? "đạt" : "mỏng" }
      ],
      values: { train, val, test, testPct, ok }
    };
  }

  function metrics(v) {
    const tp = Number(v.tp);
    const fp = Number(v.fp);
    const fn = Number(v.fn);
    const precision = r1((tp / Math.max(1, tp + fp)) * 100);
    const recall = r1((tp / Math.max(1, tp + fn)) * 100);
    const f1 = r1((2 * precision * recall) / Math.max(0.1, precision + recall));
    const ok = precision >= 70 && recall >= 70 ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Hai chỉ số cân bằng" : "Hai chỉ số lệch nhau",
      meta: `Precision ${precision}% · recall ${recall}%`,
      statusText: ok ? `Cả hai chỉ số trên 70%` : `Cần cân bằng lại ngưỡng phân loại`,
      tags: ["Chỉ số", `TP ${fmt(tp)}`, `FP ${fmt(fp)}`, `FN ${fmt(fn)}`],
      trace: [
        { step: "precision", label: "Precision", result: precision >= 70 ? "ok" : "warn", note: `${fmt(tp)} ÷ (${fmt(tp)} + ${fmt(fp)}) = ${precision}%` },
        { step: "recall", label: "Recall", result: recall >= 70 ? "ok" : "warn", note: `${fmt(tp)} ÷ (${fmt(tp)} + ${fmt(fn)}) = ${recall}%` },
        { step: "f1", label: "F1", result: "ok", note: `Trung bình điều hòa của hai chỉ số = ${f1}%` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? "Mô hình vừa ít báo nhầm vừa ít bỏ sót" : "Một chỉ số dưới 70%, cần xem lại ngưỡng" }
      ],
      payloadTitle: "Ma trận nhầm lẫn",
      payload: {
        "dương tính thật": fmt(tp),
        "dương tính giả": fmt(fp),
        "âm tính giả": fmt(fn),
        "precision": `${precision}%`,
        "recall": `${recall}%`,
        "F1": `${f1}%`
      },
      metrics: [
        { label: "Precision", value: `${precision}%` },
        { label: "Recall", value: `${recall}%` },
        { label: "F1", value: `${f1}%` },
        { label: "Kết luận", value: ok ? "cân bằng" : "lệch" }
      ],
      values: { precision, recall, f1, ok }
    };
  }

  function overfit(v) {
    const train = Number(v.trainErr);
    const val = Number(v.valErr);
    const tolerance = Number(v.tolerance);
    const gap = r1(val - train);
    const ok = gap <= tolerance ? 1 : 0;
    return {
      ok: !!ok,
      verdict: ok ? "Khoảng cách trong ngưỡng" : "Dấu hiệu quá khớp",
      meta: `Lỗi huấn luyện ${train}% · kiểm định ${val}%`,
      statusText: ok ? `Khoảng cách ${gap} điểm · trong ngưỡng ${tolerance}` : `Khoảng cách ${gap} điểm · vượt ngưỡng ${tolerance}`,
      tags: ["Quá khớp", `lỗi train ${train}%`, `lỗi val ${val}%`],
      trace: [
        { step: "train", label: "Lỗi huấn luyện", result: "ok", note: `Mô hình sai ${train}% trên dữ liệu đã học` },
        { step: "val", label: "Lỗi kiểm định", result: "ok", note: `Mô hình sai ${val}% trên dữ liệu chưa thấy` },
        { step: "gap", label: "Khoảng cách", result: ok ? "ok" : "warn", note: `${val} − ${train} = ${gap} điểm phần trăm` },
        { step: "verdict", label: "Kết luận", result: ok ? "ok" : "fail", note: ok ? `Trong ngưỡng ${tolerance} điểm` : `Vượt ngưỡng ${tolerance} điểm, nên thêm dữ liệu hoặc giảm độ phức tạp` }
      ],
      payloadTitle: "Chi tiết phép đo",
      payload: {
        "lỗi huấn luyện": `${train}%`,
        "lỗi kiểm định": `${val}%`,
        "khoảng cách": `${gap} điểm %`,
        "ngưỡng cho phép": `${tolerance} điểm %`
      },
      metrics: [
        { label: "Lỗi train", value: `${train}%` },
        { label: "Lỗi val", value: `${val}%` },
        { label: "Khoảng cách", value: `${gap}` },
        { label: "Kết luận", value: ok ? "ổn" : "quá khớp" }
      ],
      values: { gap, ok }
    };
  }

  const runners = { split, metrics, overfit };

  function run(kind, values) {
    const fn = runners[kind];
    if (!fn) return { ok: false, verdict: "Không rõ", meta: "", statusText: "Không rõ", tags: [], trace: [], payload: {}, metrics: [], values: {} };
    return fn(values || {});
  }

  return {
    run,
    kinds: Object.keys(runners),
    labels: { split: "Chia tập", metrics: "Chỉ số", overfit: "Quá khớp" }
  };
})();
