/* MLLab — phần 2: module mô hình và huấn luyện, tình huống, cheatsheet */
window.MLLAB = window.MLLAB || { modules: [], lessons: {}, practice: [], cheatsheets: [] };
(function () {
  const T = window.MLLAB;

  T.modules.push({
    id: "mo-hinh-va-huan-luyen",
    num: "02",
    title: "Mô hình và huấn luyện",
    tone: "mint",
    blurb: "Bốn bài nối thành một vòng khép kín: chọn họ mô hình vừa sức với dữ liệu, đọc hàm mất mát để biết mô hình đang học hay đang dao động, chạy vòng huấn luyện theo lô có dừng sớm, rồi kiểm định chéo để chọn siêu tham số trước khi chạm tập test.",
    lessons: ["mo-hinh", "loss", "huan-luyen", "kiem-dinh"]
  });

  T.lessons["mo-hinh"] = {
    id: "mo-hinh",
    module: "mo-hinh-va-huan-luyen",
    title: "Chọn mô hình",
    shortTitle: "Chọn mô hình",
    subtitle: "Tuyến tính, cây quyết định hay mạng nơ-ron",
    blurb: "Ba họ mô hình, ba mức phức tạp. Bài này so sánh hồi quy tuyến tính 13 tham số, cây quyết định sâu 6 và mạng nơ-ron 5.000 tham số, để thấy vì sao chọn mô hình chính là chọn lượng dữ liệu cần có.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["chọn mô hình", "hồi quy", "cây quyết định", "mạng nơ-ron", "độ phức tạp"],
    metrics: [
      { key: "params", label: "Tham số", tone: "blue" },
      { key: "depth", label: "Độ sâu", tone: "mint" },
      { key: "trainMin", label: "Thời gian học", tone: "yellow" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "data", type: "file", x: 55, y: 310, w: 200, h: 70, label: "Dữ liệu huấn luyện", sub: "1.000 mẫu, 12 cột" },
      { id: "linear", type: "code", x: 55, y: 80, w: 200, h: 70, label: "Hồi quy tuyến tính", sub: "13 tham số, đọc được" },
      { id: "tree", type: "grid", x: 340, y: 80, w: 200, h: 70, label: "Cây quyết định", sub: "sâu 6, 63 nút" },
      { id: "net", type: "layers", x: 625, y: 80, w: 200, h: 70, label: "Mạng nơ-ron", sub: "hai tầng ẩn, 5.000 tham số" },
      { id: "val", type: "check", x: 340, y: 310, w: 200, h: 70, label: "Tập kiểm định", sub: "200 mẫu, chấm lỗi" },
      { id: "pick", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Mô hình chốt", sub: "tuyến tính, 13 tham số" },
      { id: "over", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Dấu hiệu quá khớp", sub: "lỗi 2% và 30%" }
    ],
    edges: [
      { id: "data-linear", from: "data", to: "linear", kind: "data", label: "12 đặc trưng" },
      { id: "data-val", from: "data", to: "val", kind: "data", label: "200 mẫu kiểm định" },
      { id: "linear-tree", from: "linear", to: "tree", kind: "control", label: "so sánh" },
      { id: "tree-net", from: "tree", to: "net", kind: "control", label: "tăng độ phức tạp" },
      { id: "val-pick", from: "val", to: "pick", kind: "control", label: "chọn theo lỗi" },
      { id: "over-tree", from: "over", to: "tree", kind: "control", label: "cây quá sâu" },
      { id: "over-val", from: "over", to: "val", kind: "data", label: "lỗi 30%" }
    ],
    learn: [
      "Hồi quy tuyến tính có 13 tham số cho 12 đặc trưng, đọc được từng hệ số.",
      "Cây sâu 6 tạo tối đa 63 nút, dễ giải thích nhưng dễ thuộc dữ liệu.",
      "Mạng 5.000 tham số cần khoảng 50.000 mẫu mới ổn định.",
      "Chọn mô hình theo lỗi kiểm định, không theo lỗi huấn luyện."
    ],
    steps: [
      {
        short: "Ba họ mô hình",
        type: "concept",
        title: "Ba họ mô hình, ba mức phức tạp",
        body: "Ba họ mô hình chiếm phần lớn bài toán nhập môn: hồi quy tuyến tính, cây quyết định và mạng nơ-ron. Chúng khác nhau chủ yếu ở độ phức tạp và lượng dữ liệu cần để học ổn định. Hồi quy tuyến tính có 13 tham số cho 12 đặc trưng, học xong là đọc được từng hệ số. Cây quyết định chia dữ liệu theo ngưỡng nên dễ giải thích, nhưng sâu quá thì thuộc lòng từng mẫu. Mạng nơ-ron nhiều tham số, cần dữ liệu lớn. Cách làm thực dụng là bắt đầu bằng mô hình đơn giản nhất, đo lỗi kiểm định, rồi chỉ nâng độ phức tạp khi cả lỗi huấn luyện và lỗi kiểm định còn cùng giảm.",
        focus: ["data", "linear", "tree", "net"],
        edges: ["data-linear", "linear-tree", "tree-net"],
        metrics: { params: "0", depth: "không", trainMin: "0 phút", ok: "chưa chọn" },
        changes: [
          "Ba họ mô hình được đặt lên cùng một bảng so sánh.",
          "Tiêu chí chọn chuyển từ lỗi huấn luyện sang lỗi kiểm định."
        ],
        note: "Mô hình đơn giản nhất chạy được là mốc so sánh, không phải lựa chọn kém cỏi."
      },
      {
        short: "Tuyến tính",
        type: "flow",
        title: "Hồi quy tuyến tính 13 tham số",
        body: "Với 12 đặc trưng và một hệ số chặn, hồi quy tuyến tính có đúng 13 tham số: mỗi đặc trưng một trọng số, cộng thêm tung độ gốc. Trên 1.000 mẫu, tỉ lệ một tham số cho 77 mẫu là thoải mái, nên mô hình gần như không thể quá khớp. Huấn luyện bằng bình phương tối thiểu hoặc vài chục vòng gradient descent, mất chưa tới một phút trên một lõi CPU. Kết quả điển hình là lỗi huấn luyện 8%, lỗi kiểm định 9%, khoảng cách một điểm phần trăm. Hệ số đọc được trực tiếp, ví dụ thêm một phòng thì giá tăng 0,4 triệu. Điều kiện là quan hệ thật sự gần tuyến tính; nếu không, mô hình sẽ thiếu khớp.",
        focus: ["data", "linear", "val"],
        edges: ["data-linear", "data-val"],
        metrics: { params: "13", depth: "không", trainMin: "dưới 1 phút", ok: "đạt" },
        changes: [
          "Chỉ 13 con số cần lưu cho toàn bộ mô hình.",
          "Lỗi kiểm định 9%, sát lỗi huấn luyện 8%."
        ],
        note: "Lỗi huấn luyện cao và lỗi kiểm định cũng cao là thiếu khớp, không phải quá khớp."
      },
      {
        short: "Cây sâu 6",
        type: "detail",
        title: "Cây quyết định có kiểm soát độ sâu",
        body: "Cây quyết định chia dữ liệu bằng câu hỏi ngưỡng, ví dụ diện tích lớn hơn 80 mét vuông. Với độ sâu tối đa 6, cây có tối đa 63 nút, đủ mô tả vài quy tắc phi tuyến mà hồi quy tuyến tính bỏ sót. Trên 1.000 mẫu, đặt tối thiểu 20 mẫu mỗi lá để cây không tách theo nhiễu. Kết quả là lỗi huấn luyện 4%, lỗi kiểm định 12%, khoảng cách 8 điểm phần trăm, vẫn trong ngưỡng chấp nhận. Cây không cần chuẩn hóa đặc trưng và giải thích được cho người ngoài ngành. Nhược điểm là kém ổn định: sâu thêm hai tầng là lỗi kiểm định vọt lên 24%, đổi 5% dữ liệu là đổi cấu trúc cây.",
        focus: ["tree", "data", "val"],
        edges: ["linear-tree", "over-tree"],
        metrics: { params: "63 nút", depth: "6", trainMin: "2 phút", ok: "đạt" },
        changes: [
          "Cây 63 nút nắm được quan hệ phi tuyến mà đường thẳng bỏ sót.",
          "Lỗi kiểm định lên 12% nhưng vẫn dưới ngưỡng 15%."
        ],
        note: "Độ sâu là siêu tham số chính; thêm một tầng là gấp đôi số lá tối đa."
      },
      {
        short: "Mạng 5.000 tham số",
        type: "pitfall",
        title: "Khi số tham số vượt số mẫu",
        body: "Một mạng hai tầng ẩn 64 nơ-ron trên 12 đặc trưng đã có khoảng 5.000 tham số, gấp năm lần số mẫu huấn luyện. Kết quả quen thuộc là lỗi huấn luyện 2%, lỗi kiểm định 30%, khoảng cách 28 điểm phần trăm. Mô hình học thuộc 1.000 mẫu chứ không học quy luật. Quy tắc thô là cần khoảng 10 mẫu cho mỗi tham số, tức 50.000 mẫu cho cấu hình này. Ba cách chặn: giảm còn một tầng 16 nơ-ron với khoảng 300 tham số, thêm dữ liệu, hoặc dùng điều chuẩn như weight decay và dropout. Đừng chữa bằng cách tăng số vòng, vì lỗi huấn luyện đã gần 0.",
        focus: ["net", "over", "val"],
        edges: ["tree-net", "over-val"],
        metrics: { params: "5.000", depth: "3 lớp", trainMin: "18 phút", ok: "quá khớp" },
        changes: [
          "Khoảng cách giữa lỗi huấn luyện và kiểm định nới từ 8 lên 28 điểm.",
          "Số tham số vượt số mẫu huấn luyện khoảng năm lần."
        ],
        note: "Khi số tham số lớn hơn số mẫu, mô hình đủ sức ghi nhớ cả nhiễu."
      },
      {
        short: "Chốt mô hình",
        type: "final",
        title: "Quy trình chọn mô hình",
        tone: "final",
        body: "Chốt quy trình chọn mô hình. Một là dựng đường cơ sở bằng hồi quy tuyến tính 13 tham số, ghi lỗi kiểm định 9%. Hai là thử cây sâu 6, chỉ giữ nếu lỗi kiểm định giảm ít nhất 2 điểm phần trăm. Ba là chỉ thử mạng nơ-ron khi đã có trên 10.000 mẫu, vì 5.000 tham số cần chừng 50.000 mẫu mới ổn định. Bốn là so mọi mô hình trên cùng tập kiểm định, cùng cách chia. Năm là ghi số tham số, độ sâu và thời gian huấn luyện cạnh điểm số. Sáu là nếu hai mô hình tương đương, chọn mô hình ít tham số hơn. Bảy là giữ tập test nguyên vẹn cho lần chấm cuối.",
        focus: "all",
        edges: "all",
        metrics: { params: "13", depth: "không", trainMin: "dưới 1 phút", ok: "đạt" },
        changes: [
          "Mô hình chốt là tuyến tính, ít tham số nhất mà vẫn đạt.",
          "Bộ tiêu chí ghi kèm số tham số và thời gian huấn luyện."
        ],
        note: "Ưu tiên mô hình đơn giản khi điểm số chênh nhau dưới 1 điểm phần trăm."
      }
    ]
  };

  T.lessons["loss"] = {
    id: "loss",
    module: "mo-hinh-va-huan-luyen",
    title: "Hàm mất mát",
    shortTitle: "Hàm mất mát",
    subtitle: "Đọc đường loss để biết mô hình đang học gì",
    blurb: "Hàm mất mát cho biết mô hình đang học tốt lên hay chỉ dao động. Bài này đọc đường loss từ 0,62 xuống 0,18, phân biệt giảm đều với nảy lên xuống, và chỉ ra tốc độ học quá lớn là nguyên nhân thường gặp.",
    duration: "12 phút",
    level: "Cơ bản",
    tags: ["hàm mất mát", "MSE", "gradient", "tốc độ học", "hội tụ"],
    metrics: [
      { key: "loss0", label: "Loss ban đầu", tone: "blue" },
      { key: "lossN", label: "Loss hiện tại", tone: "mint" },
      { key: "epochs", label: "Số vòng", tone: "yellow" },
      { key: "ok", label: "Trạng thái", tone: "coral" }
    ],
    nodes: [
      { id: "loss", type: "signal", x: 55, y: 80, w: 200, h: 70, label: "Hàm mất mát", sub: "MSE trên lô 32 mẫu" },
      { id: "grad", type: "code", x: 340, y: 80, w: 200, h: 70, label: "Gradient", sub: "đạo hàm 13 chiều" },
      { id: "lr", type: "clock", x: 625, y: 80, w: 200, h: 70, label: "Tốc độ học", sub: "0,1 là quá lớn" },
      { id: "pred", type: "task", x: 55, y: 310, w: 200, h: 70, label: "Dự đoán", sub: "cho 1.000 mẫu" },
      { id: "curve", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "Đường loss", sub: "0,62 xuống 0,18" },
      { id: "step", type: "event", x: 625, y: 310, w: 200, h: 70, label: "Bước cập nhật", sub: "w trừ lr nhân grad" },
      { id: "check", type: "check", x: 340, y: 195, w: 200, h: 70, label: "Theo dõi loss", sub: "ghi log mỗi vòng" }
    ],
    edges: [
      { id: "pred-loss", from: "pred", to: "loss", kind: "data", label: "sai số" },
      { id: "loss-grad", from: "loss", to: "grad", kind: "control", label: "lấy đạo hàm" },
      { id: "grad-lr", from: "grad", to: "lr", kind: "data", label: "nhân tốc độ học" },
      { id: "lr-step", from: "lr", to: "step", kind: "control", label: "bước nhảy" },
      { id: "step-curve", from: "step", to: "curve", kind: "data", label: "loss mới" },
      { id: "curve-pred", from: "curve", to: "pred", kind: "control", label: "dự đoán lại" },
      { id: "curve-check", from: "curve", to: "check", kind: "data", label: "ghi log" }
    ],
    learn: [
      "Mất mát gộp mọi sai số thành một số để tối thiểu hóa.",
      "Gradient 13 chiều chỉ hướng tăng nhanh nhất của mất mát.",
      "Tốc độ học 0,01 giảm đều; 0,1 gây nảy lên xuống.",
      "Đọc đường loss kèm đường kiểm định mới biết mô hình có học thật."
    ],
    steps: [
      {
        short: "Loss đo gì",
        type: "concept",
        title: "Một con số cho toàn bộ sai số",
        body: "Mất mát là một con số duy nhất tóm toàn bộ sai số của mô hình trong một lô, nhờ vậy huấn luyện trở thành bài toán tối thiểu hóa. Với bài toán dự đoán giá, hàm phổ biến là bình phương sai số trung bình, viết tắt MSE: lấy hiệu giữa giá thật và giá dự đoán, bình phương, rồi lấy trung bình trên 32 mẫu của lô. Cần phân biệt mất mát với độ chính xác: mất mát thay đổi mượt nên dùng để cập nhật trọng số, còn độ chính xác chỉ để báo cáo. Một mô hình đạt độ chính xác 90% vẫn có thể có mất mát cao nếu các dự đoán sai rất tự tin.",
        focus: ["pred", "loss"],
        edges: ["pred-loss"],
        metrics: { loss0: "0,62", lossN: "0,62", epochs: "0", ok: "chưa chạy" },
        changes: [
          "Mọi sai số được gộp thành một số duy nhất để tối thiểu.",
          "Độ chính xác được tách khỏi mục tiêu huấn luyện."
        ],
        note: "Tối ưu mất mát không đồng nghĩa tối ưu chỉ số bạn thật sự quan tâm."
      },
      {
        short: "Giảm theo vòng",
        type: "flow",
        title: "Từ 0,62 xuống 0,48 sau 10 vòng",
        body: "Khởi tạo ngẫu nhiên, mô hình dự đoán gần như vô nghĩa nên mất mát ban đầu là 0,62. Mỗi vòng, thuật toán tính đạo hàm riêng của mất mát theo từng trọng số, tức gradient 13 chiều, rồi dịch từng trọng số ngược hướng đạo hàm một đoạn bằng tốc độ học nhân gradient, theo công thức <code>w = w - lr * grad</code>. Với tốc độ học 0,01, sau 10 vòng trên 800 mẫu, mất mát giảm còn 0,48, tức khoảng 23%. Đường mất mát đi xuống đều, không nhảy, là dấu hiệu tốc độ học phù hợp. Nếu đường đi ngang từ vòng thứ ba, hãy tăng tốc độ học hoặc kiểm tra dữ liệu đầu vào trước khi nghĩ đến mô hình phức tạp hơn.",
        focus: ["loss", "grad", "step"],
        edges: ["loss-grad", "grad-lr", "lr-step"],
        metrics: { loss0: "0,62", lossN: "0,48", epochs: "10", ok: "giảm đều" },
        changes: [
          "Mười vòng đầu kéo mất mát từ 0,62 xuống 0,48.",
          "Đường cong đi xuống đều, không có vòng tăng."
        ],
        note: "Hai mươi ba phần trăm sau mười vòng là nhịp giảm bình thường cho bài toán này."
      },
      {
        short: "Tốc độ học",
        type: "detail",
        title: "Chọn tốc độ học 0,01",
        body: "Tốc độ học quyết định độ dài mỗi bước đi trên mặt mất mát. Với dữ liệu đã chuẩn hóa, 0,01 là điểm khởi đầu tốt cho bài toán này: sau 40 vòng, mất mát xuống 0,18 và đường cong chạm đáy. Nếu đặt 0,0001, sau 40 vòng mất mát chỉ còn 0,55, huấn luyện chậm nhưng vẫn đi đúng hướng. Nếu đặt 0,1, bước đi dài hơn miệng thung lũng nên mất mát nhảy qua nhảy lại quanh đáy. Cách chọn thực dụng là thử ba giá trị 0,001, 0,01 và 0,1 trên cùng 10 vòng, giữ giá trị cho đường cong giảm đều nhất. Đừng chỉnh tốc độ học cùng lúc với kiến trúc mô hình, vì sẽ không biết cái gì tạo ra thay đổi.",
        focus: ["lr", "grad", "step"],
        edges: ["grad-lr", "lr-step"],
        metrics: { loss0: "0,62", lossN: "0,18", epochs: "40", ok: "hội tụ" },
        changes: [
          "Mất mát xuống 0,18 sau 40 vòng ở tốc độ 0,01.",
          "Đường cong chạm đáy rồi đi ngang."
        ],
        note: "Chuẩn hóa đặc trưng trước khi chọn tốc độ học, nếu không mọi so sánh đều lệch."
      },
      {
        short: "Loss nảy",
        type: "pitfall",
        title: "Khi đường loss nhảy lên xuống",
        body: "Đường mất mát nhảy lên xuống là dấu hiệu rõ nhất của tốc độ học quá lớn. Với tốc độ 0,1, mất mát dao động giữa 0,62 và 0,95, có vòng còn tăng vọt vì bước cập nhật vượt qua đáy. Nhiều người tưởng mô hình hỏng nên thêm tầng hoặc đổi hàm mất mát, trong khi chỉ cần giảm tốc độ học xuống 0,01 là đường cong trở lại mượt. Ba việc nên làm khi thấy hiện tượng này: ghi mất mát từng vòng thay vì từng 10 vòng, giảm tốc độ học một nửa rồi chạy lại, và theo dõi mất mát trên tập kiểm định để biết mô hình học được quy luật hay chỉ chạy theo nhiễu.",
        focus: ["lr", "curve", "step"],
        edges: ["lr-step", "step-curve", "curve-check"],
        metrics: { loss0: "0,62", lossN: "0,95", epochs: "40", ok: "dao động" },
        changes: [
          "Mất mát cuối kỳ tăng lên 0,95 thay vì giảm.",
          "Đường cong thành răng cưa, không có điểm đáy rõ."
        ],
        note: "Dao động quanh đáy khác với tăng dần đều; nguyên nhân và cách sửa cũng khác."
      },
      {
        short: "Đọc đường loss",
        type: "final",
        title: "Quy tắc đọc đường mất mát",
        tone: "final",
        body: "Chốt cách đọc đường mất mát. Một là ghi mất mát huấn luyện và mất mát kiểm định mỗi vòng, không gộp trung bình. Hai là đường giảm rồi đi ngang là hội tụ bình thường; dừng khi độ giảm dưới 0,001 trong 5 vòng. Ba là đường răng cưa là tốc độ học quá lớn, giảm một nửa rồi chạy lại. Bốn là mất mát huấn luyện giảm mà mất mát kiểm định tăng là quá khớp, dừng sớm tại vòng có kiểm định tốt nhất. Năm là mất mát không giảm từ đầu thường do tốc độ học quá nhỏ hoặc dữ liệu chưa chuẩn hóa. Sáu là luôn so với đường cơ sở dự đoán bằng giá trị trung bình.",
        focus: "all",
        edges: "all",
        metrics: { loss0: "0,62", lossN: "0,18", epochs: "40", ok: "đạt" },
        changes: [
          "Quy tắc dừng dựa trên độ giảm thay vì số vòng cố định.",
          "Mất mát kiểm định được ghi song song mỗi vòng."
        ],
        note: "Một đường cong đọc đúng đáng giá hơn mười lần đổi kiến trúc mù quáng."
      }
    ]
  };

  T.lessons["huan-luyen"] = {
    id: "huan-luyen",
    module: "mo-hinh-va-huan-luyen",
    title: "Vòng huấn luyện",
    shortTitle: "Vòng huấn luyện",
    subtitle: "Chia lô, cập nhật trọng số và dừng sớm",
    blurb: "Một vòng huấn luyện gồm chia lô, tính gradient, cập nhật trọng số và đo lại trên tập kiểm định. Bài này chạy 25 lô mỗi vòng với tốc độ học 0,01, đặt dừng sớm sau 5 vòng không cải thiện.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["vòng huấn luyện", "chia lô", "trọng số", "dừng sớm", "kiểm định"],
    metrics: [
      { key: "batches", label: "Lô mỗi vòng", tone: "blue" },
      { key: "epochs", label: "Số vòng", tone: "mint" },
      { key: "lr", label: "Tốc độ học", tone: "yellow" },
      { key: "ok", label: "Trạng thái", tone: "coral" }
    ],
    nodes: [
      { id: "data", type: "disk", x: 55, y: 80, w: 200, h: 70, label: "Dữ liệu huấn luyện", sub: "800 mẫu, 12 cột" },
      { id: "batch", type: "queue", x: 340, y: 80, w: 200, h: 70, label: "Chia lô", sub: "25 lô, 32 mẫu" },
      { id: "model", type: "grid", x: 625, y: 80, w: 200, h: 70, label: "Mô hình", sub: "13 trọng số" },
      { id: "update", type: "bolt", x: 625, y: 310, w: 200, h: 70, label: "Cập nhật trọng số", sub: "w trừ lr nhân grad" },
      { id: "val", type: "shield", x: 340, y: 310, w: 200, h: 70, label: "Tập kiểm định", sub: "200 mẫu, đo mỗi vòng" },
      { id: "stop", type: "clock", x: 55, y: 310, w: 200, h: 70, label: "Dừng sớm", sub: "5 vòng không giảm" },
      { id: "over", type: "alert", x: 340, y: 195, w: 200, h: 70, label: "Quá khớp", sub: "train 2%, val 30%" }
    ],
    edges: [
      { id: "data-batch", from: "data", to: "batch", kind: "data", label: "xáo trộn" },
      { id: "batch-model", from: "batch", to: "model", kind: "request", label: "32 mẫu mỗi lô" },
      { id: "model-update", from: "model", to: "update", kind: "control", label: "gradient", bow: 22 },
      { id: "update-model", from: "update", to: "model", kind: "data", label: "trọng số mới", bow: -22 },
      { id: "update-val", from: "update", to: "val", kind: "data", label: "đo lỗi" },
      { id: "val-stop", from: "val", to: "stop", kind: "control", label: "không giảm" },
      { id: "val-over", from: "val", to: "over", kind: "data", label: "gap 28 điểm" }
    ],
    learn: [
      "800 mẫu chia lô 32 cho đúng 25 bước cập nhật mỗi vòng.",
      "Cập nhật trọng số sau khi tính đủ gradient của cả lô.",
      "Đo tập kiểm định sau mỗi vòng, không đo sau mỗi bước.",
      "Dừng sớm phải khôi phục trọng số của vòng tốt nhất."
    ],
    steps: [
      {
        short: "Một vòng",
        type: "concept",
        title: "Một vòng gồm bốn việc",
        body: "Huấn luyện là lặp lại một vòng gồm bốn việc: lấy một lô mẫu, tính dự đoán, tính mất mát và cập nhật trọng số. Với 800 mẫu huấn luyện chia lô 32, mỗi vòng có đúng 25 lô, tức 25 bước cập nhật. Xáo trộn dữ liệu trước mỗi vòng để mô hình không học theo thứ tự bảng. Sau mỗi vòng, đo lại trên 200 mẫu kiểm định để biết mô hình tiến bộ thật hay chỉ thuộc tập huấn luyện. Cách chia lô ảnh hưởng đến độ mượt của đường mất mát: lô 32 cho gradient nhiễu vừa phải, lô 256 mượt hơn nhưng tốn bộ nhớ và ít bước cập nhật hơn trên cùng một vòng.",
        focus: ["data", "batch", "val"],
        edges: ["data-batch"],
        metrics: { batches: "25", epochs: "0", lr: "0,01", ok: "chưa chạy" },
        changes: [
          "800 mẫu được chia thành 25 lô cố định.",
          "Tập kiểm định 200 mẫu được đo sau mỗi vòng."
        ],
        note: "Một vòng duyệt hết dữ liệu một lần; đừng nhầm vòng với bước cập nhật."
      },
      {
        short: "25 lô",
        type: "flow",
        title: "Hai mươi lăm bước trong một vòng",
        body: "Trong một vòng, dữ liệu được xáo trộn rồi cắt thành 25 lô 32 mẫu. Mỗi lô đi qua mô hình 13 trọng số, cho ra 32 dự đoán, từ đó tính mất mát trung bình của lô. Gradient của lô được dùng để cập nhật ngay, theo công thức <code>w = w - lr * grad</code> với tốc độ học 0,01. Vì cập nhật 25 lần mỗi vòng, đường mất mát ghi theo bước sẽ răng cưa nhẹ, còn ghi theo vòng thì mượt. Sau 42 vòng, mô hình đạt mất mát huấn luyện 0,09 và mất mát kiểm định 0,14. Hai con số này gần nhau, nghĩa là mô hình học được quy luật chung chứ không chỉ nhớ dữ liệu.",
        focus: ["batch", "model", "update"],
        edges: ["batch-model", "model-update"],
        metrics: { batches: "25", epochs: "1", lr: "0,01", ok: "chạy" },
        changes: [
          "Mỗi vòng phát 25 bước cập nhật thay vì một bước.",
          "Đường mất mát theo bước nhiễu hơn đường theo vòng."
        ],
        note: "Ghi log theo cả bước và vòng để phân biệt nhiễu lô với dao động thật."
      },
      {
        short: "Cập nhật",
        type: "detail",
        title: "Cập nhật trọng số đúng thứ tự",
        body: "Mỗi bước cập nhật chỉ dịch trọng số một đoạn nhỏ, bằng tốc độ học nhân gradient. Với 13 trọng số, mỗi bước là 13 phép nhân và 13 phép trừ, chi phí không đáng kể so với việc tính dự đoán cho 32 mẫu. Sau 25 bước của vòng đầu, mất mát giảm từ 0,62 xuống 0,48. Điều quan trọng là cập nhật phải xảy ra sau khi tính đủ gradient của cả lô, không cập nhật sau từng mẫu, nếu không đường cong sẽ nhiễu mạnh và khó so sánh giữa các lần chạy. Với dữ liệu lớn, người ta dùng lô lớn hơn và tăng tốc độ học theo tỉ lệ, nhưng với 800 mẫu thì lô 32 là đủ.",
        focus: ["model", "update", "val"],
        edges: ["update-model", "update-val"],
        metrics: { batches: "25", epochs: "1", lr: "0,01", ok: "giảm" },
        changes: [
          "13 trọng số được cập nhật 25 lần trong vòng đầu.",
          "Mất mát vòng đầu giảm từ 0,62 xuống 0,48."
        ],
        note: "Cập nhật theo lô thường ổn định hơn cập nhật theo từng mẫu."
      },
      {
        short: "Dừng sớm",
        type: "pitfall",
        title: "Dừng sớm, nhưng phải khôi phục",
        body: "Chạy càng nhiều vòng không có nghĩa là mô hình càng tốt. Sau vòng 42, mất mát kiểm định bắt đầu tăng trong khi mất mát huấn luyện vẫn giảm, khoảng cách nới từ 5 lên 28 điểm phần trăm: mô hình chuyển từ học quy luật sang học thuộc nhiễu. Dừng sớm giải quyết đúng điểm này bằng cách theo dõi tập kiểm định, dừng sau 5 vòng không cải thiện, rồi khôi phục trọng số của vòng tốt nhất. Cần lưu lại trọng số tốt nhất chứ không chỉ dừng, nếu không bạn giữ đúng mô hình đã bắt đầu quá khớp. Đặt patience 5 là cân bằng giữa kiên nhẫn và lãng phí.",
        focus: ["val", "stop", "over"],
        edges: ["val-stop", "val-over"],
        metrics: { batches: "25", epochs: "42", lr: "0,01", ok: "dừng sớm" },
        changes: [
          "Vòng 42 là điểm kiểm định tốt nhất, sau đó lỗi tăng.",
          "Trọng số được khôi phục về vòng 42 thay vì vòng cuối."
        ],
        note: "Dừng sớm cần lưu trọng số tốt nhất; chỉ dừng thì vô ích."
      },
      {
        short: "Chốt vòng",
        type: "final",
        title: "Vòng huấn luyện dùng được ngay",
        tone: "final",
        body: "Chốt vòng huấn luyện dùng được ngay. Một là chia 800 mẫu huấn luyện và 200 mẫu kiểm định, xáo trộn trước mỗi vòng. Hai là lô 32 mẫu, tốc độ học 0,01, tối đa 200 vòng. Ba là sau mỗi vòng, ghi mất mát huấn luyện và mất mát kiểm định kèm thời gian chạy. Bốn là dừng sớm khi kiểm định không giảm sau 5 vòng, rồi khôi phục trọng số tốt nhất. Năm là chỉ chấm tập test một lần sau khi đã chốt cấu hình. Sáu là lưu tốc độ học, số lô và số vòng vào tệp cấu hình để tái lập. Bảy là chạy lại hai lần với cùng cấu hình để chắc kết quả không phụ thuộc may mắn.",
        focus: "all",
        edges: "all",
        metrics: { batches: "25", epochs: "42", lr: "0,01", ok: "đạt" },
        changes: [
          "Cấu hình huấn luyện được lưu đủ để tái lập.",
          "Mô hình chốt lấy trọng số của vòng 42."
        ],
        note: "Tái lập được là điều kiện để tin vào mọi so sánh sau đó."
      }
    ]
  };

  T.lessons["kiem-dinh"] = {
    id: "kiem-dinh",
    module: "mo-hinh-va-huan-luyen",
    title: "Kiểm định chéo",
    shortTitle: "Kiểm định chéo",
    subtitle: "k phần, điểm trung bình và độ lệch",
    blurb: "Kiểm định chéo chia dữ liệu thành k phần, lần lượt giữ một phần làm kiểm định và huấn luyện trên phần còn lại. Bài này chạy k bằng 5 trên 1.000 mẫu, đọc điểm 0,86 cộng trừ 0,02, và giữ tập test đến cuối.",
    duration: "12 phút",
    level: "Trung cấp",
    tags: ["kiểm định chéo", "k phần", "siêu tham số", "độ lệch", "tập test"],
    metrics: [
      { key: "folds", label: "Số phần", tone: "blue" },
      { key: "meanScore", label: "Điểm trung bình", tone: "mint" },
      { key: "std", label: "Độ lệch", tone: "yellow" },
      { key: "ok", label: "Kết luận", tone: "coral" }
    ],
    nodes: [
      { id: "data", type: "disk", x: 55, y: 80, w: 200, h: 70, label: "Dữ liệu 1.000 mẫu", sub: "12 đặc trưng, 1 nhãn" },
      { id: "split", type: "layers", x: 340, y: 80, w: 200, h: 70, label: "Chia k phần", sub: "k bằng 5, mỗi phần 200" },
      { id: "train", type: "code", x: 625, y: 80, w: 200, h: 70, label: "Huấn luyện", sub: "4 phần, 800 mẫu" },
      { id: "test", type: "shield", x: 340, y: 195, w: 200, h: 70, label: "Tập test niêm phong", sub: "chỉ chấm một lần" },
      { id: "score", type: "star", x: 625, y: 310, w: 200, h: 70, label: "Điểm mỗi vòng", sub: "5 điểm từ 0 đến 1" },
      { id: "mean", type: "grid", x: 340, y: 310, w: 200, h: 70, label: "Trung bình, độ lệch", sub: "0,86 cộng trừ 0,02" },
      { id: "pick", type: "check", x: 55, y: 310, w: 200, h: 70, label: "Chọn siêu tham số", sub: "so 5 cấu hình" }
    ],
    edges: [
      { id: "data-split", from: "data", to: "split", kind: "data", label: "1.000 mẫu" },
      { id: "split-train", from: "split", to: "train", kind: "request", label: "4 phần, 800 mẫu" },
      { id: "train-score", from: "train", to: "score", kind: "data", label: "5 vòng" },
      { id: "score-mean", from: "score", to: "mean", kind: "data", label: "5 điểm" },
      { id: "mean-pick", from: "mean", to: "pick", kind: "control", label: "so sánh cấu hình" },
      { id: "split-test", from: "split", to: "test", kind: "control", label: "giữ riêng 200" },
      { id: "test-mean", from: "test", to: "mean", kind: "data", label: "kết quả cuối" }
    ],
    learn: [
      "k bằng 5 nghĩa là mỗi mẫu được kiểm định đúng một lần.",
      "Điểm cuối là trung bình 5 vòng, ghi kèm độ lệch chuẩn.",
      "Tập test tách riêng từ đầu, chỉ chấm một lần sau khi chốt.",
      "So siêu tham số trên kiểm định chéo, không trên tập test."
    ],
    steps: [
      {
        short: "Vì sao chia lại",
        type: "concept",
        title: "Một lần chia là chưa đủ",
        body: "Một lần chia 70/15/15 cho điểm kiểm định phụ thuộc vào việc 150 mẫu nào rơi vào tập kiểm định. Đổi cách chia, điểm có thể lệch 3 đến 5 điểm phần trăm, đủ để chọn sai mô hình. Kiểm định chéo lặp lại việc chia nhiều lần trên cùng dữ liệu huấn luyện rồi lấy trung bình, nên điểm số ổn định hơn. Với k bằng 5, mỗi mẫu được kiểm định đúng một lần và được huấn luyện bốn lần. Chi phí là gấp 5 lần thời gian huấn luyện, nhưng với mô hình chạy 2 phút mỗi lần thì vẫn chấp nhận được. Đây là cách chuẩn để so sánh siêu tham số.",
        focus: ["data", "split", "score"],
        edges: ["data-split"],
        metrics: { folds: "1", meanScore: "chưa có", std: "chưa có", ok: "chưa chia" },
        changes: [
          "Điểm số không còn phụ thuộc vào một lần chia may rủi.",
          "Chi phí huấn luyện tăng lên 5 lần."
        ],
        note: "Điểm kiểm định lệch 3 đến 5 điểm chỉ vì cách chia là chuyện thường."
      },
      {
        short: "Chia 5 phần",
        type: "flow",
        title: "Năm vòng, năm phần kiểm định",
        body: "Chia 1.000 mẫu thành 5 phần bằng nhau, mỗi phần 200 mẫu, cố định cách chia bằng một hạt giống để tái lập. Vòng thứ nhất giữ phần 1 làm kiểm định và huấn luyện trên 800 mẫu còn lại; vòng thứ hai giữ phần 2, và cứ thế đến phần 5. Mỗi vòng cho một điểm, ví dụ 0,84, 0,87, 0,86, 0,88 và 0,85. Trung bình là 0,86 và độ lệch chuẩn khoảng 0,02. Độ lệch nhỏ nghĩa là mô hình không phụ thuộc vào một phần dữ liệu cụ thể. Nếu một vòng thấp hơn hẳn, hãy xem phần đó có khác biệt gì về phân bố trước khi kết luận mô hình kém.",
        focus: ["split", "train", "score"],
        edges: ["split-train", "train-score"],
        metrics: { folds: "5", meanScore: "0,86", std: "0,02", ok: "chia xong" },
        changes: [
          "Năm phần 200 mẫu được cố định bằng hạt giống.",
          "Mỗi phần làm kiểm định đúng một lần."
        ],
        note: "Ghi lại hạt giống và cách chia, nếu không lần sau không tái lập được."
      },
      {
        short: "Trung bình",
        type: "detail",
        title: "Trung bình chưa đủ, cần độ lệch",
        body: "Điểm cuối là trung bình của 5 vòng, nhưng chỉ nhìn trung bình là chưa đủ. Hai cấu hình cùng đạt 0,86 vẫn có thể khác nhau: một cái dao động 0,84 đến 0,88, cái kia 0,80 đến 0,92. Độ lệch chuẩn cho biết mức ổn định, nên ghi kèm dưới dạng 0,86 cộng trừ 0,02. Khi so siêu tham số, chọn cấu hình có trung bình cao và độ lệch nhỏ; nếu chênh nhau dưới 0,01 thì ưu tiên cấu hình đơn giản hơn. Với 5 vòng, sai số của chính điểm trung bình còn khoảng 0,01, nên đừng tin vào khác biệt 0,003. Muốn chắc hơn, tăng k lên 10 hoặc lặp toàn bộ với 3 hạt giống khác.",
        focus: ["score", "mean", "pick"],
        edges: ["score-mean", "mean-pick"],
        metrics: { folds: "5", meanScore: "0,86", std: "0,02", ok: "ổn định" },
        changes: [
          "Báo cáo ghi 0,86 cộng trừ 0,02 thay vì một con số đơn.",
          "Cấu hình dao động mạnh bị loại dù trung bình bằng nhau."
        ],
        note: "Hai cấu hình cùng điểm trung bình có thể có độ tin cậy rất khác nhau."
      },
      {
        short: "Đừng chạm test",
        type: "pitfall",
        title: "Dùng test để chọn là tự lừa mình",
        body: "Lỗi nghiêm trọng nhất là dùng tập test trong kiểm định chéo, dù chỉ để chọn trong 5 cấu hình. Mỗi lần nhìn điểm test và quyết định, bạn đã đưa thông tin của test vào quy trình; sau vài chục lần, điểm test trở thành điểm huấn luyện và không còn khách quan. Quy tắc là chia 200 mẫu test ngay từ đầu, niêm phong, chỉ chấm một lần sau khi chốt cấu hình. Nếu vô tình chấm nhiều lần, hãy coi con số đó là điểm kiểm định và chia một tập test mới. Với dữ liệu theo thời gian, chia test theo mốc thời gian chứ không ngẫu nhiên, nếu không sẽ rò rỉ tương lai.",
        focus: ["test", "split", "pick"],
        edges: ["split-test", "test-mean"],
        metrics: { folds: "5", meanScore: "0,86", std: "0,02", ok: "giữ test" },
        changes: [
          "Tập test 200 mẫu được niêm phong trước khi thử cấu hình.",
          "Mọi quyết định siêu tham số chỉ dựa trên điểm kiểm định chéo."
        ],
        note: "Điểm test đã dùng để chọn thì không còn là điểm test."
      },
      {
        short: "Quy trình",
        type: "final",
        title: "Quy trình kiểm định chéo 5 phần",
        tone: "final",
        body: "Chốt quy trình. Một là tách 200 mẫu test ngay từ đầu, cất đi, không chạm. Hai là trên 800 mẫu còn lại, chạy kiểm định chéo 5 phần với hạt giống cố định. Ba là với mỗi cấu hình siêu tham số, ghi trung bình và độ lệch chuẩn của 5 vòng. Bốn là chọn cấu hình có trung bình cao nhất trong nhóm sai khác không quá 0,01, ưu tiên cấu hình đơn giản. Năm là huấn luyện lại trên toàn bộ 800 mẫu với cấu hình đã chọn. Sáu là chấm test đúng một lần và ghi vào báo cáo. Bảy là lưu cách chia, hạt giống và danh sách cấu hình đã thử để tái lập.",
        focus: "all",
        edges: "all",
        metrics: { folds: "5", meanScore: "0,86", std: "0,02", ok: "đạt" },
        changes: [
          "Quy trình tách test và chọn siêu tham số được viết thành 7 bước.",
          "Báo cáo cuối chỉ có một con số test duy nhất."
        ],
        note: "Kiểm định chéo chọn cấu hình; test chỉ xác nhận lần cuối."
      }
    ]
  };

  T.practice.push({
    tag: "TRAIN",
    module: "mo-hinh-va-huan-luyen",
    title: "Mô hình 5.000 tham số trên 1.000 mẫu",
    scenario: "Một cửa hàng thiết bị học tập dựng mô hình dự đoán doanh thu tháng cho 1.000 chi nhánh. Nhóm kỹ thuật dùng mạng nơ-ron hai tầng ẩn 64 nơ-ron trên 12 đặc trưng, tổng cộng khoảng 5.000 tham số. Sau 40 vòng, lỗi trên tập huấn luyện chỉ còn 2% và mọi người muốn triển khai ngay. Người kiểm định thử trên 200 mẫu giữ riêng và nhận lỗi 30%. Dữ liệu thêm rất khó thu thập vì nhiều chi nhánh mới mở chưa đủ lịch sử. Sếp hỏi nên làm gì trong hai tuần tới.",
    metrics: [
      { label: "Tham số", value: "5.000", danger: true },
      { label: "Mẫu huấn luyện", value: "1.000" },
      { label: "Lỗi kiểm định", value: "30%", danger: true }
    ],
    options: [
      "Tăng số vòng huấn luyện để mô hình học kỹ hơn",
      "Giữ nguyên mô hình và hạ ngưỡng đánh giá cho dễ đạt",
      "Giảm độ phức tạp xuống mô hình ít tham số và bổ sung dữ liệu nếu có",
      "Đổi sang tập kiểm định khác để có lỗi thấp hơn"
    ],
    correct: 2,
    explain: "Khoảng cách 2% và 30% là 28 điểm phần trăm, dấu hiệu quá khớp nặng do 5.000 tham số trên 1.000 mẫu, tức năm tham số cho mỗi mẫu. Tăng số vòng chỉ làm mô hình thuộc dữ liệu chặt hơn, lỗi kiểm định còn tệ hơn. Hạ ngưỡng đánh giá hay đổi tập kiểm định không sửa được mô hình, chỉ che con số. Cách đúng là giảm độ phức tạp: hồi quy tuyến tính 13 tham số hoặc cây sâu 4, rồi thêm dữ liệu và dùng điều chuẩn. Mục tiêu là đưa lỗi kiểm định xuống dưới 12% trước khi bàn đến triển khai."
  });

  T.practice.push({
    tag: "LOSS",
    module: "mo-hinh-va-huan-luyen",
    title: "Loss nhảy lên xuống sau khi tăng tốc độ học",
    scenario: "Một nhóm sinh viên huấn luyện mô hình dự đoán điểm thi trên 800 mẫu, dùng gradient descent với tốc độ học 0,01 và thấy mất mát giảm đều từ 0,62 xuống 0,18 sau 40 vòng. Muốn nhanh hơn, một bạn đổi tốc độ học lên 0,1 rồi chạy lại. Kết quả là mất mát nhảy từ 0,62 lên 0,95, có vòng xuống 0,70 rồi vọt lên 1,20, đường cong răng cưa không có điểm đáy. Nhóm chia nhau ba hướng sửa: thêm một tầng ẩn, đổi hàm mất mát sang entropy chéo, hoặc chỉnh tốc độ học. Bạn được nhờ chọn hướng đúng và cách theo dõi sau đó.",
    metrics: [
      { label: "Tốc độ học", value: "0,1", danger: true },
      { label: "Loss cuối", value: "0,95", danger: true },
      { label: "Số vòng", value: "40" }
    ],
    options: [
      "Thêm một tầng ẩn để mô hình biểu diễn tốt hơn",
      "Giảm tốc độ học về 0,01 và theo dõi mất mát kiểm định mỗi vòng",
      "Đổi sang entropy chéo vì MSE không phù hợp",
      "Chạy thêm 200 vòng để mô hình tự ổn định"
    ],
    correct: 1,
    explain: "Đường răng cưa quanh đáy là dấu hiệu kinh điển của tốc độ học quá lớn: bước cập nhật dài hơn miệng thung lũng nên mỗi lần lại nhảy sang phía bên kia. Thêm tầng ẩn làm mô hình phức tạp hơn, không liên quan đến dao động và dễ gây quá khớp. Đổi hàm mất mát chỉ đổi thang đo, không sửa được bước nhảy. Chạy thêm vòng với tốc độ 0,1 chỉ kéo dài dao động. Giảm về 0,01, hoặc thử 0,005, rồi ghi mất mát huấn luyện và kiểm định từng vòng để xác nhận đường cong mượt trở lại."
  });

  T.cheatsheets.push({
    id: "training",
    num: "02",
    module: "mo-hinh-va-huan-luyen",
    title: "Bảng tra huấn luyện",
    intro: "Bảng tra cho phần mô hình và huấn luyện: cách chọn họ mô hình theo số mẫu, mẫu vòng huấn luyện, bảng tốc độ học, sơ đồ kiểm định chéo 5 phần và checklist dừng sớm. Chép vào tài liệu dự án để tra nhanh.",
    cards: [
      {
        title: "Bảng chọn mô hình",
        wide: true,
        html: "<table class=\"cheat-table\"><thead><tr><th>Mô hình</th><th>Tham số</th><th>Mẫu nên có</th><th>Dùng khi</th></tr></thead><tbody><tr><td>Hồi quy tuyến tính</td><td class=\"mono\">13</td><td>100 trở lên</td><td>Quan hệ gần đường thẳng, cần đọc hệ số</td></tr><tr><td>Cây quyết định</td><td class=\"mono\">63 nút</td><td>500 trở lên</td><td>Có ngưỡng rõ, cần giải thích cho người ngoài ngành</td></tr><tr><td>Mạng nơ-ron</td><td class=\"mono\">5.000</td><td>50.000 trở lên</td><td>Dữ liệu lớn, quan hệ phi tuyến phức tạp</td></tr></tbody></table><p>Quy tắc thô: khoảng 10 mẫu cho mỗi tham số. Số tham số vượt số mẫu là dấu hiệu quá khớp.</p>"
      },
      {
        title: "Mẫu vòng huấn luyện",
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>for epoch in range(200):\n    shuffle(train)\n    for batch in chunks(train, 32):\n        y = model(batch.x)\n        l = mse(y, batch.y)\n        g = grad(l, model.w)\n        w = w - 0.01 * g\n    val_loss = eval(model, val)\n    if val_loss &gt; best for 5 lan:\n        break</code></pre></div><p>800 mẫu, lô 32: đúng 25 bước mỗi vòng. Lưu trọng số của vòng tốt nhất.</p>"
      },
      {
        title: "Bảng tốc độ học",
        html: "<table class=\"cheat-table\"><thead><tr><th>Tốc độ</th><th>Đường loss</th><th>Xử lý</th></tr></thead><tbody><tr><td class=\"mono\">0,1</td><td>Răng cưa, có vòng tăng</td><td>Giảm một nửa rồi chạy lại</td></tr><tr><td class=\"mono\">0,01</td><td>Giảm đều, chạm đáy sau 40 vòng</td><td>Giữ, đây là mặc định</td></tr><tr><td class=\"mono\">0,001</td><td>Giảm chậm, chưa chạm đáy</td><td>Tăng gấp đôi nếu còn ngân sách vòng</td></tr></tbody></table>"
      },
      {
        title: "Sơ đồ kiểm định chéo 5 phần",
        wide: true,
        html: "<div style=\"margin-top:10px;overflow-x:auto\"><pre><code>Vong 1: [KD] [HL] [HL] [HL] [HL]  -&gt; 0,84\nVong 2: [HL] [KD] [HL] [HL] [HL]  -&gt; 0,87\nVong 3: [HL] [HL] [KD] [HL] [HL]  -&gt; 0,86\nVong 4: [HL] [HL] [HL] [KD] [HL]  -&gt; 0,88\nVong 5: [HL] [HL] [HL] [HL] [KD]  -&gt; 0,85\n\nKD = kiem dinh (200 mau), HL = huan luyen (800 mau)\nTrung binh 0,86 - do lech 0,02 - test 200 mau de rieng</code></pre></div><p>Mỗi mẫu làm kiểm định đúng một lần. Tập test chỉ chấm sau khi chốt cấu hình.</p>"
      },
      {
        title: "Checklist dừng sớm",
        html: "<ul style=\"margin-top:9px;padding-left:16px;font-size:.7rem;line-height:1.55;color:var(--text-soft)\"><li>Đo mất mát kiểm định sau mỗi vòng, không sau mỗi bước.</li><li>Đặt patience 5 vòng trước khi dừng.</li><li>Lưu trọng số của vòng có kiểm định tốt nhất.</li><li>Khôi phục trọng số đó trước khi báo cáo.</li><li>Ghi số vòng thực chạy và lý do dừng.</li><li>Không chấm tập test trong vòng lặp huấn luyện.</li></ul>"
      }
    ]
  });
})();
