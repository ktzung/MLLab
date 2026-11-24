/* MLLab — dữ liệu mô phỏng chia tập, precision/recall và khoảng cách quá khớp */
window.ML_SEED = {
  lab: {
    heading: "Ba câu hỏi trước khi huấn luyện",
    intro: "Chia dữ liệu thành tập huấn luyện, kiểm định và kiểm tra; tính precision, recall từ ma trận nhầm lẫn; đo khoảng cách giữa lỗi huấn luyện và lỗi kiểm định. Engine viết tay, kết quả tất định để đối chiếu từng nhiệm vụ.",
    tabs: [
      {
        id: "split",
        label: "Chia tập",
        title: "Train, validation, test",
        badge: "mẫu",
        runLabel: "Chia dữ liệu",
        hint: "Tập kiểm tra = tổng mẫu trừ tập huấn luyện và tập kiểm định. Tập kiểm tra dưới 15% là quá mỏng để kết luận.",
        fields: [
          { id: "samples", label: "Tổng mẫu", type: "number", min: 100, max: 5000, step: 50, value: 1000 },
          { id: "trainPct", label: "Tập huấn luyện (%)", type: "number", min: 50, max: 80, step: 5, value: 70 },
          { id: "valPct", label: "Tập kiểm định (%)", type: "number", min: 5, max: 30, step: 5, value: 15 }
        ]
      },
      {
        id: "metrics",
        label: "Chỉ số",
        title: "Precision và recall",
        badge: "TP/FP",
        runLabel: "Tính chỉ số",
        hint: "Precision = TP ÷ (TP + FP). Recall = TP ÷ (TP + FN). Hai chỉ số đánh đổi nhau; cần nhìn cả hai trước khi chọn ngưỡng.",
        fields: [
          { id: "tp", label: "Dương tính thật (TP)", type: "number", min: 0, max: 500, step: 10, value: 80 },
          { id: "fp", label: "Dương tính giả (FP)", type: "number", min: 0, max: 200, step: 5, value: 20 },
          { id: "fn", label: "Âm tính giả (FN)", type: "number", min: 0, max: 200, step: 5, value: 20 }
        ]
      },
      {
        id: "overfit",
        label: "Quá khớp",
        title: "Lỗi huấn luyện và kiểm định",
        badge: "gap",
        runLabel: "Đo khoảng cách",
        hint: "Khoảng cách = lỗi kiểm định − lỗi huấn luyện. Trên 10 điểm phần trăm là dấu hiệu quá khớp, cần thêm dữ liệu hoặc giảm độ phức tạp.",
        fields: [
          { id: "trainErr", label: "Lỗi huấn luyện (%)", type: "number", min: 0, max: 50, step: 1, value: 5 },
          { id: "valErr", label: "Lỗi kiểm định (%)", type: "number", min: 0, max: 50, step: 1, value: 20 },
          { id: "tolerance", label: "Ngưỡng cho phép (điểm %)", type: "number", min: 5, max: 20, step: 1, value: 10 }
        ]
      }
    ],
    defaults: {
      split: { samples: 1000, trainPct: 70, valPct: 15 },
      metrics: { tp: 80, fp: 20, fn: 20 },
      overfit: { trainErr: 5, valErr: 20, tolerance: 10 }
    },
    presets: {
      split: [
        { id: "ml-split-base", label: "1.000 mẫu, 70/15/15", dataset: { samples: 1000, trainPct: 70, valPct: 15 } },
        { id: "ml-split-thin", label: "500 mẫu, test mỏng", dataset: { samples: 500, trainPct: 80, valPct: 15 } },
        { id: "ml-split-big", label: "5.000 mẫu, 60/20/20", dataset: { samples: 5000, trainPct: 60, valPct: 20 } }
      ],
      metrics: [
        { id: "ml-metrics-base", label: "TP 80, FP 20, FN 20", dataset: { tp: 80, fp: 20, fn: 20 } },
        { id: "ml-metrics-precise", label: "Ít báo nhầm", dataset: { tp: 100, fp: 5, fn: 40 } },
        { id: "ml-metrics-recall", label: "Bắt rộng", dataset: { tp: 120, fp: 60, fn: 5 } }
      ],
      overfit: [
        { id: "ml-over-base", label: "Lỗi 5 và 20", dataset: { trainErr: 5, valErr: 20, tolerance: 10 } },
        { id: "ml-over-ok", label: "Lỗi 5 và 12", dataset: { trainErr: 5, valErr: 12, tolerance: 10 } },
        { id: "ml-over-bad", label: "Lỗi 2 và 35", dataset: { trainErr: 2, valErr: 35, tolerance: 10 } }
      ]
    },
    examples: [
      { id: "ex-split", kind: "split", label: "500 mẫu chia 80/15", dataset: { samples: 500, trainPct: 80, valPct: 15 } },
      { id: "ex-metrics", kind: "metrics", label: "Ít báo nhầm thì recall ra sao?", dataset: { tp: 100, fp: 5, fn: 40 } },
      { id: "ex-overfit", kind: "overfit", label: "Lỗi kiểm định gấp bảy lần", dataset: { trainErr: 2, valErr: 35, tolerance: 10 } }
    ],
    missions: [
      {
        id: "m-split-test",
        kind: "split",
        title: "Tập kiểm tra",
        prompt: "1.000 mẫu, 70% huấn luyện, 15% kiểm định. Ghi lại số mẫu còn lại cho tập kiểm tra.",
        metric: "test",
        expect: 150,
        hint: "700 huấn luyện, 150 kiểm định; 1.000 − 850 = 150.",
        dataset: { samples: 1000, trainPct: 70, valPct: 15 }
      },
      {
        id: "m-split-ok",
        kind: "split",
        title: "Tập kiểm tra đủ dày",
        prompt: "1.000 mẫu, 70/15. Engine phải kết luận tập kiểm tra đạt ngưỡng 15%.",
        metric: "ok",
        expect: 1,
        hint: "150 mẫu = 15%, đúng ngưỡng.",
        dataset: { samples: 1000, trainPct: 70, valPct: 15 }
      },
      {
        id: "m-precision",
        kind: "metrics",
        title: "Precision",
        prompt: "TP 80, FP 20. Ghi lại precision phần trăm.",
        metric: "precision",
        expect: 80,
        hint: "80 ÷ (80 + 20) = 80%.",
        dataset: { tp: 80, fp: 20, fn: 20 }
      },
      {
        id: "m-recall",
        kind: "metrics",
        title: "Recall",
        prompt: "TP 80, FN 20. Ghi lại recall phần trăm.",
        metric: "recall",
        expect: 80,
        hint: "80 ÷ (80 + 20) = 80%.",
        dataset: { tp: 80, fp: 20, fn: 20 }
      },
      {
        id: "m-gap",
        kind: "overfit",
        title: "Khoảng cách quá khớp",
        prompt: "Lỗi huấn luyện 5%, lỗi kiểm định 20%. Ghi lại khoảng cách theo điểm phần trăm.",
        metric: "gap",
        expect: 15,
        hint: "20 − 5 = 15 điểm phần trăm.",
        dataset: { trainErr: 5, valErr: 20, tolerance: 10 }
      },
      {
        id: "m-overfit-ok",
        kind: "overfit",
        title: "Khoảng cách trong ngưỡng",
        prompt: "Lỗi huấn luyện 5%, lỗi kiểm định 20%, ngưỡng 10. Engine phải kết luận quá khớp.",
        metric: "ok",
        expect: 0,
        hint: "Khoảng cách 15 lớn hơn ngưỡng 10 nên không đạt.",
        dataset: { trainErr: 5, valErr: 20, tolerance: 10 }
      }
    ]
  }
};

