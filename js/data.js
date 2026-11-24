/* MLLab — module 01: dữ liệu và đặc trưng */
window.MLLAB = window.MLLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const D = window.MLLAB;

  D.modules.push({
    id: "du-lieu-va-dac-trung",
    num: "01",
    title: "Dữ liệu và đặc trưng",
    tone: "blue",
    blurb: "Máy học bắt đầu từ một bảng dữ liệu, không phải từ thuật toán. Bốn bài này đi qua thứ tự: đọc bảng thô, biến cột thành đặc trưng số, kiểm tra nhãn và chia ba tập. Mỗi bước có số liệu để đối chiếu, kèm những lỗi nhỏ làm kết quả đẹp mà sai.",
    lessons: ["du-lieu", "dac-trung", "nhan", "chia-tap"]
  });

  D.lessons["du-lieu"] = {
    id: "du-lieu",
    module: "du-lieu-va-dac-trung",
    title: "Dữ liệu thô",
    shortTitle: "Dữ liệu thô",
    subtitle: "Đọc bảng mẫu trước khi huấn luyện",
    blurb: "Một tệp CSV 1.000 dòng, 5 cột nhìn sạch cho đến khi đếm kỹ. Bài này chỉ bốn phép kiểm tra rẻ nhất: số dòng, số cột, tỉ lệ ô thiếu và dòng trùng lặp, để mô hình không học từ một bảng sai.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["bảng dữ liệu", "ô thiếu", "trùng lặp", "kiểu dữ liệu", "làm sạch"],
    metrics: [
      { key: "rows", label: "Số dòng", tone: "blue" },
      { key: "cols", label: "Số cột", tone: "mint" },
      { key: "missingPct", label: "Ô thiếu", tone: "yellow" },
      { key: "dupPct", label: "Dòng trùng", tone: "coral" }
    ],
    nodes: [
      { id: "file", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Tệp dữ liệu thô", sub: "CSV, 1.000 dòng" },
      { id: "grid", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Bảng mẫu", sub: "1.000 dòng, 5 cột" },
      { id: "cols", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Năm cột", sub: "nghỉ, điểm, giờ, nhãn" },
      { id: "audit", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Bộ kiểm tra", sub: "đếm dòng và ô trống" },
      { id: "missing", type: "alert", x: 55, y: 310, w: 200, h: 70, label: "Ô dữ liệu thiếu", sub: "37 ô trên 5.000" },
      { id: "gate", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Cổng chất lượng", sub: "đủ sạch mới huấn luyện" },
      { id: "dup", type: "queue", x: 625, y: 310, w: 200, h: 70, label: "Dòng trùng lặp", sub: "12 dòng nhập hai lần" }
    ],
    edges: [
      { id: "file-grid", from: "file", to: "grid", kind: "data", label: "đọc 1.000 dòng" },
      { id: "grid-cols", from: "grid", to: "cols", kind: "data", label: "liệt kê 5 cột" },
      { id: "grid-audit", from: "grid", to: "audit", kind: "control", label: "chạy kiểm tra", bow: -22 },
      { id: "audit-grid", from: "audit", to: "grid", kind: "response", label: "báo cáo lỗi", bow: 22 },
      { id: "audit-missing", from: "audit", to: "missing", kind: "data", label: "37 ô trống" },
      { id: "audit-dup", from: "audit", to: "dup", kind: "data", label: "12 dòng lặp" },
      { id: "audit-gate", from: "audit", to: "gate", kind: "control", label: "đạt thì cho qua" }
    ],
    learn: [
      "Mỗi dòng là một mẫu, mỗi cột là một thuộc tính; cả bảng có <code>5.000</code> ô.",
      "Kiểm số dòng và số cột trước, vì thiếu dòng là mất mẫu không lấy lại được.",
      "Đếm ô thiếu theo từng cột, không chỉ đếm tổng, để biết cột nào đáng bỏ.",
      "Gộp dòng trùng trước khi chia tập, nếu không mẫu sẽ xuất hiện ở cả hai phía."
    ],
    steps: [
      {
        short: "Bảng là gì",
        type: "concept",
        title: "Một bảng, hai loại cột",
        body: "Mở tệp CSV của lớp ra, ta thấy một bảng: mỗi dòng là một sinh viên, mỗi cột là một thuộc tính. Bảng mẫu ở đây có 1.000 dòng và 5 cột, tức <code>5.000</code> ô dữ liệu. Bốn cột đầu là đầu vào gồm số buổi nghỉ, điểm giữa kỳ, giờ tự học mỗi tuần và giới tính; cột cuối là nhãn cho biết sinh viên trượt hay đỗ. Trước khi nghĩ đến thuật toán, hãy đọc đúng hình dạng bảng và vai trò từng cột. Nhầm cột nhãn thành đầu vào là lỗi tốn kém nhất, vì mô hình sẽ học đúng thứ mà lúc dự đoán nó không được phép biết.",
        focus: ["file", "grid", "cols"],
        edges: ["file-grid", "grid-cols"],
        metrics: { rows: "1.000", cols: "5", missingPct: "chưa đo", dupPct: "chưa đo" },
        changes: [
          "Biết bảng có 1.000 dòng và 5 cột, tức 5.000 ô.",
          "Tách rõ bốn cột đầu vào và một cột nhãn."
        ],
        note: "Ghi lại hình dạng bảng ngay từ đầu để mọi bước sau đối chiếu được."
      },
      {
        short: "Ba kiểu cột",
        type: "flow",
        title: "Số, phạm trù và nhãn",
        body: "Năm cột không cùng kiểu. Ba cột là số thực: số buổi nghỉ, điểm giữa kỳ, giờ tự học. Một cột là phạm trù: giới tính với hai giá trị. Một cột là nhãn nhị phân: trượt hoặc đỗ. Kiểu sai thường không báo lỗi mà chỉ làm hỏng kết quả, ví dụ điểm ghi là <code>\"8,5\"</code> dạng chuỗi nên bị coi là phạm trù, hoặc số buổi nghỉ lưu thành chữ. Hãy in kiểu từng cột bằng <code>dtypes</code> rồi đối chiếu với ý nghĩa thật. Cột số phải ép về số, cột phạm trù phải ghi rõ danh sách giá trị, còn cột nhãn phải tách riêng ngay từ bước này.",
        focus: ["cols", "grid", "audit"],
        edges: ["grid-cols", "grid-audit"],
        metrics: { rows: "1.000", cols: "5", missingPct: "chưa đo", dupPct: "chưa đo" },
        changes: [
          "Ba cột số, một cột phạm trù, một cột nhãn được ghi rõ.",
          "Cột điểm sai kiểu chuỗi được phát hiện trước khi huấn luyện."
        ],
        note: "Một cột sai kiểu có thể làm mô hình học nhiễu thay vì học quy luật."
      },
      {
        short: "Ô thiếu",
        type: "detail",
        title: "37 ô trống xử lý thế nào",
        body: "Trên 5.000 ô có 37 ô trống, tức <code>0,74%</code>, và chúng không rải đều: 28 ô nằm ở cột giờ tự học. Tỉ lệ dưới 1% nghe nhỏ, nhưng nếu xóa cả dòng thì mất 28 sinh viên, trong đó phần lớn là người ít tự học, đúng nhóm khó đoán nhất. Ba cách xử lý: xóa dòng, điền giá trị trung vị, hoặc thêm cột cờ báo thiếu. Với cột số lệch, trung vị an toàn hơn trung bình. Điều tối kỵ là tính trung vị trên toàn bộ dữ liệu trước khi chia tập, vì như vậy thông tin của tập kiểm tra đã chảy vào tập huấn luyện.",
        focus: ["missing", "audit", "gate"],
        edges: ["audit-missing", "audit-gate"],
        metrics: { rows: "1.000", cols: "5", missingPct: "0,74%", dupPct: "chưa đo" },
        changes: [
          "37 ô trống được đếm theo cột thay vì chỉ đếm tổng.",
          "Chọn điền trung vị và thêm cột cờ thay vì xóa 28 dòng."
        ],
        note: "Trung vị phải tính trên tập huấn luyện, không tính trên cả bảng."
      },
      {
        short: "Dòng trùng",
        type: "pitfall",
        title: "12 dòng nhập hai lần",
        body: "Bảng có 12 dòng trùng hoàn toàn, chiếm <code>1,2%</code>, do một lần nhập lại danh sách điểm. Nếu để nguyên, cùng một sinh viên có thể rơi vào tập huấn luyện và tập kiểm tra, và mô hình chỉ cần nhớ mã sinh viên là đạt điểm cao trên tập kiểm tra. Đây là dạng rò rỉ dữ liệu khó thấy nhất vì bảng vẫn trông bình thường. Hãy gộp trùng theo toàn bộ cột, trừ cột mã, rồi ghi lại số dòng đã bỏ. Sau khi gộp, bảng còn 988 dòng; mọi phép chia tập phải dùng con số 988 này, không dùng lại 1.000.",
        focus: ["dup", "audit", "gate"],
        edges: ["audit-dup", "audit-gate"],
        metrics: { rows: "988", cols: "5", missingPct: "0,74%", dupPct: "1,2%" },
        changes: [
          "12 dòng trùng bị gộp, bảng còn 988 dòng.",
          "Mọi phép chia tập sau đó dùng mốc 988 thay vì 1.000."
        ],
        note: "Kiểm trùng theo cặp cột định danh, không chỉ theo một cột."
      },
      {
        short: "Bảng kiểm",
        type: "final",
        title: "Bốn phép kiểm trước khi học",
        tone: "final",
        body: "Chốt lại bốn phép kiểm rẻ nhất, chạy trước mọi thử nghiệm mô hình. Một: đếm dòng và cột, ghi ra <code>988 × 5</code> sau khi gộp trùng. Hai: in kiểu từng cột, sửa cột số bị lưu thành chuỗi. Ba: đếm ô thiếu theo cột, quyết định điền hay bỏ, và chỉ tính tham số điền trên tập huấn luyện. Bốn: gộp dòng trùng và kiểm lại xem mã sinh viên có lặp giữa các tập hay không. Kết quả của bốn phép này nên nằm trong một tệp báo cáo ngắn, có số cụ thể, để người sau đọc là biết bảng đã qua những bước gì.",
        focus: "all",
        edges: "all",
        metrics: { rows: "988", cols: "5", missingPct: "0,74%", dupPct: "0%" },
        changes: [
          "Bảng sạch còn 988 dòng, 0,74% ô thiếu đã xử lý có ghi chú.",
          "Có báo cáo bốn phép kiểm để tái lập trước khi huấn luyện."
        ],
        note: "Bảng sạch không phải bảng hoàn hảo, mà là bảng đã biết rõ khuyết điểm."
      }
    ]
  };

  D.lessons["dac-trung"] = {
    id: "dac-trung",
    module: "du-lieu-va-dac-trung",
    title: "Đặc trưng",
    shortTitle: "Đặc trưng",
    subtitle: "Số hóa, mã hóa, chuẩn hóa",
    blurb: "Mô hình không đọc được chữ và không công bằng với các cột lệch thang. Bài này biến bảng thô thành ma trận số: mã hóa phạm trù, chuẩn hóa cột lớn, và chỉ tính tham số trên tập huấn luyện để không rò rỉ.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["đặc trưng", "mã hóa", "chuẩn hóa", "ma trận", "rò rỉ"],
    metrics: [
      { key: "features", label: "Số đặc trưng", tone: "blue" },
      { key: "numeric", label: "Cột số", tone: "mint" },
      { key: "scaled", label: "Cột đã chuẩn hóa", tone: "yellow" },
      { key: "ok", label: "Đạt kiểm tra", tone: "coral" }
    ],
    nodes: [
      { id: "raw", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Bảng thô", sub: "số và chữ lẫn nhau" },
      { id: "encode", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Số hóa", sub: "chữ thành số" },
      { id: "onehot", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Mã hóa phạm trù", sub: "one-hot 4 cột" },
      { id: "audit", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Kiểm tra phân bố", sub: "trung bình gần 0" },
      { id: "scale", type: "signal", x: 55, y: 310, w: 200, h: 70, label: "Chuẩn hóa", sub: "z-score, độ lệch 1" },
      { id: "matrix", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "Ma trận đặc trưng", sub: "988 dòng, 12 cột" },
      { id: "model", type: "task", x: 625, y: 310, w: 200, h: 70, label: "Mô hình", sub: "học nhanh, đều hơn" }
    ],
    edges: [
      { id: "raw-encode", from: "raw", to: "encode", kind: "data", label: "cột phạm trù" },
      { id: "encode-onehot", from: "encode", to: "onehot", kind: "data", label: "4 giá trị" },
      { id: "onehot-matrix", from: "onehot", to: "matrix", kind: "data", label: "cột 0 và 1" },
      { id: "raw-scale", from: "raw", to: "scale", kind: "data", label: "cột số lệch" },
      { id: "scale-matrix", from: "scale", to: "matrix", kind: "data", label: "đã co giãn" },
      { id: "matrix-audit", from: "matrix", to: "audit", kind: "control", label: "soi phân bố", bow: 22 },
      { id: "audit-model", from: "audit", to: "model", kind: "response", label: "đạt thì học", bow: -22 }
    ],
    learn: [
      "Đặc trưng là cột mà mô hình thật sự nhìn thấy, sau khi đã số hóa.",
      "Phạm trù hai giá trị dùng <code>0/1</code>, nhiều giá trị dùng one-hot, không dùng thứ tự giả.",
      "Chuẩn hóa z-score đưa mỗi cột về trung bình 0, độ lệch chuẩn 1.",
      "Tham số chuẩn hóa chỉ tính trên tập huấn luyện rồi áp cho tập khác."
    ],
    steps: [
      {
        short: "Đặc trưng là gì",
        type: "concept",
        title: "Cột nào mô hình nhìn thấy",
        body: "Đặc trưng là những gì mô hình thật sự nhận vào, không phải toàn bộ bảng. Bảng thô có 5 cột, nhưng cột mã sinh viên chỉ là định danh, cột nhãn là câu trả lời, nên chỉ còn 3 cột dùng được. Sau khi mã hóa, con số này thành <code>12</code> đặc trưng: 4 cột số gốc cộng 8 cột 0/1 sinh ra từ hai cột phạm trù. Nhiều đặc trưng hơn không có nghĩa là tốt hơn; mỗi cột thêm vào là thêm nhiễu và thêm chi phí tính. Câu hỏi đúng là cột này có giúp dự đoán nhãn hay không, và ta có biết giá trị của nó lúc dự đoán thật hay không.",
        focus: ["raw", "encode", "matrix"],
        edges: ["raw-encode", "encode-onehot"],
        metrics: { features: "4", numeric: "3", scaled: "0", ok: "chưa" },
        changes: [
          "Bỏ cột mã sinh viên và tách cột nhãn khỏi đầu vào.",
          "Xác định 4 cột gốc sẽ trở thành đặc trưng."
        ],
        note: "Một đặc trưng chỉ có giá trị nếu biết nó trước thời điểm cần dự đoán."
      },
      {
        short: "Mã hóa",
        type: "flow",
        title: "Từ chữ sang cột 0 và 1",
        body: "Cột giới tính có hai giá trị, chỉ cần một cột <code>0/1</code>. Cột ngành học có bốn giá trị, nếu đánh số 1 đến 4 thì mô hình sẽ hiểu ngành 4 lớn gấp bốn lần ngành 1, một thứ tự không tồn tại. Cách đúng là one-hot: bốn cột nhị phân, mỗi dòng có đúng một cột bằng 1. Với 988 dòng, ma trận thành <code>988 × 12</code>. One-hot làm số cột tăng theo số giá trị, nên với cột có hàng trăm giá trị như mã tỉnh, hãy gộp nhóm hiếm trước. Đừng mã hóa nhãn thành đặc trưng, dù chỉ để thử, vì đó là rò rỉ trực tiếp.",
        focus: ["encode", "onehot", "matrix"],
        edges: ["encode-onehot", "onehot-matrix"],
        metrics: { features: "12", numeric: "4", scaled: "0", ok: "chưa" },
        changes: [
          "Hai cột phạm trù thành 8 cột 0/1, tổng cộng 12 đặc trưng.",
          "Ma trận đặc trưng có hình dạng 988 × 12."
        ],
        note: "Đánh số thứ tự cho phạm trù không có thứ tự là lỗi rất hay gặp."
      },
      {
        short: "Chuẩn hóa",
        type: "detail",
        title: "Vì sao phải chuẩn hóa",
        body: "Cột giờ tự học chạy từ 0 đến 20, còn cột thu nhập gia đình chạy từ 5 đến 500 triệu. Nếu để nguyên, mọi phép tính khoảng cách gần như chỉ đo cột thu nhập, và mô hình dùng gradient sẽ cập nhật rất chậm theo hướng cột nhỏ. Chuẩn hóa z-score trừ trung bình rồi chia độ lệch chuẩn, đưa mỗi cột về trung bình 0 và độ lệch 1. Với cột lệch mạnh, cân nhắc <code>log(1 + x)</code> trước khi chuẩn hóa. Điểm mấu chốt: trung bình và độ lệch phải tính trên tập huấn luyện, rồi áp nguyên sang tập kiểm định và tập kiểm tra, không tính lại.",
        focus: ["scale", "matrix", "audit"],
        edges: ["raw-scale", "scale-matrix"],
        metrics: { features: "12", numeric: "12", scaled: "6", ok: "một phần" },
        changes: [
          "Sáu cột số được đưa về cùng thang đo trung bình 0.",
          "Tham số chuẩn hóa lưu lại để áp cho tập kiểm định và kiểm tra."
        ],
        note: "Chuẩn hóa không làm mất thông tin, chỉ đổi đơn vị đo."
      },
      {
        short: "Rò rỉ",
        type: "pitfall",
        title: "Ba lỗi làm đặc trưng nhiễm",
        body: "Ba lỗi thường gặp. Thứ nhất, tính trung bình và độ lệch trên toàn bộ 988 dòng rồi mới chia tập, khiến thông tin tập kiểm tra chảy ngược vào đặc trưng. Thứ hai, tạo đặc trưng từ nhãn như cột điểm cuối kỳ, vì lúc dự đoán thật ta chưa có điểm cuối kỳ. Thứ ba, thêm đặc trưng dẫn xuất tính trên cả bảng, ví dụ hạng thu nhập so với toàn trường. Cả ba đều làm điểm kiểm định đẹp bất thường, thường trên <code>95%</code>, rồi sụp khi gặp dữ liệu mới. Cách soát: hỏi từng cột xem giá trị của nó có tồn tại trước thời điểm dự đoán hay không.",
        focus: ["raw", "matrix", "audit"],
        edges: ["raw-scale", "matrix-audit"],
        metrics: { features: "12", numeric: "12", scaled: "6", ok: "không" },
        changes: [
          "Ba nguồn rò rỉ được liệt kê theo từng cột đặc trưng.",
          "Điểm kiểm định bất thường trên 95% được coi là dấu hiệu cần soát."
        ],
        note: "Điểm quá cao trên tập kiểm định thường là triệu chứng, không phải thành tích."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist đặc trưng sạch",
        tone: "final",
        body: "Chốt lại bằng checklist ngắn dùng được cho mọi bảng. Một: chỉ giữ cột có mặt trước thời điểm dự đoán, bỏ mã định danh và cột nhãn. Hai: mã hóa phạm trù bằng <code>0/1</code> hoặc one-hot, gộp nhóm hiếm trước khi mã hóa. Ba: chuẩn hóa cột số, dùng z-score hoặc log cho cột lệch, và lưu tham số vào tệp. Bốn: fit tham số trên tập huấn luyện, transform cho tập kiểm định và kiểm tra. Năm: ghi lại danh sách 12 đặc trưng kèm kiểu dữ liệu. Sáu: kiểm tra lại phân bố sau biến đổi, trung bình gần 0 và không có cột hằng. Bảy: chạy lại từ đầu trên bảng sạch để chắc kết quả tái lập được.",
        focus: "all",
        edges: "all",
        metrics: { features: "12", numeric: "12", scaled: "8", ok: "đạt" },
        changes: [
          "Bộ 12 đặc trưng có danh sách, kiểu dữ liệu và tham số chuẩn hóa đi kèm.",
          "Mọi phép biến đổi đều fit trên tập huấn luyện, không trên cả bảng."
        ],
        note: "Đặc trưng tốt giúp mô hình đơn giản vẫn học được; đặc trưng nhiễm thì mô hình phức tạp cũng vô ích."
      }
    ]
  };

  D.lessons["nhan"] = {
    id: "nhan",
    module: "du-lieu-va-dac-trung",
    title: "Nhãn và mục tiêu",
    shortTitle: "Nhãn",
    subtitle: "Nhãn đúng, nhãn lệch, lớp mất cân bằng",
    blurb: "Nhãn là câu trả lời mô hình học, nên nhãn sai thì mô hình chỉ giỏi lặp lại cái sai. Bài này bàn quy tắc gán nhãn, cách rà 10% mẫu bằng tay, xử lý lớp lệch 85/15 và chi phí của việc gán nhãn.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["nhãn", "gán nhãn", "mất cân bằng", "đồng thuận", "chi phí"],
    metrics: [
      { key: "labels", label: "Số nhãn", tone: "blue" },
      { key: "posPct", label: "Tỉ lệ dương", tone: "mint" },
      { key: "imbalance", label: "Độ lệch lớp", tone: "yellow" },
      { key: "ok", label: "Đạt kiểm tra", tone: "coral" }
    ],
    nodes: [
      { id: "task", type: "task", x: 55, y: 80, w: 200, h: 70, label: "Câu hỏi dự đoán", sub: "sinh viên trượt hay đỗ" },
      { id: "label", type: "file", x: 340, y: 80, w: 200, h: 70, label: "Nhãn gốc", sub: "giảng viên gán tay" },
      { id: "rule", type: "book", x: 625, y: 80, w: 200, h: 70, label: "Quy tắc gán nhãn", sub: "một tiêu chí rõ ràng" },
      { id: "gate", type: "check", x: 340, y: 195, w: 200, h: 70, label: "Cổng nhãn", sub: "đồng thuận mới dùng" },
      { id: "review", type: "audit", x: 55, y: 310, w: 200, h: 70, label: "Rà nhãn lệch", sub: "10% mẫu kiểm tay" },
      { id: "balance", type: "layers", x: 340, y: 310, w: 200, h: 70, label: "Cân bằng lớp", sub: "85/15 quá lệch" },
      { id: "cost", type: "clock", x: 625, y: 310, w: 200, h: 70, label: "Chi phí gán", sub: "3 phút mỗi mẫu" }
    ],
    edges: [
      { id: "task-label", from: "task", to: "label", kind: "data", label: "câu hỏi mục tiêu" },
      { id: "label-rule", from: "label", to: "rule", kind: "control", label: "tiêu chí gán" },
      { id: "label-gate", from: "label", to: "gate", kind: "data", label: "nhãn thô" },
      { id: "rule-gate", from: "rule", to: "gate", kind: "control", label: "áp quy tắc" },
      { id: "gate-review", from: "gate", to: "review", kind: "control", label: "mẫu kiểm tay" },
      { id: "review-balance", from: "review", to: "balance", kind: "data", label: "đếm hai lớp" },
      { id: "balance-cost", from: "balance", to: "cost", kind: "data", label: "độ lệch 85/15" }
    ],
    learn: [
      "Nhãn phải trả lời đúng một câu hỏi, cùng một tiêu chí cho mọi mẫu.",
      "Rà tay khoảng <code>10%</code> nhãn để ước lượng tỉ lệ gán sai.",
      "Lớp lệch 85/15 khiến mô hình đoán bừa cũng đạt 85% độ chính xác.",
      "Chi phí gán nhãn tính bằng giờ người, nên phải chọn mẫu đáng gán."
    ],
    steps: [
      {
        short: "Nhãn là gì",
        type: "concept",
        title: "Nhãn là câu trả lời duy nhất",
        body: "Nhãn là giá trị ta muốn mô hình dự đoán, ở đây là trạng thái trượt hay đỗ của từng sinh viên. Bảng có 1.000 nhãn, trong đó 150 sinh viên trượt, tức <code>15%</code>. Nhãn phải trả lời đúng một câu hỏi và dùng cùng một tiêu chí cho mọi dòng: trượt khi điểm tổng dưới 4,0, không tính điểm rèn luyện. Nếu hôm nay tính cả điểm rèn luyện, hôm sau bỏ ra, thì hai nhãn cùng tên nhưng khác nghĩa và mô hình học một mục tiêu mơ hồ. Hãy viết định nghĩa nhãn thành một câu, đặt ngay cạnh bảng dữ liệu, để người gán sau không phải đoán.",
        focus: ["task", "label", "gate"],
        edges: ["task-label", "label-gate"],
        metrics: { labels: "1.000", posPct: "15%", imbalance: "chưa đo", ok: "chưa" },
        changes: [
          "Nhãn được định nghĩa bằng một câu duy nhất, áp cho cả 1.000 dòng.",
          "Biết lớp dương có 150 mẫu, chiếm 15%."
        ],
        note: "Nhãn mơ hồ là lỗi thiết kế, không phải lỗi của mô hình."
      },
      {
        short: "Quy tắc gán",
        type: "flow",
        title: "Gán nhãn bằng quy tắc viết ra",
        body: "Cách rẻ nhất để có nhãn nhất quán là viết quy tắc thành văn bản rồi mới gán. Với bài toán này, quy tắc gồm ba dòng: điểm tổng dưới 4,0 là trượt; từ 4,0 đến dưới 5,0 là cần xem lại; từ 5,0 trở lên là đỗ. Dòng thứ hai không phải nhãn cuối mà là hàng chờ để người có chuyên môn quyết. Mỗi nhãn nên lưu thêm người gán và thời điểm gán, nhờ vậy khi phát hiện lệch ta truy được về đợt nào. Quy tắc phải kiểm được bằng máy với nhãn số, và bằng mắt với nhãn chữ. Đừng để hai người gán theo hai cách hiểu khác nhau rồi trộn chung một cột.",
        focus: ["rule", "label", "gate"],
        edges: ["label-rule", "rule-gate"],
        metrics: { labels: "1.000", posPct: "15%", imbalance: "5,7 : 1", ok: "chưa" },
        changes: [
          "Quy tắc gán nhãn được viết thành ba dòng kiểm được.",
          "Mỗi nhãn có thêm người gán và thời điểm gán."
        ],
        note: "Một hàng chờ cho mẫu khó tốt hơn việc ép mọi mẫu vào hai lớp."
      },
      {
        short: "Lớp lệch",
        type: "detail",
        title: "85/15 và cái bẫy 85%",
        body: "Với 850 mẫu không trượt và 150 mẫu trượt, độ lệch là <code>5,7 : 1</code>. Một mô hình đoán tất cả là không trượt đã đạt 85% độ chính xác mà không học gì, nên con số 85% không nói lên điều gì. Hãy nhìn precision và recall của lớp thiểu số, hoặc dùng F1 và PR-AUC. Ba cách xử lý thường dùng: đặt trọng số lớp trong hàm mất mát, lấy mẫu lại lớp thiểu số, hoặc hạ ngưỡng quyết định. Mọi phép lấy mẫu phải làm sau khi chia tập, chỉ trên tập huấn luyện, nếu không tập kiểm định sẽ mất đúng tỉ lệ thật của lớp trượt.",
        focus: ["balance", "review", "cost"],
        edges: ["review-balance", "balance-cost"],
        metrics: { labels: "1.000", posPct: "15%", imbalance: "5,7 : 1", ok: "không" },
        changes: [
          "Độ lệch lớp được ghi nhận là 5,7 : 1 thay vì chỉ nhìn độ chính xác.",
          "Chọn trọng số lớp thay vì lấy mẫu lại toàn bộ bảng."
        ],
        note: "Độ chính xác 85% trên bảng lệch có thể chỉ là bản sao của lớp đa số."
      },
      {
        short: "Nhãn lệch",
        type: "pitfall",
        title: "9 nhãn sai trong 100 mẫu rà",
        body: "Lấy ngẫu nhiên 100 mẫu, tức 10%, nhờ giảng viên thứ hai gán lại mà không xem nhãn cũ. Kết quả có 9 mẫu lệch, tức <code>9%</code>, chủ yếu do sinh viên thi lại được tính là đỗ. Chín phần trăm là mức đủ để mô hình học sai có hệ thống, vì lỗi tập trung vào một nhóm. Hãy sửa theo lô, ghi lại lý do, rồi rà lại một lô khác để xem lỗi đã giảm chưa. Với nhãn do nhiều người gán, nên đo đồng thuận bằng tỉ lệ khớp; dưới 80% thì phải làm rõ quy tắc trước khi gán tiếp. Chi phí rà 100 mẫu khoảng 5 giờ người, rẻ hơn nhiều so với huấn luyện lại.",
        focus: ["review", "gate", "label"],
        edges: ["gate-review", "label-gate"],
        metrics: { labels: "1.000", posPct: "15%", imbalance: "5,7 : 1", ok: "không" },
        changes: [
          "Phát hiện 9% nhãn sai trong 100 mẫu rà tay.",
          "Sửa theo lô và ghi lý do để lần rà sau so sánh được."
        ],
        note: "Rà 10% mẫu rẻ hơn nhiều so với huấn luyện lại trên nhãn sai."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist nhãn trước khi học",
        tone: "final",
        body: "Chốt lại checklist cho cột nhãn. Một: viết định nghĩa nhãn thành một câu, kèm ví dụ đúng và ví dụ sai. Hai: gán theo quy tắc đã viết, lưu người gán và thời điểm. Ba: rà tay <code>10%</code> mẫu, tính tỉ lệ lệch và sửa theo lô. Bốn: đo độ lệch lớp, ghi rõ 850 và 150, không chỉ ghi độ chính xác. Năm: chọn trọng số lớp hoặc ngưỡng quyết định, và chỉ áp dụng trên tập huấn luyện. Sáu: kiểm tra cột nhãn không lọt vào đặc trưng dưới dạng nào. Bảy: ước lượng chi phí gán cho phần dữ liệu mới, khoảng 3 phút mỗi mẫu, để biết có nên mở rộng tập hay không.",
        focus: "all",
        edges: "all",
        metrics: { labels: "1.000", posPct: "15%", imbalance: "5,7 : 1", ok: "đạt" },
        changes: [
          "Cột nhãn có định nghĩa, người gán và tỉ lệ lệch đã đo.",
          "Có kế hoạch xử lý lớp thiểu số và ngân sách gán nhãn cho dữ liệu mới."
        ],
        note: "Nhãn sạch là tài sản; nhãn bẩn thì mô hình càng mạnh càng sai tự tin."
      }
    ]
  };

  D.lessons["chia-tap"] = {
    id: "chia-tap",
    module: "du-lieu-va-dac-trung",
    title: "Chia ba tập",
    shortTitle: "Chia ba tập",
    subtitle: "70/15/15 trên 1.000 mẫu",
    blurb: "Một bảng sạch vẫn chưa dùng được nếu chia sai. Bài này chia 1.000 mẫu thành 700 huấn luyện, 150 kiểm định và 150 kiểm tra, giải thích vì sao tập test dưới 15% là quá mỏng và cách giữ tỉ lệ lớp khi chia.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["chia tập", "huấn luyện", "kiểm định", "kiểm tra", "tỉ lệ lớp"],
    metrics: [
      { key: "train", label: "Tập huấn luyện", tone: "blue" },
      { key: "val", label: "Tập kiểm định", tone: "mint" },
      { key: "test", label: "Tập kiểm tra", tone: "yellow" },
      { key: "ok", label: "Đạt ngưỡng", tone: "coral" }
    ],
    nodes: [
      { id: "data", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "1.000 mẫu sạch", sub: "đã gộp trùng" },
      { id: "shuffle", type: "signal", x: 340, y: 80, w: 200, h: 70, label: "Xáo trộn", sub: "seed 42 cố định" },
      { id: "splitter", type: "code", x: 625, y: 80, w: 200, h: 70, label: "Bộ chia ba tập", sub: "70/15/15" },
      { id: "gate", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Cổng 15%", sub: "test đủ dày" },
      { id: "train", type: "layers", x: 55, y: 310, w: 200, h: 70, label: "Huấn luyện", sub: "700 mẫu, 70%" },
      { id: "val", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Kiểm định", sub: "150 mẫu, 15%" },
      { id: "test", type: "shield", x: 625, y: 310, w: 200, h: 70, label: "Kiểm tra", sub: "150 mẫu, 15%" }
    ],
    edges: [
      { id: "data-shuffle", from: "data", to: "shuffle", kind: "data", label: "1.000 mẫu" },
      { id: "shuffle-splitter", from: "shuffle", to: "splitter", kind: "control", label: "seed 42" },
      { id: "splitter-train", from: "splitter", to: "train", kind: "data", label: "700 mẫu" },
      { id: "splitter-val", from: "splitter", to: "val", kind: "data", label: "150 mẫu" },
      { id: "splitter-test", from: "splitter", to: "test", kind: "data", label: "150 mẫu" },
      { id: "test-gate", from: "test", to: "gate", kind: "data", label: "đếm mẫu test", bow: 22 },
      { id: "gate-test", from: "gate", to: "test", kind: "response", label: "đạt 15%", bow: -22 }
    ],
    learn: [
      "Ba tập có ba việc khác nhau: học, chọn cấu hình, chấm kết quả cuối.",
      "1.000 mẫu chia <code>70/15/15</code> cho 700, 150 và 150 mẫu.",
      "Tập kiểm tra dưới 15% thì một mẫu đổi kết quả đã làm lệch vài điểm.",
      "Chia theo tỉ lệ lớp để mỗi tập đều có khoảng 15% mẫu trượt."
    ],
    steps: [
      {
        short: "Ba tập",
        type: "concept",
        title: "Học, chọn và chấm",
        body: "Một bảng dữ liệu chỉ dùng để đo một lần thì không đủ tin. Ta cần ba tập với ba nhiệm vụ. Tập huấn luyện để mô hình học tham số. Tập kiểm định để chọn cấu hình: số cây, độ sâu, ngưỡng quyết định. Tập kiểm tra để chấm kết quả cuối cùng và chỉ được dùng đúng một lần. Với 1.000 mẫu, tỉ lệ quen thuộc là <code>70/15/15</code>. Nếu dùng chung một tập cho cả chọn và chấm, ta sẽ chọn cấu hình vừa khít với tập đó và con số báo cáo cao hơn thực tế. Ba tập tách bạch là cách rẻ nhất để biết mô hình có chạy được ngoài đời hay không.",
        focus: ["data", "train", "val", "test"],
        edges: ["splitter-train", "splitter-val", "splitter-test"],
        metrics: { train: "70%", val: "15%", test: "15%", ok: "kế hoạch" },
        changes: [
          "Ba tập được gán ba nhiệm vụ riêng, không dùng lẫn.",
          "Tập kiểm tra được giữ kín cho đến lần chấm cuối."
        ],
        note: "Dùng tập kiểm tra nhiều lần là biến nó thành tập kiểm định."
      },
      {
        short: "Con số cụ thể",
        type: "flow",
        title: "700, 150 và 150",
        body: "Trên 1.000 mẫu đã làm sạch, 70% là <code>700</code> mẫu cho huấn luyện, 15% là <code>150</code> mẫu cho kiểm định, 150 mẫu còn lại cho kiểm tra. Cách chia nên dùng hàm có seed cố định, ví dụ <code>train_test_split</code> với <code>random_state=42</code>, để lần chạy sau ra đúng các mẫu cũ. Quan trọng hơn, hãy chia theo tỉ lệ lớp: 150 mẫu trượt được rải thành khoảng 105 ở tập huấn luyện và 22 đến 23 ở mỗi tập còn lại. Nếu chia ngẫu nhiên không stratify, có lần tập kiểm định chỉ có 8 mẫu trượt, đủ để recall nhảy loạn giữa các lần chạy.",
        focus: ["shuffle", "splitter", "train"],
        edges: ["data-shuffle", "shuffle-splitter", "splitter-train"],
        metrics: { train: "700", val: "150", test: "150", ok: "đạt" },
        changes: [
          "1.000 mẫu chia thành 700, 150 và 150 mẫu.",
          "Tỉ lệ lớp được giữ ở cả ba tập nhờ stratify."
        ],
        note: "Ghi seed vào báo cáo để người khác chia lại ra đúng các tập đó."
      },
      {
        short: "Ngưỡng 15%",
        type: "detail",
        title: "Vì sao test phải đủ dày",
        body: "Với 150 mẫu kiểm tra, mỗi mẫu đổi kết quả làm độ chính xác nhích khoảng <code>0,67</code> điểm phần trăm, nên sai số do may mắn còn chấp nhận được. Nếu chỉ để 50 mẫu, mỗi mẫu đổi kết quả tới 2 điểm phần trăm, và hai lần chia khác nhau có thể cho 84% với 94% trên cùng một mô hình. Đó là lý do ngưỡng thực hành là 15%: dưới mức này, kết luận phụ thuộc vào vài mẫu hiếm. Nếu dữ liệu quá ít, cách tốt hơn là kiểm định chéo k gấp, dùng toàn bộ mẫu cho cả học và đo, thay vì ép ra một tập test mỏng rồi tin vào nó.",
        focus: ["test", "gate", "val"],
        edges: ["test-gate", "gate-test"],
        metrics: { train: "700", val: "150", test: "150", ok: "đạt" },
        changes: [
          "Tập kiểm tra 150 mẫu giữ sai số mỗi mẫu dưới 1 điểm phần trăm.",
          "Ngưỡng 15% được dùng làm điều kiện đạt thay vì chia tùy ý."
        ],
        note: "Tập test mỏng không sai về nguyên tắc, chỉ không đủ để kết luận."
      },
      {
        short: "Rò rỉ khi chia",
        type: "pitfall",
        title: "Chia sai thứ tự",
        body: "Hai lỗi thứ tự làm hỏng cả ba tập. Thứ nhất, chuẩn hóa hoặc điền ô thiếu trên toàn bộ 1.000 mẫu rồi mới chia, khiến trung bình của tập kiểm tra có mặt trong tập huấn luyện. Đúng thứ tự là chia trước, rồi fit tham số trên 700 mẫu huấn luyện. Thứ hai, chia trước khi gộp dòng trùng, nên một sinh viên xuất hiện ở cả hai phía. Ngoài ra, nếu chấm tập kiểm tra sau mỗi lần đổi tham số thì đó là đang dùng nó để chọn mô hình. Hãy đặt quy tắc: tập kiểm tra chỉ mở một lần, sau khi mọi lựa chọn đã chốt trên tập kiểm định.",
        focus: ["data", "shuffle", "test"],
        edges: ["data-shuffle", "splitter-test"],
        metrics: { train: "700", val: "150", test: "150", ok: "cần soát" },
        changes: [
          "Thứ tự đúng được chốt: gộp trùng, chia tập, rồi mới fit tham số.",
          "Tập kiểm tra chỉ được mở một lần sau khi chốt cấu hình."
        ],
        note: "Mọi phép biến đổi học từ dữ liệu đều phải fit sau khi chia."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist chia ba tập",
        tone: "final",
        body: "Chốt lại quy trình chia tập cho bảng 1.000 mẫu đã làm sạch. Một: gộp dòng trùng và xử lý ô thiếu trước, nhưng chưa chuẩn hóa. Hai: chia <code>70/15/15</code> thành 700, 150 và 150 mẫu, có seed cố định. Ba: dùng stratify để mỗi tập giữ khoảng 15% mẫu trượt. Bốn: fit mọi phép chuẩn hóa và điền thiếu trên 700 mẫu huấn luyện, transform cho hai tập còn lại. Năm: chọn cấu hình trên tập kiểm định, ghi lại từng lần thử. Sáu: mở tập kiểm tra đúng một lần và ghi con số cuối. Bảy: lưu seed, tỉ lệ và danh sách mẫu để tái lập.",
        focus: "all",
        edges: "all",
        metrics: { train: "700", val: "150", test: "150", ok: "đạt" },
        changes: [
          "Toàn bộ quy trình chia tập nằm trong một checklist bảy bước.",
          "Seed, tỉ lệ và thứ tự biến đổi được lưu để tái lập kết quả."
        ],
        note: "Chia tập đúng là bước rẻ nhất và cũng hay bị bỏ qua nhất."
      }
    ]
  };

  D.practice.push(
    {
      id: "p-split-mong",
      module: "du-lieu-va-dac-trung",
      tag: "SPLIT",
      tags: ["chia tập", "tập kiểm tra", "tỉ lệ"],
      title: "Tập kiểm tra chỉ có 50 mẫu",
      scenario: "Nhóm của Lan có 1.000 hồ sơ sinh viên và chia theo tỉ lệ 80/15/5: 800 hồ sơ để huấn luyện, 150 để kiểm định, còn 50 cho tập kiểm tra. Mô hình đạt 91% trên tập kiểm định nên cả nhóm tự tin viết báo cáo. Khi giảng viên hỏi vì sao chỉ để 5% cho tập kiểm tra, Lan trả lời là muốn dành thêm dữ liệu cho huấn luyện. Lần chạy sau, chỉ đổi cách chia, độ chính xác trên tập kiểm tra nhảy từ 84% lên 94%. Nhóm cần quyết định giữ tỉ lệ cũ hay chia lại trước khi chốt phần kết luận.",
      options: [
        "Giữ 80/15/5, vì 91% trên tập kiểm định đã là kết quả tốt",
        "Chia lại 70/15/15 để tập kiểm tra có 150 hồ sơ",
        "Dùng luôn tập kiểm định làm tập kiểm tra cho tiết kiệm dữ liệu",
        "Gộp 50 hồ sơ kiểm tra vào tập huấn luyện rồi báo cáo 91%"
      ],
      correct: 1,
      explain: "Với 1.000 mẫu, 5% chỉ là 50 hồ sơ, quá mỏng để kết luận: mỗi mẫu đổi kết quả khoảng 2 điểm phần trăm, nên 84% và 94% có thể chỉ là may mắn. Cách chia lại đúng là 70/15/15, tức 700 hồ sơ huấn luyện, 150 kiểm định và 150 kiểm tra, giữ tập test ở ngưỡng 15%. Bớt 100 hồ sơ khỏi tập huấn luyện không làm mô hình yếu đi. Phương án khác sai: dùng tập kiểm định thay test là tự chấm bài đã xem; gộp test vào train thì không còn gì để đo; nhân bản 50 mẫu lên 150 làm con số đẹp, sai số vẫn thế.",
      metrics: [
        { label: "Tổng mẫu", value: "1.000" },
        { label: "Test hiện tại", value: "50 mẫu" },
        { label: "Test đề xuất", value: "150 mẫu" }
      ]
    },
    {
      id: "p-feature-lech",
      module: "du-lieu-va-dac-trung",
      tag: "FEATURE",
      tags: ["chuẩn hóa", "thu nhập", "rò rỉ"],
      title: "Cột thu nhập 5 đến 500 triệu",
      scenario: "Bảng dữ liệu của nhóm Hùng có cột thu nhập gia đình chạy từ 5 triệu đến 500 triệu đồng, trong khi các cột còn lại như số buổi nghỉ chỉ từ 0 đến 20. Mô hình dự đoán sinh viên trượt cho kết quả kém ổn định: đổi seed là độ chính xác lệch 8 điểm phần trăm. Hùng định bỏ cột thu nhập vì nghĩ nó gây nhiễu, còn Mai muốn thêm cột nhãn cũ dưới dạng đặc trưng để mô hình dễ học hơn. Nhóm cần chọn cách xử lý cột thu nhập và cách tạo đặc trưng đúng trước khi huấn luyện lại.",
      options: [
        "Bỏ cột thu nhập để mô hình chỉ học các cột có thang nhỏ",
        "Đổi cột thu nhập thành nhãn nhị phân giàu và nghèo",
        "Lấy log rồi chuẩn hóa cột thu nhập, fit tham số trên tập huấn luyện",
        "Thêm cột nhãn cũ làm đặc trưng để mô hình học nhanh hơn"
      ],
      correct: 2,
      explain: "Thu nhập 5 đến 500 triệu lệch phải rất mạnh, nên mọi phép tính khoảng cách gần như chỉ đo cột này và mô hình học chậm, không ổn định. Cách đúng là giữ cột, biến đổi <code>log(1 + x)</code> rồi chuẩn hóa z-score, với trung bình và độ lệch chỉ tính trên tập huấn luyện. Bỏ cột là mất thông tin thật; thêm nhãn cũ làm đặc trưng là rò rỉ trực tiếp, vì lúc dự đoán thật không có nhãn. Đổi sang chia theo tỉ lệ lớp hay tăng số cây không giải quyết gốc lệch thang, chỉ làm kết quả khó so sánh hơn.",
      metrics: [
        { label: "Thang thu nhập", value: "5 đến 500 triệu" },
        { label: "Cách xử lý", value: "log rồi z-score" },
        { label: "Tham số fit trên", value: "700 mẫu train" }
      ]
    }
  );

  D.cheatsheets.push({
    id: "data",
    num: "01",
    module: "du-lieu-va-dac-trung",
    title: "Bảng tra dữ liệu máy học",
    intro: "Bảng tra ngắn cho module dữ liệu: bốn phép kiểm trên bảng thô, mẫu chuẩn hóa bằng scikit-learn, cách chọn mã hóa phạm trù, sơ đồ chia ba tập và checklist chống rò rỉ. Dùng khi chuẩn bị dữ liệu trước mỗi lần huấn luyện.",
    cards: [
      {
        title: "Bảng kiểm dữ liệu thô",
        wide: true,
        body: "<table><thead><tr><th>Phép kiểm</th><th>Cách làm</th><th>Ngưỡng cần chú ý</th></tr></thead><tbody><tr><td>Số dòng, số cột</td><td><code>df.shape</code></td><td>Ghi lại mốc gốc, ví dụ 1.000 × 5</td></tr><tr><td>Kiểu từng cột</td><td><code>df.dtypes</code></td><td>Cột số bị lưu thành chuỗi là lỗi phải sửa</td></tr><tr><td>Ô thiếu theo cột</td><td><code>df.isna().sum()</code></td><td>Trên 20% ở một cột thì cân nhắc bỏ cột</td></tr><tr><td>Dòng trùng</td><td><code>df.duplicated().sum()</code></td><td>Gộp trước khi chia tập, kẻo rò rỉ</td></tr></tbody></table>"
      },
      {
        title: "Mẫu chuẩn hóa đúng thứ tự",
        body: "<pre><code>from sklearn.preprocessing import StandardScaler\n\nsc = StandardScaler()\nX_train = sc.fit_transform(X_train)\nX_val   = sc.transform(X_val)\nX_test  = sc.transform(X_test)</code></pre><p>Chỉ <code>fit</code> trên tập huấn luyện; hai tập còn lại chỉ <code>transform</code>. Cột lệch mạnh thì dùng <code>log1p</code> trước khi chuẩn hóa.</p>"
      },
      {
        title: "Chọn mã hóa phạm trù",
        body: "<table><thead><tr><th>Loại cột</th><th>Cách mã hóa</th></tr></thead><tbody><tr><td>Hai giá trị</td><td>Một cột 0/1</td></tr><tr><td>Ba đến mười giá trị, không thứ tự</td><td>One-hot</td></tr><tr><td>Có thứ tự thật (bé, vừa, lớn)</td><td>Số thứ tự 1, 2, 3</td></tr><tr><td>Hàng trăm giá trị</td><td>Gộp nhóm hiếm rồi mới one-hot</td></tr></tbody></table><p>Không đánh số thứ tự cho phạm trù không có thứ tự.</p>"
      },
      {
        title: "Sơ đồ chia ba tập",
        wide: true,
        body: "<table><thead><tr><th>Tập</th><th>Tỉ lệ</th><th>Trên 1.000 mẫu</th><th>Dùng để</th></tr></thead><tbody><tr><td>Huấn luyện</td><td>70%</td><td>700 mẫu</td><td>Học tham số, fit chuẩn hóa</td></tr><tr><td>Kiểm định</td><td>15%</td><td>150 mẫu</td><td>Chọn cấu hình, ngưỡng</td></tr><tr><td>Kiểm tra</td><td>15%</td><td>150 mẫu</td><td>Chấm một lần duy nhất</td></tr></tbody></table><p>Chia theo tỉ lệ lớp để mỗi tập giữ khoảng 15% mẫu trượt; ghi seed vào báo cáo.</p>"
      },
      {
        title: "Checklist rò rỉ dữ liệu",
        body: "<ul><li>Chia tập trước, fit tham số sau.</li><li>Không đưa cột nhãn vào đặc trưng.</li><li>Bỏ cột chỉ có sau thời điểm dự đoán.</li><li>Gộp dòng trùng trước khi chia.</li><li>Không lấy thống kê trên toàn bộ bảng.</li><li>Tập kiểm tra chỉ mở một lần.</li></ul><p>Điểm kiểm định trên 95% là dấu hiệu cần soát lại các mục trên.</p>"
      }
    ]
  });
})();
