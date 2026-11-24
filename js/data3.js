/* MLLab — phần 3: module đánh giá và triển khai, tình huống, cheatsheet */
window.MLLAB = window.MLLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };

(function () {
  const T = window.MLLAB;

  T.modules.push({
    id: "danh-gia-va-trien-khai",
    num: "03",
    title: "Đánh giá và triển khai",
    tone: "yellow",
    blurb: "Bốn bài khép lại vòng đời mô hình: đo precision khi báo nhầm là vấn đề, đo recall khi bỏ sót là vấn đề, đọc khoảng cách huấn luyện và kiểm định để bắt quá khớp, rồi đóng gói, giám sát lệch dữ liệu và chuẩn bị phương án lùi.",
    lessons: ["precision", "recall", "overfit", "trien-khai"]
  });

  T.lessons["precision"] = {
    id: "precision",
    module: "danh-gia-va-trien-khai",
    title: "Precision",
    shortTitle: "Precision",
    subtitle: "Trong số ca bị gắn cờ, bao nhiêu là thật",
    blurb: "Precision trả lời câu hỏi hẹp: trong số hồ sơ bị gắn cờ, bao nhiêu phần đáng ngờ. Bài này tính 80 trên 100, chỉ ra cái giá của báo nhầm và cách chọn ngưỡng khi khách bỏ đi vì bị giữ hồ sơ lâu.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["precision", "báo nhầm", "ngưỡng", "ma trận nhầm lẫn", "tín dụng"],
    metrics: [
      { key: "tp", label: "Dương tính thật", tone: "mint" },
      { key: "fp", label: "Dương tính giả", tone: "coral" },
      { key: "precision", label: "Precision", tone: "blue" },
      { key: "ok", label: "Trạng thái", tone: "yellow" }
    ],
    nodes: [
      { id: "data", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Hồ sơ vay", sub: "1.000 hồ sơ mỗi ngày" },
      { id: "model", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Mô hình chấm điểm", sub: "xác suất rủi ro" },
      { id: "threshold", type: "signal", x: 625, y: 80, w: 200, h: 70, label: "Ngưỡng 0,5", sub: "cắt danh sách cảnh báo" },
      { id: "tp", type: "check", x: 55, y: 310, w: 200, h: 70, label: "TP = 80", sub: "báo đúng khách rủi ro" },
      { id: "fp", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "FP = 20", sub: "báo nhầm khách tốt" },
      { id: "score", type: "star", x: 340, y: 310, w: 200, h: 70, label: "Precision 80%", sub: "80 chia cho 100" },
      { id: "ops", type: "user", x: 340, y: 195, w: 200, h: 70, label: "Nhân viên tín dụng", sub: "duyệt tay 100 hồ sơ" }
    ],
    edges: [
      { id: "data-model", from: "data", to: "model", kind: "request", label: "1.000 hồ sơ" },
      { id: "model-threshold", from: "model", to: "threshold", kind: "control", label: "điểm xác suất", bow: 22 },
      { id: "threshold-model", from: "threshold", to: "model", kind: "response", label: "chỉnh ngưỡng", bow: -22 },
      { id: "threshold-tp", from: "threshold", to: "tp", kind: "data", label: "vượt ngưỡng" },
      { id: "threshold-fp", from: "threshold", to: "fp", kind: "data", label: "báo nhầm" },
      { id: "tp-score", from: "tp", to: "score", kind: "data", label: "80 ca đúng" },
      { id: "fp-score", from: "fp", to: "score", kind: "data", label: "20 ca nhầm" }
    ],
    learn: [
      "<strong>Precision</strong> = TP / (TP + FP), chỉ tính trên số ca mô hình đã báo.",
      "TP 80 và FP 20 cho <code>80%</code>: một phần năm cảnh báo là nhầm.",
      "Nâng ngưỡng làm giảm FP, kéo precision lên nhưng recall xuống.",
      "Đo trên tập kiểm định, ghi kèm cỡ mẫu và ngưỡng đã dùng."
    ],
    steps: [
      {
        short: "Precision đo gì",
        type: "concept",
        title: "Precision đo điều gì",
        body: "Precision trả lời một câu rất hẹp: trong số hồ sơ mà mô hình gắn cờ, bao nhiêu phần thật sự đáng ngờ. Với 1.000 hồ sơ vay mỗi ngày, mô hình báo 100 ca, trong đó 80 ca đúng là khách có rủi ro và 20 ca là khách tốt bị gắn cờ nhầm. Công thức là <code>TP / (TP + FP)</code>, tức 80 chia 100, bằng 80%. Mẫu số chỉ gồm những gì mô hình đã báo, không đếm các ca nó bỏ qua. Vì vậy precision cao chưa chắc mô hình tốt: một mô hình chỉ báo đúng một ca và bỏ sót 99 ca vẫn đạt precision 100%. Muốn đánh giá đầy đủ phải đọc kèm recall và cỡ mẫu.",
        focus: ["data", "model", "tp", "fp", "score"],
        edges: ["data-model", "tp-score", "fp-score"],
        metrics: { tp: "80", fp: "20", precision: "80%", ok: "chưa rõ" },
        changes: [
          { label: "Tỉ lệ cảnh báo đúng", before: "chưa đo", after: "80%" },
          { label: "Hồ sơ bị giữ để duyệt", before: "1.000", after: "100" }
        ],
        note: "Precision không nhìn tới các ca bị bỏ sót, nên đừng đọc một mình."
      },
      {
        short: "Từ 1.000 đến 100",
        type: "flow",
        title: "Từ 1.000 hồ sơ đến 100 cảnh báo",
        body: "Luồng chạy thực tế bắt đầu từ 1.000 hồ sơ mới trong ngày. Mô hình chấm điểm từng hồ sơ, ngưỡng 0,5 cắt ra đúng 100 ca bị gắn cờ. Nhân viên tín dụng chỉ có thời gian xem 100 hồ sơ này, nên mỗi cảnh báo nhầm là một suất kiểm tra bị lãng phí. Trong 100 ca đó, 80 ca đúng và 20 ca nhầm, precision là 80%. Nếu hạ ngưỡng xuống 0,3, số cảnh báo tăng lên khoảng 180 ca, bắt thêm vài ca xấu nhưng precision tụt xuống gần 55%. Đội vận hành phải chọn giữa hàng đợi ngắn với ít báo nhầm và danh sách dài để không bỏ sót. Con số 80% chỉ có nghĩa khi ghi kèm ngưỡng.",
        focus: ["model", "threshold", "tp", "fp", "ops"],
        edges: ["model-threshold", "threshold-model", "threshold-tp", "threshold-fp"],
        metrics: { tp: "80", fp: "20", precision: "80%", ok: "ổn" },
        changes: [
          { label: "Số cảnh báo mỗi ngày", before: "60", after: "100" },
          { label: "Ngưỡng cắt", before: "0,3", after: "0,5" }
        ],
        note: "Mỗi lần đổi ngưỡng là một mô hình mới về mặt vận hành, phải ghi phiên bản."
      },
      {
        short: "Giá của báo nhầm",
        type: "detail",
        title: "Cái giá thật của một ca báo nhầm",
        body: "Báo nhầm không chỉ là một con số trong báo cáo. Mỗi ca FP là một khách hàng bị gọi xác minh, bị giữ khoản vay thêm hai ngày, hoặc bị từ chối oan. Với 20 ca nhầm mỗi ngày, một tháng là 600 lần làm phiền, đủ để khách chuyển sang ngân hàng khác. Chi phí này thường lớn hơn lợi ích của vài ca xấu bắt thêm. Vì vậy precision là chỉ số của niềm tin: 80% nghĩa là bốn trong năm cảnh báo là thật. Nếu đội duyệt tay chỉ chịu được 10% báo nhầm, cần precision 90%, tương ứng khoảng 9 ca nhầm trên 100 cảnh báo. Muốn vậy phải nâng ngưỡng hoặc bổ sung đặc trưng.",
        focus: ["fp", "score", "ops", "threshold"],
        edges: ["fp-score", "threshold-fp"],
        metrics: { tp: "80", fp: "20", precision: "80%", ok: "cần cải thiện" },
        changes: [
          { label: "Ca làm phiền mỗi tháng", before: "0", after: "600" },
          { label: "Precision mục tiêu", before: "80%", after: "90%" }
        ],
        note: "Hãy quy báo nhầm ra thời gian nhân viên và số khách rời bỏ, không chỉ ra phần trăm."
      },
      {
        short: "Ba lỗi đo",
        type: "pitfall",
        title: "Ba cách làm hỏng con số precision",
        body: "Ba lỗi thường gặp. Thứ nhất, tính precision trên tập huấn luyện: mô hình đã thấy nhãn nên điểm cao giả tạo. Thứ hai, đổi ngưỡng sau khi xem kết quả kiểm định rồi báo cáo cùng một con số, khiến 80% không còn trung thực. Thứ ba, gộp các lớp hiếm vào một nhãn chung, làm mẫu số phình ra và che mất lỗi thật. Cách chặn: cố định ngưỡng trước khi mở tập kiểm tra, công bố kèm ma trận nhầm lẫn đầy đủ, và ghi rõ cỡ mẫu. Với 100 cảnh báo, sai lệch một ca là một điểm phần trăm, nên hãy in cả khoảng tin cậy. Đừng so sánh precision của hai mô hình chạy trên hai tập khác nhau.",
        focus: ["data", "model", "score", "threshold"],
        edges: ["data-model", "threshold-model", "tp-score"],
        metrics: { tp: "80", fp: "20", precision: "80%", ok: "dễ sai" },
        changes: [
          { label: "Ngưỡng chốt", before: "sau khi xem", after: "trước khi xem" },
          { label: "Báo cáo", before: "một con số", after: "kèm ma trận nhầm lẫn" }
        ],
        note: "Một điểm phần trăm trên 100 ca là một ca; đừng trình bày như sai số nhỏ."
      },
      {
        short: "Chốt precision",
        type: "final",
        title: "Chốt: đọc precision cùng ngưỡng",
        tone: "final",
        body: "Chốt lại bốn việc. Một: precision bằng <code>TP / (TP + FP)</code>, chỉ nói về những ca đã báo. Hai: luôn công bố kèm recall và cỡ mẫu, vì 80% trên 10 ca khác hẳn 80% trên 1.000 ca. Ba: chọn ngưỡng theo chi phí thật của báo nhầm, không theo cảm giác. Bốn: đo trên tập kiểm định tách riêng và cố định ngưỡng trước khi xem kết quả. Khi khách rời đi vì bị giữ hồ sơ, hãy nâng ngưỡng, chấp nhận recall thấp hơn, rồi ghi lại đánh đổi đó trong tài liệu mô hình. Đừng chỉnh ngưỡng mỗi tuần mà không ghi phiên bản.",
        focus: "all",
        edges: "all",
        metrics: { tp: "80", fp: "20", precision: "80%", ok: "đạt" },
        changes: [
          { label: "Chính sách ngưỡng", before: "tùy chỉnh", after: "chốt theo chi phí" },
          { label: "Tài liệu mô hình", before: "chỉ điểm số", after: "điểm, ngưỡng, cỡ mẫu" }
        ],
        note: "Precision là chỉ số của niềm tin vào cảnh báo; recall là chỉ số của độ phủ."
      }
    ]
  };

  T.lessons["recall"] = {
    id: "recall",
    module: "danh-gia-va-trien-khai",
    title: "Recall",
    shortTitle: "Recall",
    subtitle: "Bắt được bao nhiêu phần ca bệnh thật",
    blurb: "Recall đo khả năng không bỏ sót: trong số ca dương, mô hình bắt được bao nhiêu. Bài này tính 80 trên 100, phân tích cái giá của ca bỏ sót trong sàng lọc bệnh, và cách hạ ngưỡng để đổi precision lấy recall.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["recall", "bỏ sót", "ngưỡng", "sàng lọc", "độ phủ"],
    metrics: [
      { key: "tp", label: "Dương tính thật", tone: "mint" },
      { key: "fn", label: "Âm tính giả", tone: "coral" },
      { key: "recall", label: "Recall", tone: "blue" },
      { key: "ok", label: "Trạng thái", tone: "yellow" }
    ],
    nodes: [
      { id: "images", type: "file", x: 55, y: 80, w: 200, h: 70, label: "Ảnh X-quang", sub: "1.000 phim mỗi tuần" },
      { id: "model", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Mô hình sàng lọc", sub: "chấm điểm nguy cơ" },
      { id: "threshold", type: "signal", x: 625, y: 80, w: 200, h: 70, label: "Ngưỡng 0,5", sub: "hạ còn 0,3" },
      { id: "tp", type: "check", x: 55, y: 310, w: 200, h: 70, label: "TP = 80", sub: "bắt đúng ca bệnh" },
      { id: "fn", type: "alert", x: 625, y: 310, w: 200, h: 70, label: "FN = 20", sub: "bỏ sót ca bệnh" },
      { id: "score", type: "star", x: 340, y: 310, w: 200, h: 70, label: "Recall 80%", sub: "80 chia cho 100" },
      { id: "doctor", type: "user", x: 340, y: 195, w: 200, h: 70, label: "Bác sĩ đọc lại", sub: "xem 100 phim dương" }
    ],
    edges: [
      { id: "images-model", from: "images", to: "model", kind: "request", label: "1.000 phim" },
      { id: "model-threshold", from: "model", to: "threshold", kind: "control", label: "điểm nguy cơ", bow: 22 },
      { id: "threshold-model", from: "threshold", to: "model", kind: "response", label: "hạ ngưỡng", bow: -22 },
      { id: "threshold-tp", from: "threshold", to: "tp", kind: "data", label: "trên ngưỡng" },
      { id: "threshold-fn", from: "threshold", to: "fn", kind: "data", label: "dưới ngưỡng" },
      { id: "tp-score", from: "tp", to: "score", kind: "data", label: "80 ca bắt được" },
      { id: "fn-score", from: "fn", to: "score", kind: "data", label: "20 ca bỏ sót" }
    ],
    learn: [
      "<strong>Recall</strong> = TP / (TP + FN), tính trên toàn bộ ca bệnh có thật.",
      "TP 80 và FN 20 cho <code>80%</code>: hai trong mười ca bị bỏ sót.",
      "Hạ ngưỡng kéo recall lên nhưng đẩy precision xuống.",
      "Gắn cờ mọi ca cho recall 100%, một mô hình như vậy vô dụng."
    ],
    steps: [
      {
        short: "Recall đo gì",
        type: "concept",
        title: "Recall đo độ phủ",
        body: "Recall trả lời câu hỏi ngược với precision: trong số ca thật sự dương, mô hình bắt được bao nhiêu. Trong 1.000 phim chụp mỗi tuần, có 100 phim có tổn thương thật; mô hình báo 80 ca và bỏ sót 20 ca. Công thức là <code>TP / (TP + FN)</code>, tức 80 chia 100, bằng 80%. Khác với precision, mẫu số ở đây là toàn bộ ca bệnh có thật, kể cả những ca mô hình im lặng. Vì vậy recall đo độ phủ, còn precision đo độ tin. Một mô hình gắn cờ mọi phim sẽ đạt recall 100% nhưng precision rất thấp, vì mọi phim bình thường đều bị báo. Hai chỉ số phải đọc cùng nhau.",
        focus: ["images", "model", "tp", "fn", "score"],
        edges: ["images-model", "tp-score", "fn-score"],
        metrics: { tp: "80", fn: "20", recall: "80%", ok: "chưa đủ" },
        changes: [
          { label: "Ca bệnh bắt được", before: "chưa đo", after: "80/100" },
          { label: "Ca bệnh bỏ sót", before: "chưa đo", after: "20" }
        ],
        note: "Recall 100% chỉ đáng tin khi đi kèm một precision chấp nhận được."
      },
      {
        short: "Hạ ngưỡng",
        type: "flow",
        title: "Hạ ngưỡng để bắt thêm ca bệnh",
        body: "Trong tuần có 1.000 phim và 100 phim có tổn thương thật. Ở ngưỡng 0,5 mô hình bắt 80 ca, bỏ sót 20, recall 80%. Hạ ngưỡng xuống 0,3 làm danh sách cảnh báo dài từ 100 lên 160 phim; mô hình bắt thêm 15 ca bệnh nhưng kéo theo 45 phim bình thường. Recall khi đó khoảng 95%, precision rơi từ 80% xuống gần 60%. Bác sĩ phải đọc thêm 60 phim, đổi lại chỉ 5 ca bệnh thoát khỏi bị bỏ sót. Với bệnh nguy hiểm, đánh đổi này thường đáng. Điều cần làm là ghi rõ ngưỡng, số ca bắt thêm và số phim đọc thêm để hội đồng chuyên môn quyết định, không chỉnh ngầm.",
        focus: ["model", "threshold", "tp", "fn", "doctor"],
        edges: ["model-threshold", "threshold-model", "threshold-tp", "threshold-fn"],
        metrics: { tp: "95", fn: "5", recall: "95%", ok: "tốt hơn" },
        changes: [
          { label: "Ngưỡng cắt", before: "0,5", after: "0,3" },
          { label: "Phim phải đọc thêm", before: "0", after: "60" }
        ],
        note: "Mỗi điểm recall tăng thêm đều có giá bằng số phim phải đọc thêm."
      },
      {
        short: "Giá của bỏ sót",
        type: "detail",
        title: "Cái giá của một ca bị bỏ sót",
        body: "Mỗi ca FN là một tổn thương bị bỏ qua, và cái giá không dừng ở lần khám đó. Với 20 ca bỏ sót mỗi tuần, tức khoảng 1.000 ca một năm, một phần tư trong số đó có thể tiến triển nặng sau sáu tháng, khi điều trị khó hơn và tốn kém hơn nhiều. Chi phí y tế tăng, nhưng thiệt hại lớn hơn là niềm tin: một ca bị bỏ sót rồi phát hiện muộn làm hỏng cả chương trình sàng lọc. Vì thế trong y tế, recall thường được đặt trước precision, chấp nhận nhiều báo nhầm. Nhưng báo nhầm cũng có hại: 45 phim bình thường bị gắn cờ làm bác sĩ mệt mỏi và dễ bỏ qua ca thật ở lần sau.",
        focus: ["fn", "score", "doctor", "tp"],
        edges: ["fn-score", "threshold-fn"],
        metrics: { tp: "80", fn: "20", recall: "80%", ok: "rủi ro cao" },
        changes: [
          { label: "Ca bỏ sót mỗi năm", before: "chưa theo dõi", after: "khoảng 1.000" },
          { label: "Ưu tiên chỉ số", before: "precision", after: "recall" }
        ],
        note: "Báo nhầm nhiều cũng làm giảm recall thật vì nhân viên đọc mệt mỏi."
      },
      {
        short: "Bốn lỗi đo",
        type: "pitfall",
        title: "Bốn lỗi khi đo và báo recall",
        body: "Lỗi thứ nhất là đo trên tập mất cân bằng mà không nói rõ: 100 ca dương trên 1.000 phim nghĩa là một ca tương đương một điểm phần trăm, nên biến động rất lớn. Lỗi thứ hai là hạ ngưỡng sau khi xem tập kiểm tra rồi báo cùng một con số, khiến recall 80% thành con số trang trí. Lỗi thứ ba là dùng accuracy thay recall: mô hình đoán tất cả là bình thường vẫn đạt 90% accuracy nhưng recall bằng 0. Lỗi thứ tư là gắn cờ mọi ca để đạt recall 100%. Cách chặn: báo cáo <code>TP, FN</code> thô, vẽ đường precision-recall, và chốt ngưỡng trên tập kiểm định riêng.",
        focus: ["images", "threshold", "fn", "score"],
        edges: ["images-model", "threshold-fn", "fn-score"],
        metrics: { tp: "80", fn: "20", recall: "80%", ok: "dễ sai" },
        changes: [
          { label: "Chỉ số báo cáo", before: "accuracy", after: "recall và TP, FN" },
          { label: "Ngưỡng", before: "chỉnh sau khi xem", after: "chốt trước" }
        ],
        note: "Accuracy 90% trên dữ liệu lệch có thể đi cùng recall bằng 0."
      },
      {
        short: "Chốt recall",
        type: "final",
        title: "Chốt: recall và đánh đổi",
        tone: "final",
        body: "Chốt lại bốn việc. Một: recall bằng <code>TP / (TP + FN)</code>, mẫu số là toàn bộ ca bệnh có thật. Hai: khi bỏ sót nguy hiểm hơn báo nhầm, hãy hạ ngưỡng và chấp nhận precision thấp hơn. Ba: luôn báo cáo cặp precision và recall, kèm số ca thô và ngưỡng, đừng chọn một chỉ số cho đẹp báo cáo. Bốn: kiểm tra lại trên tập kiểm tra tách riêng sau khi chốt ngưỡng. Với sàng lọc bệnh, hãy đặt mục tiêu recall 95% trước, rồi tối ưu precision trong giới hạn nhân lực đọc phim. Ghi lại đánh đổi đó để lần sau không tranh luận lại từ đầu.",
        focus: "all",
        edges: "all",
        metrics: { tp: "95", fn: "5", recall: "95%", ok: "đạt" },
        changes: [
          { label: "Mục tiêu recall", before: "80%", after: "95%" },
          { label: "Báo cáo", before: "một chỉ số", after: "cặp precision, recall" }
        ],
        note: "Chọn ngưỡng theo loại lỗi nào đắt hơn, rồi ghi con số đó vào tài liệu."
      }
    ]
  };

  T.lessons["overfit"] = {
    id: "overfit",
    module: "danh-gia-va-trien-khai",
    title: "Quá khớp",
    shortTitle: "Quá khớp",
    subtitle: "Lỗi huấn luyện 5%, lỗi kiểm định 20%",
    blurb: "Lỗi huấn luyện 5% nhưng lỗi kiểm định 20% là dấu hiệu quá khớp. Đo khoảng cách 15 điểm so với ngưỡng 10, giải thích vì sao mô hình học thuộc nhiễu, và ba cách chặn: thêm dữ liệu, giảm độ phức tạp, dừng sớm.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["quá khớp", "khoảng cách", "kiểm định", "dừng sớm", "điều chuẩn"],
    metrics: [
      { key: "trainErr", label: "Lỗi huấn luyện", tone: "mint" },
      { key: "valErr", label: "Lỗi kiểm định", tone: "coral" },
      { key: "gap", label: "Khoảng cách", tone: "blue" },
      { key: "ok", label: "Kết luận", tone: "yellow" }
    ],
    nodes: [
      { id: "train", type: "grid", x: 55, y: 80, w: 200, h: 70, label: "Tập huấn luyện", sub: "700 mẫu, lỗi 5%" },
      { id: "model", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Cây sâu 30 tầng", sub: "học thuộc từng mẫu" },
      { id: "val", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Tập kiểm định", sub: "150 mẫu, lỗi 20%" },
      { id: "gap", type: "alert", x: 340, y: 310, w: 200, h: 70, label: "Khoảng cách 15", sub: "20 trừ 5, ngưỡng 10" },
      { id: "rule", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Ngưỡng 10 điểm", sub: "vượt là quá khớp" },
      { id: "fix", type: "bolt", x: 625, y: 310, w: 200, h: 70, label: "Ba cách chặn", sub: "dữ liệu, độ sâu, dừng" },
      { id: "report", type: "audit", x: 340, y: 195, w: 200, h: 70, label: "Báo cáo kiểm định", sub: "công bố cả hai lỗi" }
    ],
    edges: [
      { id: "train-model", from: "train", to: "model", kind: "request", label: "700 mẫu" },
      { id: "model-val", from: "model", to: "val", kind: "data", label: "dự đoán" },
      { id: "train-gap", from: "train", to: "gap", kind: "data", label: "lỗi 5%" },
      { id: "val-gap", from: "val", to: "gap", kind: "data", label: "lỗi 20%" },
      { id: "gap-rule", from: "gap", to: "rule", kind: "control", label: "so với 10" },
      { id: "gap-fix", from: "gap", to: "fix", kind: "control", label: "vượt ngưỡng", bow: 22 },
      { id: "fix-gap", from: "fix", to: "gap", kind: "response", label: "thử lại", bow: -22 }
    ],
    learn: [
      "Lỗi huấn luyện 5% và lỗi kiểm định 20% cho khoảng cách <code>15 điểm</code>.",
      "Ngưỡng 10 điểm: vượt ngưỡng là dấu hiệu quá khớp rõ ràng.",
      "Mô hình càng nhiều tham số càng dễ học thuộc nhiễu của tập huấn luyện.",
      "Thêm dữ liệu, giảm độ phức tạp và dừng sớm là ba cách chặn."
    ],
    steps: [
      {
        short: "Quá khớp là gì",
        type: "concept",
        title: "Hai con số, một kết luận",
        body: "Quá khớp là khi mô hình đạt điểm rất tốt trên dữ liệu đã học nhưng tệ hẳn trên dữ liệu mới. Dấu hiệu rẻ nhất để phát hiện là so hai con số: lỗi huấn luyện 5% và lỗi kiểm định 20%. Khoảng cách 15 điểm vượt ngưỡng chấp nhận 10 điểm, nên kết luận là quá khớp. Trong ví dụ này, một cây quyết định sâu 30 tầng học thuộc từng mẫu, kể cả những mẫu có nhãn sai. Nó ghi nhớ thay vì khái quát. Điều đáng chú ý là 5% trông rất đẹp: nếu chỉ đọc lỗi huấn luyện, ta tưởng mô hình gần hoàn hảo. Luôn đọc cặp lỗi cùng lúc.",
        focus: ["train", "model", "val", "gap"],
        edges: ["train-model", "model-val", "train-gap"],
        metrics: { trainErr: "5%", valErr: "20%", gap: "15 điểm", ok: "quá khớp" },
        changes: [
          { label: "Cách đọc kết quả", before: "một con số lỗi", after: "cặp lỗi huấn luyện và kiểm định" },
          { label: "Kết luận", before: "mô hình tốt", after: "quá khớp, cần sửa" }
        ],
        note: "Lỗi huấn luyện thấp là điều kiện dễ, không phải bằng chứng mô hình tốt."
      },
      {
        short: "Đo khoảng cách",
        type: "flow",
        title: "Đo khoảng cách trên ba tập",
        body: "Quy trình gọn gồm ba tập: 700 mẫu để huấn luyện, 150 mẫu để kiểm định và 150 mẫu để kiểm tra lần cuối. Sau mỗi vòng huấn luyện, ta ghi lỗi trên cả tập huấn luyện và tập kiểm định. Khoảng cách là hiệu hai số: 20% trừ 5% bằng 15 điểm, gấp rưỡi ngưỡng 10. Tập kiểm định dùng để chọn siêu tham số, còn tập kiểm tra chỉ mở một lần ở cuối, nếu không nó sẽ bị nhiễm qua quá trình chọn. Với 150 mẫu kiểm định, mỗi ca đúng sai tương đương 0,67 điểm, nên khoảng cách 15 điểm không phải nhiễu ngẫu nhiên. Đây là tín hiệu đủ mạnh để dừng và sửa mô hình.",
        focus: ["train", "val", "gap", "model"],
        edges: ["model-val", "train-gap", "val-gap"],
        metrics: { trainErr: "5%", valErr: "20%", gap: "15 điểm", ok: "vượt ngưỡng" },
        changes: [
          { label: "Tỉ lệ chia tập", before: "80/20", after: "70/15/15" },
          { label: "Khoảng cách đo được", before: "chưa tách tập", after: "15 điểm" }
        ],
        note: "Tập kiểm tra mở một lần; mở nhiều lần là tự tạo quá khớp cho quy trình."
      },
      {
        short: "Vì sao học thuộc",
        type: "detail",
        title: "Vì sao cây sâu học thuộc dữ liệu",
        body: "Cây sâu 30 tầng có tới <code>2^30</code> lá tiềm năng, trong khi tập huấn luyện chỉ có 700 mẫu. Về lý thuyết, mỗi lá có thể giữ đúng một mẫu, nên cây chỉ cần chia cho tới khi mỗi lá còn một quan sát. Khi đó lỗi huấn luyện gần như bằng 0, nhưng mọi nhánh đều bám vào nhiễu riêng của vài mẫu. Nếu 3% nhãn bị gán sai, cây sẽ học luôn cả những nhãn sai đó. Trên dữ liệu mới, các nhánh ấy không còn đúng. Cùng cơ chế này xảy ra với mô hình nhiều tham số: nó có đủ dung lượng để ghi nhớ, và ghi nhớ là kẻ thù của khái quát hóa.",
        focus: ["model", "train", "val"],
        edges: ["train-model", "model-val"],
        metrics: { trainErr: "2%", valErr: "20%", gap: "18 điểm", ok: "nặng hơn" },
        changes: [
          { label: "Số lá tối đa của cây", before: "16", after: "hơn 1 tỉ" },
          { label: "Lỗi huấn luyện", before: "5%", after: "2%" }
        ],
        note: "Dung lượng mô hình lớn hơn nhiều so với dữ liệu là điều kiện thuận lợi cho quá khớp."
      },
      {
        short: "Bốn lỗi đọc",
        type: "pitfall",
        title: "Bốn lỗi khi đọc khoảng cách",
        body: "Lỗi thứ nhất là tập kiểm định quá nhỏ: 30 mẫu thì mỗi ca tương đương hơn 3 điểm, khoảng cách 15 điểm có thể chỉ là may rủi. Lỗi thứ hai là rò rỉ dữ liệu, ví dụ chuẩn hóa trên toàn bộ tập trước khi chia, khiến lỗi kiểm định đẹp giả tạo. Lỗi thứ ba là chọn mô hình trên tập kiểm tra rồi báo cáo chính con số đó. Lỗi thứ tư là thấy khoảng cách nhỏ đã mừng: lỗi huấn luyện 25% và lỗi kiểm định 27% có khoảng cách 2 điểm nhưng mô hình vẫn dở vì thiếu đặc trưng. Khoảng cách nhỏ chỉ có nghĩa khi cả hai lỗi đều thấp.",
        focus: ["gap", "rule", "train", "val", "report"],
        edges: ["gap-rule", "train-gap", "val-gap"],
        metrics: { trainErr: "5%", valErr: "20%", gap: "15 điểm", ok: "cần kiểm tra" },
        changes: [
          { label: "Cỡ tập kiểm định", before: "30 mẫu", after: "150 mẫu" },
          { label: "Cách báo cáo", before: "chỉ lỗi kiểm định", after: "kèm lỗi huấn luyện" }
        ],
        note: "Khoảng cách nhỏ trên nền hai lỗi cao là thiếu khớp, không phải tin tốt."
      },
      {
        short: "Ba cách chặn",
        type: "final",
        title: "Chặn quá khớp, kiểm lại khoảng cách",
        tone: "final",
        body: "Chốt lại ba cách chặn, làm theo thứ tự. Một: thêm dữ liệu, vì quá khớp thường chỉ là triệu chứng của 700 mẫu quá ít; nếu không có dữ liệu mới, hãy tăng cường dữ liệu bằng nhiễu nhẹ hoặc thu thập thêm ca hiếm. Hai: giảm độ phức tạp, cắt cây về độ sâu 8, thêm điều chuẩn <code>L2</code>, giới hạn số đặc trưng. Ba: dừng sớm khi lỗi kiểm định không giảm sau ba vòng. Sau mỗi thay đổi, đo lại khoảng cách và chỉ chấp nhận khi dưới 10 điểm với cả hai lỗi thấp. Ghi kết quả vào báo cáo kiểm định.",
        focus: "all",
        edges: "all",
        metrics: { trainErr: "6%", valErr: "9%", gap: "3 điểm", ok: "đạt" },
        changes: [
          { label: "Độ sâu cây", before: "30", after: "8" },
          { label: "Khoảng cách", before: "15 điểm", after: "3 điểm" }
        ],
        note: "Mục tiêu không phải khoảng cách bằng 0 mà là hai lỗi cùng thấp."
      }
    ]
  };

  T.lessons["trien-khai"] = {
    id: "trien-khai",
    module: "danh-gia-va-trien-khai",
    title: "Triển khai mô hình",
    shortTitle: "Triển khai",
    subtitle: "Đóng gói, giám sát lệch, cập nhật và lùi",
    blurb: "Mô hình chỉ có giá trị khi chạy ổn định ngoài đời. Bài này đi qua bốn việc của một lần triển khai: đóng gói kèm phiên bản, giám sát dữ liệu lệch, cập nhật định kỳ và có phương án lùi trong vài phút.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["triển khai", "phiên bản", "lệch dữ liệu", "độ trễ", "phương án lùi"],
    metrics: [
      { key: "version", label: "Phiên bản", tone: "blue" },
      { key: "driftPct", label: "Lệch dữ liệu", tone: "coral" },
      { key: "latencyMs", label: "Độ trễ", tone: "mint" },
      { key: "ok", label: "Trạng thái", tone: "yellow" }
    ],
    nodes: [
      { id: "app", type: "user", x: 55, y: 80, w: 200, h: 70, label: "Ứng dụng gọi", sub: "API chấm điểm" },
      { id: "serve", type: "server", x: 340, y: 80, w: 200, h: 70, label: "Máy chủ suy luận", sub: "v2.3, 45 ms" },
      { id: "pack", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Gói mô hình", sub: "trọng số và phiên bản" },
      { id: "log", type: "disk", x: 55, y: 310, w: 200, h: 70, label: "Kho dự phòng", sub: "bản cũ v2.2" },
      { id: "drift", type: "signal", x: 340, y: 310, w: 200, h: 70, label: "Lệch dữ liệu 12%", sub: "so với lúc huấn luyện" },
      { id: "monitor", type: "audit", x: 625, y: 310, w: 200, h: 70, label: "Bảng giám sát", sub: "lệch, độ trễ, lỗi" },
      { id: "rollback", type: "shield", x: 340, y: 195, w: 200, h: 70, label: "Phương án lùi", sub: "về v2.2 trong 5 phút" }
    ],
    edges: [
      { id: "app-serve", from: "app", to: "serve", kind: "request", label: "yêu cầu chấm" },
      { id: "serve-pack", from: "serve", to: "pack", kind: "data", label: "nạp trọng số", bow: 22 },
      { id: "pack-serve", from: "pack", to: "serve", kind: "control", label: "phiên bản", bow: -22 },
      { id: "serve-monitor", from: "serve", to: "monitor", kind: "data", label: "độ trễ, lỗi" },
      { id: "drift-monitor", from: "drift", to: "monitor", kind: "data", label: "lệch 12%" },
      { id: "monitor-rollback", from: "monitor", to: "rollback", kind: "control", label: "vượt ngưỡng" },
      { id: "rollback-log", from: "rollback", to: "log", kind: "control", label: "bản cũ v2.2" }
    ],
    learn: [
      "Gói mô hình phải kèm <code>phiên bản</code>, danh sách đặc trưng và tham số tiền xử lý.",
      "Giám sát lệch dữ liệu bằng cách so phân phối đầu vào với lúc huấn luyện.",
      "Cập nhật theo lịch, chạy song song bản mới trên 5% lưu lượng trước.",
      "Luôn có bản cũ sẵn sàng để lùi trong vài phút."
    ],
    steps: [
      {
        short: "Đóng gói",
        type: "concept",
        title: "Đóng gói kèm phiên bản",
        body: "Một mô hình không phải chỉ là tệp trọng số. Gói triển khai cần bốn thứ đi cùng: tệp trọng số, danh sách 42 đặc trưng theo đúng thứ tự, tham số tiền xử lý như cách điền giá trị thiếu và cách mã hóa biến phân loại, cùng ngưỡng quyết định 0,5. Thiếu một thứ, máy chủ sẽ chấm điểm sai dù trọng số đúng. Hãy đặt tên gói theo phiên bản, ví dụ <code>v2.3</code>, và ghi commit huấn luyện vào metadata. Khi có sự cố, câu hỏi đầu tiên luôn là đang chạy phiên bản nào. Không có câu trả lời đó thì mọi so sánh đều vô nghĩa.",
        focus: ["serve", "pack", "app"],
        edges: ["app-serve", "serve-pack"],
        metrics: { version: "v2.3", driftPct: "chưa đo", latencyMs: "45 ms", ok: "đã đóng gói" },
        changes: [
          { label: "Gói triển khai", before: "chỉ tệp trọng số", after: "trọng số, đặc trưng, tiền xử lý" },
          { label: "Truy vết", before: "không có", after: "tên phiên bản và commit" }
        ],
        note: "Sai thứ tự đặc trưng là lỗi triển khai phổ biến nhất và im lặng nhất."
      },
      {
        short: "Giám sát lệch",
        type: "flow",
        title: "Giám sát dữ liệu lệch",
        body: "Sau khi lên máy chủ, mô hình gặp dữ liệu khác dần dữ liệu huấn luyện. Tuần này 12% hồ sơ có thu nhập khai báo nằm ngoài khoảng đã thấy khi huấn luyện, dấu hiệu lệch phân phối. Cách đo đơn giản là so phân phối từng đặc trưng với bản ghi lúc huấn luyện, tính chỉ số lệch như <code>PSI</code> và đặt ngưỡng cảnh báo 0,2. Song song đó theo dõi độ trễ trung bình 45 ms, tỉ lệ lỗi 0,3% và số ca bị gắn cờ mỗi ngày. Ba bảng số này đặt cạnh nhau trên một màn hình. Khi lệch vượt 15% trong hai tuần liên tiếp, đó là lúc xem lại mô hình chứ không phải chờ đến khi khách phàn nàn.",
        focus: ["drift", "monitor", "serve"],
        edges: ["serve-monitor", "drift-monitor"],
        metrics: { version: "v2.3", driftPct: "12%", latencyMs: "45 ms", ok: "cảnh báo" },
        changes: [
          { label: "Theo dõi đầu vào", before: "không có", after: "PSI theo từng đặc trưng" },
          { label: "Ngưỡng cảnh báo lệch", before: "chưa đặt", after: "15% trong hai tuần" }
        ],
        note: "Lệch dữ liệu không báo lỗi; nó chỉ làm điểm số âm thầm kém đi."
      },
      {
        short: "Cập nhật",
        type: "detail",
        title: "Cập nhật định kỳ, không tùy hứng",
        body: "Cập nhật mô hình nên theo lịch và theo tín hiệu, không theo cảm hứng. Lịch tháng một lần là mức hợp lý cho mô hình tín dụng: huấn luyện lại trên dữ liệu 12 tháng gần nhất, đánh giá trên tập kiểm định mới, rồi so với bản đang chạy. Chỉ phát hành khi precision và recall không giảm quá 2 điểm. Bản mới chạy chế độ bóng, ghi dự đoán nhưng không dùng để quyết định, trong hai tuần. Sau đó mở cho 5% lưu lượng, theo dõi độ trễ và tỉ lệ cảnh báo, rồi mới nâng lên toàn bộ. Mỗi bước đều có số liệu để so, không dựa vào cảm giác.",
        focus: ["pack", "serve", "monitor", "log"],
        edges: ["pack-serve", "serve-monitor"],
        metrics: { version: "v2.4", driftPct: "6%", latencyMs: "48 ms", ok: "cập nhật" },
        changes: [
          { label: "Phiên bản đang chạy", before: "v2.3", after: "v2.4" },
          { label: "Lưu lượng bản mới", before: "0%", after: "5% rồi toàn bộ" }
        ],
        note: "Chế độ bóng cho thấy khác biệt trước khi bất kỳ khách nào bị ảnh hưởng."
      },
      {
        short: "Bốn lỗi",
        type: "pitfall",
        title: "Bốn lỗi triển khai hay gặp",
        body: "Lỗi thứ nhất là không ghi phiên bản vào log, đến khi điểm số tụt mới loay hoay không biết đang chạy bản nào. Lỗi thứ hai là thay toàn bộ lưu lượng trong một lần, không có bước 5%. Lỗi thứ ba là không lưu bản cũ: khi bản mới lỗi, phải huấn luyện lại từ đầu mất vài ngày. Lỗi thứ tư là bỏ qua độ trễ: một mô hình chính xác hơn nhưng trả lời 900 ms làm ứng dụng quá thời gian chờ 300 ms. Cách chặn gọn: mọi bản phát hành đều có phiên bản, có canary, có bản lùi và có ngưỡng độ trễ ghi trong hợp đồng dịch vụ.",
        focus: ["serve", "monitor", "rollback", "log"],
        edges: ["serve-monitor", "monitor-rollback", "rollback-log"],
        metrics: { version: "v2.4", driftPct: "25%", latencyMs: "900 ms", ok: "sự cố" },
        changes: [
          { label: "Cách phát hành", before: "một lần 100%", after: "canary 5% rồi tăng" },
          { label: "Bản lùi", before: "không có", after: "v2.2 sẵn trong kho" }
        ],
        note: "Độ trễ là một phần của chất lượng; mô hình đúng mà chậm vẫn bị gỡ."
      },
      {
        short: "Checklist",
        type: "final",
        title: "Checklist trước khi mở lưu lượng",
        tone: "final",
        body: "Chốt bằng checklist ngắn. Một: gói mô hình có phiên bản, danh sách đặc trưng, tham số tiền xử lý và ngưỡng. Hai: bảng giám sát hiển thị lệch dữ liệu, độ trễ và tỉ lệ lỗi, có ngưỡng cảnh báo rõ. Ba: cập nhật theo lịch tháng, qua chế độ bóng và canary 5%. Bốn: bản cũ nằm sẵn trong kho, lùi được dưới 5 phút bằng một lệnh. Năm: log lưu đầu vào và phiên bản để tái hiện sự cố. Sáu: có người trực và kịch bản khi lệch vượt 15%. Kiểm thử bằng cách tắt bản mới giữa giờ cao điểm.",
        focus: "all",
        edges: "all",
        metrics: { version: "v2.4", driftPct: "dưới 8%", latencyMs: "dưới 80 ms", ok: "đạt" },
        changes: [
          { label: "Thời gian lùi bản", before: "vài ngày", after: "dưới 5 phút" },
          { label: "Giám sát", before: "xem khi có sự cố", after: "bảng sống, có cảnh báo" }
        ],
        note: "Diễn tập lùi bản một lần mỗi quý, đừng đợi sự cố thật để thử."
      }
    ]
  };

  T.practice.push({
    id: "loc-ho-so-vay",
    module: "danh-gia-va-trien-khai",
    tag: "PRECISION",
    tags: ["PRECISION", "ngưỡng", "tín dụng"],
    title: "Lọc hồ sơ vay báo nhầm quá nhiều",
    scenario: "Hệ thống lọc hồ sơ vay của một công ty tài chính đang gắn cờ 220 hồ sơ mỗi ngày, trong đó chỉ 70 hồ sơ thật sự rủi ro. Tổng đài nhận hơn 150 cuộc gọi phàn nàn mỗi ngày, khách bị giữ khoản vay hai ngày rồi bỏ sang nơi khác. Đội vận hành muốn nâng ngưỡng từ 0,4 lên 0,6 để giảm số cảnh báo, chấp nhận bỏ sót thêm vài ca. Trong tuần tới, họ cần trình bày phương án cho ban giám đốc, kèm con số precision và recall dự kiến. Bạn nên đề xuất cách nào?",
    metrics: [
      { label: "Cảnh báo mỗi ngày", value: "220", danger: true },
      { label: "Cảnh báo đúng", value: "70" },
      { label: "Precision hiện tại", value: "32%", danger: true }
    ],
    options: [
      "Giữ ngưỡng 0,4 và tuyển thêm người trực tổng đài để gọi xác minh",
      "Nâng ngưỡng lên 0,6, đo lại precision và recall trên tập kiểm định trước khi phát hành",
      "Bỏ hẳn bước duyệt tay để khách không còn bị giữ hồ sơ hai ngày",
      "Hạ ngưỡng xuống 0,2 để chắc chắn không bỏ sót hồ sơ rủi ro nào"
    ],
    correct: 1,
    explain: "Precision hiện tại chỉ 70 trên 220, khoảng 32%, nên gần hai phần ba cảnh báo là nhầm, và mỗi ca nhầm đều đẩy khách sang nơi khác. Nâng ngưỡng lên 0,6 cắt mạnh FP, precision lên khoảng 60 đến 70%, hàng đợi ngắn lại; đổi lại một số ca rủi ro bị bỏ sót nên recall giảm. Đáp án đúng vì nó nâng ngưỡng kèm bước đo lại cả hai chỉ số trên tập kiểm định, và ghi rõ mức recall chấp nhận được. Tuyển thêm người chỉ đắt hơn mà không sửa nguyên nhân. Bỏ duyệt tay để hồ sơ xấu đi qua. Hạ ngưỡng làm precision tệ hơn nữa."
  });

  T.practice.push({
    id: "khoang-cach-qua-khop",
    module: "danh-gia-va-trien-khai",
    tag: "OVERFIT",
    tags: ["OVERFIT", "khoảng cách", "dừng sớm"],
    title: "Lỗi huấn luyện 5%, lỗi kiểm định 20%",
    scenario: "Nhóm dự báo nhu cầu của một chuỗi cửa hàng huấn luyện mô hình cây tăng cường trên 18 tháng dữ liệu bán hàng, khoảng 90.000 dòng. Kết quả in ra: lỗi trên tập huấn luyện 5%, lỗi trên tập kiểm định 20%. Trưởng nhóm muốn đưa ngay lên máy chủ vì lỗi huấn luyện rất thấp. Khoảng cách 15 điểm đã vượt ngưỡng chấp nhận 10 điểm của công ty. Còn ba tuần trước mùa cao điểm, dữ liệu mới chưa thu thập được, nhưng đội được phép chỉnh cấu hình huấn luyện. Bạn chọn hướng xử lý nào?",
    metrics: [
      { label: "Lỗi huấn luyện", value: "5%" },
      { label: "Lỗi kiểm định", value: "20%", danger: true },
      { label: "Khoảng cách", value: "15 điểm", danger: true }
    ],
    options: [
      "Phát hành ngay vì lỗi huấn luyện 5% là rất tốt so với yêu cầu 10%",
      "Giảm độ sâu cây, thêm điều chuẩn và dừng sớm theo lỗi kiểm định",
      "Huấn luyện thêm 500 vòng để lỗi huấn luyện xuống dưới 2%",
      "Chia lại tập kiểm định vài lần cho tới khi khoảng cách dưới 10 điểm"
    ],
    correct: 1,
    explain: "Khoảng cách 15 điểm vượt ngưỡng 10 là dấu hiệu quá khớp: mô hình học thuộc nhiễu của 90.000 dòng huấn luyện nên lỗi kiểm định cao gấp bốn lần. Cách đúng là giảm độ phức tạp, cụ thể cắt độ sâu, thêm điều chuẩn <code>L2</code> và dừng sớm khi lỗi kiểm định không giảm sau ba vòng; khi thiếu dữ liệu mới, đây là ba đòn xử lý tại chỗ. Phát hành ngay là đưa mô hình sẽ sai 20% ra mùa cao điểm. Huấn luyện thêm vòng chỉ làm khoảng cách rộng hơn. Chia lại tập kiểm định tới khi đẹp là tự lừa mình, làm nhiễm quy trình chọn mô hình."
  });

  T.cheatsheets.push({
    id: "eval",
    num: "03",
    module: "danh-gia-va-trien-khai",
    title: "Bảng tra đánh giá",
    intro: "Bảng tra nhanh cho bước đánh giá và triển khai: công thức precision, recall, F1, cách đọc ma trận nhầm lẫn, dấu hiệu quá khớp cần dừng huấn luyện, checklist trước khi đưa mô hình lên máy chủ và mẫu giám sát lệch dữ liệu.",
    cards: [
      {
        title: "Bảng công thức và cách đọc",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Chỉ số</th><th>Công thức</th><th>Dùng khi</th><th>Cạm bẫy</th></tr></thead><tbody><tr><td class=\"mono\">Precision</td><td class=\"mono\">TP / (TP + FP)</td><td>Báo nhầm đắt: giữ hồ sơ, gọi xác minh</td><td>Bỏ qua toàn bộ ca bị bỏ sót</td></tr><tr><td class=\"mono\">Recall</td><td class=\"mono\">TP / (TP + FN)</td><td>Bỏ sót đắt: sàng lọc bệnh, gian lận</td><td>Gắn cờ mọi ca để đạt 100%</td></tr><tr><td class=\"mono\">F1</td><td class=\"mono\">2PR / (P + R)</td><td>Cần một số cân bằng để so mô hình</td><td>Che mất chênh lệch lớn giữa P và R</td></tr><tr><td class=\"mono\">Accuracy</td><td class=\"mono\">(TP + TN) / N</td><td>Dữ liệu cân bằng, hai lớp ngang nhau</td><td>Lệch lớp: đoán bừa vẫn 90%</td></tr><tr><td class=\"mono\">Khoảng cách</td><td class=\"mono\">valErr - trainErr</td><td>Chọn mô hình, phát hiện quá khớp</td><td>Vượt 10 điểm là phải xem lại</td></tr></tbody></table>"
      },
      {
        title: "Ma trận nhầm lẫn 1.000 hồ sơ",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th></th><th>Có rủi ro thật</th><th>Không rủi ro</th><th>Tổng</th></tr></thead><tbody><tr><td>Mô hình báo dương</td><td class=\"mono\">TP = 80</td><td class=\"mono\">FP = 20</td><td class=\"mono\">100</td></tr><tr><td>Mô hình báo âm</td><td class=\"mono\">FN = 20</td><td class=\"mono\">TN = 880</td><td class=\"mono\">900</td></tr><tr><td>Tổng</td><td class=\"mono\">100</td><td class=\"mono\">900</td><td class=\"mono\">1.000</td></tr></tbody></table><p style=\"margin-top:8px;font-size:.7rem;color:var(--text-soft)\">Precision 80/100 = 80%, recall 80/100 = 80%, accuracy 960/1.000 = 96%. Cùng một ma trận cho ba con số rất khác nhau về ý nghĩa.</p>"
      },
      {
        title: "Dấu hiệu quá khớp",
        html: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Lỗi huấn luyện 5%, lỗi kiểm định 20%, khoảng cách 15 điểm.</li><li>Lỗi kiểm định tăng trong khi lỗi huấn luyện vẫn giảm.</li><li>Mô hình rất nhạy với vài mẫu bị đổi nhãn.</li><li>Chỉ số tụt mạnh khi chia tập theo thời gian.</li><li>Trọng số lớn bất thường, đặc trưng hiếm chi phối.</li><li>Kết quả đẹp trên tập kiểm định nhưng tệ khi chạy thật.</li></ul>"
      },
      {
        title: "Checklist trước khi mở lưu lượng",
        html: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Gói có phiên bản, danh sách đặc trưng, tham số tiền xử lý, ngưỡng.</li><li>Đo lại precision và recall trên tập kiểm tra tách riêng.</li><li>Bảng giám sát lệch dữ liệu, độ trễ, tỉ lệ lỗi.</li><li>Canary 5% lưu lượng trước khi nâng lên toàn bộ.</li><li>Bản cũ trong kho, lùi được dưới 5 phút.</li><li>Log đầu vào kèm phiên bản để tái hiện sự cố.</li></ul>"
      },
      {
        title: "Mẫu giám sát lệch dữ liệu",
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>base = ref[col].value_counts(normalize=True)\nlive = cur[col].value_counts(normalize=True)\npsi = ((live - base) * np.log(live / base)).sum()\n\n# psi duoi 0,1: on dinh\n# 0,1 den 0,2: theo doi them\n# tren 0,2: canh bao, xem lai mo hinh\n\n# do tre: p95 duoi 200 ms\n# lech dau vao tuan nay: 12%</code></pre></div><p style=\"margin-top:8px;font-size:.7rem;color:var(--text-soft)\">Tính PSI cho từng đặc trưng quan trọng, lưu theo tuần để thấy xu hướng chứ không chỉ một con số.</p>"
      }
    ]
  });
})();