window.ML_SEED.home = {
  "title": "MLLab — Máy học, nhìn thấy từng bước",
  "eyebrow": "Khóa học tương tác · 12 bài · tiếng Việt",
  "h1": "Một mô hình.<br><span class=\"hl\">Thấy</span> cả độ chính xác.",
  "sub": "Đi từ dữ liệu, đặc trưng, nhãn đến huấn luyện, kiểm định và triển khai. Mỗi bài là <strong>một sơ đồ sống</strong>, còn phòng mô phỏng chia tập, tính precision/recall và đo khoảng cách quá khớp ngay trong trình duyệt — không cần cài đặt.",
  "note": "Không backend. Số liệu mô phỏng và tiến độ nằm trên máy bạn.",
  "startLabel": "Bắt đầu bài 01",
  "labLabel": "Mở phòng mô phỏng",
  "modesHead": "Bốn cách học, một vòng huấn luyện",
  "modesSub": "Không chỉ đọc công thức. Bạn xem dữ liệu đi từ bảng thô, qua đặc trưng, mô hình đến chỉ số đánh giá, kèm một bài toán cụ thể để đối chiếu.",
  "modes": [
    {
      "title": "Học bằng sơ đồ sống",
      "desc": "Từng cột dữ liệu, đặc trưng và bước huấn luyện hiện ra theo bước, kèm một bài toán phân loại cụ thể để đối chiếu.",
      "href": "#/learn",
      "icon": "process",
      "tone": "blue",
      "cta": "Vào lớp học"
    },
    {
      "title": "Luyện tập tình huống",
      "desc": "8 ca thường gặp: tập kiểm tra quá mỏng, precision thấp, quá khớp và dữ liệu rò rỉ.",
      "href": "#/practice",
      "icon": "star",
      "tone": "coral",
      "cta": "Bắt đầu luyện"
    },
    {
      "title": "Phòng mô phỏng",
      "desc": "Chia tập huấn luyện/kiểm định/kiểm tra, tính precision và recall, đo quá khớp, kèm 6 nhiệm vụ.",
      "href": "#/lab",
      "icon": "gateway",
      "tone": "violet",
      "cta": "Mở phòng mô phỏng"
    },
    {
      "title": "Cheatsheets",
      "desc": "Bảng công thức chỉ số, mẫu chia tập, checklist chống rò rỉ dữ liệu — tra nhanh khi làm bài.",
      "href": "#/cheatsheets",
      "icon": "file",
      "tone": "green",
      "cta": "Mở bảng tra"
    }
  ],
  "outlineHead": "Lộ trình 12 bài",
  "outlineSub": "Từ dữ liệu thô đến mô hình chạy thật: mỗi module trả lời một câu hỏi lớn của máy học.",
  "faq": [
    {
      "q": "Đây có phải khóa học huấn luyện mô hình thật?",
      "a": "Không. Đây là mô phỏng viết tay cho khóa học: chia tập, tính precision/recall và đo quá khớp trên số liệu cố định. Đủ để hiểu quy trình — không thay thế scikit-learn, PyTorch hay một dự án thật."
    },
    {
      "q": "Vì sao số liệu mẫu cố định?",
      "a": "Dữ liệu cố định để kết quả tất định và dễ đối chiếu: 1.000 mẫu, TP 80, FP 20, FN 20. Nhờ vậy nhiệm vụ có đáp án kiểm chứng được, không phụ thuộc dữ liệu ngẫu nhiên."
    },
    {
      "q": "Có cần biết Python trước không?",
      "a": "Không bắt buộc. Bài học giải thích bằng sơ đồ và ví dụ; mẫu mã và bảng công thức nằm ở cheatsheet để tra khi cần."
    },
    {
      "q": "Dùng trên điện thoại hoặc máy chiếu được không?",
      "a": "Được. Giao diện responsive, thanh bên chuyển thành drawer và sơ đồ cuộn ngang trên màn hình nhỏ. Bảng kết quả vẫn đọc được; nên xoay ngang khi xem nhiều cột."
    }
  ],
  "letter": "M",
  "brand": "MLLab",
  "hero": {
    "bar": "ml://dataset/split",
    "title": "dữ liệu · đặc trưng · huấn luyện · đánh giá",
    "aria": "Dữ liệu đi qua đặc trưng, huấn luyện rồi được đánh giá trên tập kiểm tra",
    "states": [
      {
        "label": "Dữ liệu"
      },
      {
        "label": "Đặc trưng"
      },
      {
        "label": "Huấn luyện"
      },
      {
        "label": "Đánh giá"
      }
    ],
    "final": "OK",
    "queueSmall": "Kết quả",
    "queueChip": "150 mẫu",
    "queueVerdict": "tập test",
    "frames": [
      {
        "small": "Tập kiểm tra",
        "b": "150",
        "cls": "hit"
      },
      {
        "small": "Precision",
        "b": "80%"
      },
      {
        "small": "Khoảng cách",
        "b": "15 điểm",
        "cls": "miss"
      }
    ]
  },
  "promo": {
    "eyebrow": "Phòng mô phỏng · chạy cục bộ",
    "h2": "Một mô hình.<br>Ba câu hỏi.",
    "p": "Chia dữ liệu thành ba tập, tính precision và recall từ ma trận nhầm lẫn, đo khoảng cách giữa lỗi huấn luyện và lỗi kiểm định. Sáu nhiệm vụ chấm điểm ngay trên kết quả, kèm gợi ý sửa từng lỗi thiết kế.",
    "cta": "Mở phòng mô phỏng",
    "nodes": [
      {
        "icon": "file",
        "label": "Dữ liệu",
        "sub": "1.000 mẫu",
        "hot": true
      },
      {
        "icon": "task",
        "label": "Nhãn",
        "sub": "có/không"
      },
      {
        "icon": "layers",
        "label": "Đặc trưng",
        "sub": "chuẩn hóa"
      },
      {
        "icon": "grid",
        "label": "Mô hình",
        "sub": "phân loại",
        "hot": true
      },
      {
        "icon": "bolt",
        "label": "Huấn luyện",
        "sub": "giảm lỗi"
      },
      {
        "icon": "check",
        "label": "Đánh giá",
        "sub": "test"
      },
      {
        "icon": "alert",
        "label": "Quá khớp",
        "sub": "gap 15"
      }
    ]
  }
};
window.MLLAB = window.MLLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
window.MLLAB.home = window.ML_SEED.home;

(function () {
  const D = window.MLLAB;
  if (!D) return;
  Object.values(D.lessons || {}).forEach((lesson) => {
    (lesson.steps || []).forEach((step) => {
      if (Array.isArray(step.metrics)) {
        const keyed = {};
        step.metrics.forEach((m) => { if (m && m.key != null) keyed[m.key] = m.value; });
        step.metrics = keyed;
      }
      if (Array.isArray(step.changes)) {
        step.changes = step.changes.map((c) => {
          if (!c || typeof c !== "object") return String(c);
          if (c.before && c.after) return c.label + ": " + c.before + " thành " + c.after;
          return String(c.label || c.after || "");
        });
      }
    });
  });
  (D.cheatsheets || []).forEach((sheet) => {
    (sheet.cards || []).forEach((card) => { if (!card.html && card.body) card.html = card.body; });
  });
})();

(function () {
  const D = window.MLLAB;
  if (!D) return;
  D.practice.push(
    {
      id: "ml-practice-recall",
      module: "danh-gia-va-trien-khai",
      tag: "RECALL",
      title: "Bỏ sót ca bệnh nguy hiểm",
      scenario: "Mô hình sàng lọc 200 ca có nguy cơ, bỏ sót 40 ca thật và báo nhầm 15 ca. Bác sĩ chấp nhận gọi thêm người đến kiểm tra lại, nhưng không chấp nhận bỏ sót. Nhóm phải chọn hướng chỉnh ngưỡng trước khi đưa vào dùng thử. Hãy chọn cách đọc chỉ số đúng nhất cho bối cảnh này.",
      metrics: [
        { label: "Ca thật", value: "200" },
        { label: "Bỏ sót", value: "40" },
        { label: "Báo nhầm", value: "15" }
      ],
      options: [
        "Hạ ngưỡng để tăng recall, chấp nhận báo nhầm nhiều hơn rồi đo lại precision",
        "Nâng ngưỡng để precision cao hơn dù recall giảm",
        "Giữ nguyên ngưỡng vì tổng số ca báo nhầm đang thấp",
        "Bỏ chỉ số recall và chỉ theo dõi độ chính xác tổng thể"
      ],
      correct: 0,
      explain: "Recall hiện là 160 ÷ 200 = 80%, nghĩa là bỏ sót 20% ca thật. Khi chi phí bỏ sót cao hơn chi phí kiểm tra lại, hạ ngưỡng để tăng recall là lựa chọn đúng, sau đó đo lại precision để biết phải trả giá bao nhiêu ca báo nhầm. Nâng ngưỡng làm bỏ sót thêm, còn nhìn độ chính xác tổng thể dễ che mất lỗi trên lớp thiểu số."
    },
    {
      id: "ml-practice-deploy",
      module: "danh-gia-va-trien-khai",
      tag: "DEPLOY",
      title: "Dữ liệu thật lệch khỏi lúc huấn luyện",
      scenario: "Mô hình phiên bản 2.3 đạt 88% trên tập kiểm tra, nhưng sau ba tuần chạy thật, tỉ lệ dữ liệu đầu vào khác phân phối huấn luyện tăng lên 12% và thời gian phản hồi 45 ms. Đội vận hành chưa có kế hoạch khi chất lượng giảm. Hãy chọn quy trình triển khai đúng nhất.",
      metrics: [
        { label: "Điểm kiểm tra", value: "88%" },
        { label: "Lệch dữ liệu", value: "12%" },
        { label: "Độ trễ", value: "45 ms" }
      ],
      options: [
        "Giám sát lệch dữ liệu và chất lượng theo tuần, giữ phiên bản cũ để lùi khi chỉ số xấu đi",
        "Chỉ theo dõi độ trễ vì đây là chỉ số người dùng cảm nhận được",
        "Huấn luyện lại mỗi ngày trên toàn bộ dữ liệu mới mà không kiểm định",
        "Tắt giám sát để tránh cảnh báo làm phiền đội vận hành"
      ],
      correct: 0,
      explain: "Điểm 88% chỉ đúng trên dữ liệu giống lúc huấn luyện. Khi 12% đầu vào lệch phân phối, cần giám sát định kỳ cả lệch dữ liệu lẫn chất lượng dự đoán, đồng thời giữ phiên bản trước để lùi nhanh. Huấn luyện lại hằng ngày mà không kiểm định dễ đưa mô hình tệ hơn lên production; bỏ giám sát là mất khả năng phát hiện sớm."
    }
  );
})();
