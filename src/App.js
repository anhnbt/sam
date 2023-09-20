import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import PaidTwoToneIcon from "@mui/icons-material/PaidTwoTone";
import WhatshotTwoToneIcon from "@mui/icons-material/WhatshotTwoTone";
import Stack from "@mui/material/Stack";
import { red } from "@mui/material/colors";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import "./App.css";

function App() {
  const [playerNames, setPlayerNames] = useState(["", "", "", "", ""]);
  const [scores, setScores] = useState(
    Array.from({ length: 5 }, () => Array(5).fill(0))
  );
  const [totalScores, setTotalScores] = useState(Array(5).fill(0));
  const [roundCount, setRoundCount] = useState(1);
  const [roundTotals, setRoundTotals] = useState(Array(5).fill(0));
  const [editModes, setEditModes] = useState(
    Array.from({ length: 5 }, () => Array(5).fill(false))
  ); // Mảng editModes cho từng ô
  const inputRefs = useRef(
    Array.from({ length: 5 }, () => Array(5).fill(null))
  ); // Tham chiếu cho từng ô input
  const tableRef = useRef(null);

  const handleNameChange = (index, name) => {
    const newPlayerNames = [...playerNames];
    newPlayerNames[index] = name;
    setPlayerNames(newPlayerNames);
  };

  const handleScoreChange = (playerIndex, roundIndex, value) => {
    const newScores = [...scores];
    newScores[playerIndex][roundIndex] = parseInt(value, 10) || 0;
    setScores(newScores);
  };

  useEffect(() => {
    // Tính tổng điểm và cập nhật state
    for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
      let totalScore = 0;
      for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
        totalScore += scores[playerIndex][roundIndex] || 0; // Sử dụng giá trị mặc định 0
      }
      totalScores[playerIndex] = totalScore;
    }
    setTotalScores([...totalScores]);
  }, [scores, roundCount, totalScores]);

  useEffect(() => {
    // Tính tổng điểm của mỗi dòng và cập nhật state
    for (let roundIndex = 0; roundIndex < roundCount; roundIndex++) {
      let roundTotal = 0;
      for (let playerIndex = 0; playerIndex < 5; playerIndex++) {
        roundTotal += scores[playerIndex][roundIndex] || 0;
      }
      roundTotals[roundIndex] = roundTotal;
    }
    setRoundTotals([...roundTotals]);
  }, [scores, roundCount, roundTotals]);

  const totalScoreSum = totalScores.reduce((sum, score) => sum + score, 0);

  const handleFinish = () => {
    // Lấy thẻ gốc của bảng
    const table = tableRef.current;

    // Sử dụng HTML2Canvas để chuyển bảng thành hình ảnh
    html2canvas(table).then((canvas) => {
      // // Chuyển hình ảnh thành blob
      // canvas.toBlob((blob) => {
      //   // Tạo tên file và tải về
      //   saveAs(blob, 'ket-qua.png');
      // });
      // Chuyển hình ảnh thành Blob
      canvas.toBlob((blob) => {
        // Tạo một mảng các dạng file có 1 item (ảnh)
        const items = [new window.ClipboardItem({ "image/png": blob })];

        // Sao chép hình ảnh vào clipboard
        navigator.clipboard
          .write(items)
          .then(() => {
            alert("Hình ảnh đã được sao chép vào clipboard.");
          })
          .catch(() => {
            alert("Không thể sao chép hình ảnh vào clipboard.");
          });
      }, "image/png");
    });
  };

  const toggleEditMode = (playerIndex, roundIndex) => {
    const newEditModes = [...editModes];
    newEditModes[playerIndex][roundIndex] = !editModes[playerIndex][roundIndex];
    setEditModes(newEditModes);
  };

  const handleTabKey = (playerIndex, roundIndex, e) => {
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của Shift+Tab
      let prevRoundIndex = roundIndex - 1;
      let prevPlayerIndex = playerIndex - 1;
      const prevEditModes = [...editModes];
      console.log('roundIndex', roundIndex, 'prevPlayerIndex', prevPlayerIndex, 'playerIndex', playerIndex);
      if (prevPlayerIndex >= 0) {
        console.log('Di chuyển sang cột trước đó của cùng dòng');
        // Di chuyển sang cột trước đó của cùng dòng
        prevEditModes[prevPlayerIndex][roundIndex] = true;
        setEditModes(prevEditModes);
        if (inputRefs.current[prevPlayerIndex][roundIndex]) {
          inputRefs.current[prevPlayerIndex][roundIndex].focus();
        }
      } else if (roundIndex > 0 && playerIndex === 0) {
        // Nếu ở cột đầu tiên của dòng và không phải hàng đầu tiên, di chuyển lên dòng trước và cột cuối cùng
        prevPlayerIndex = 4;
        prevRoundIndex = roundIndex - 1;
        prevEditModes[prevPlayerIndex][prevRoundIndex] = true;
        setEditModes(prevEditModes);
        if (inputRefs.current[prevPlayerIndex][prevRoundIndex]) {
          inputRefs.current[prevPlayerIndex][prevRoundIndex].focus();
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault(); // Ngăn chặn hành vi mặc định của Tab

      let nextRoundIndex = roundIndex + 1;
      let nextPlayerIndex = playerIndex + 1;
      const nextEditModes = [...editModes];
      console.log(
        "nextPlayerIndex: ",
        nextPlayerIndex,
        " roundIndex: ",
        roundIndex,
        "nextRoundIndex: ",
        nextRoundIndex,
        "roundCount: ",
        roundCount
      );

      if (nextPlayerIndex === 5) {
        console.log("Vao day a");
        // Nếu ở cột cuối của dòng và không phải hàng cuối cùng, di chuyển sang dòng tiếp theo và cột đầu tiên
        nextPlayerIndex = 0;
        nextEditModes[nextPlayerIndex][nextRoundIndex] = true;
        setEditModes(nextEditModes);
        if (inputRefs.current[nextPlayerIndex][nextRoundIndex]) {
          inputRefs.current[nextPlayerIndex][nextRoundIndex].focus();
        }
      } else if (nextPlayerIndex < 5) {
        console.log("Vao day nhe");
        // Di chuyển sang cột tiếp theo của cùng dòng
        nextEditModes[nextPlayerIndex][roundIndex] = true;
        setEditModes(nextEditModes);
        if (inputRefs.current[nextPlayerIndex][roundIndex]) {
          inputRefs.current[nextPlayerIndex][roundIndex].focus();
        }
      }
    }
  };

  return (
    <div className="App">
      <h1>Sâm thủ</h1>
      <TableContainer component={Paper}>
        <Table
          size="small"
          stickyHeader
          aria-label="sticky table"
          ref={tableRef}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">Người Chơi</TableCell>
              {playerNames.map((name, playerIndex) => (
                <TableCell key={playerIndex} align="right">
                  <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={name}
                    onChange={(e) =>
                      handleNameChange(playerIndex, e.target.value)
                    }
                  />
                </TableCell>
              ))}
              <TableCell align="center">Tổng Dòng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: roundCount }).map((_, roundIndex) => (
              <TableRow
                key={roundIndex}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">Lượt {roundIndex + 1}</TableCell>
                {playerNames.map((_, playerIndex) => (
                  <TableCell
                    key={playerIndex}
                    onClick={() => toggleEditMode(playerIndex, roundIndex)} // Sử dụng sự kiện onClick để xử lý
                    onKeyDown={(e) => handleTabKey(playerIndex, roundIndex, e)} // Xử lý sự kiện Tab và Shift+Tab
                    style={{ cursor: "pointer" }} // Đổi con trỏ chuột thành kiểu "pointer" khi hover vào TableCell
                    tabIndex={0} // Cho phép ô TableCell trở thành focusable
                  >
                    {editModes[playerIndex][roundIndex] ? (
                      <TextField
                        variant="outlined"
                        size="small"
                        fullWidth
                        type="number"
                        value={scores[playerIndex][roundIndex] || ""}
                        onChange={(e) =>
                          handleScoreChange(
                            playerIndex,
                            roundIndex,
                            e.target.value
                          )
                        }
                        onFocus={() => {
                          // Tự động tăng roundCount khi focus vào ô input cuối cùng
                          if (roundIndex === roundCount - 1) {
                            setRoundCount(roundCount + 1);
                          }
                        }}
                        onBlur={() => toggleEditMode(playerIndex, roundIndex)} // Khi thay đổi xong, thoát khỏi chế độ chỉnh sửa
                        inputRef={(input) => {
                          inputRefs.current[playerIndex][roundIndex] = input;
                        }}
                        autoFocus // Tự động focus vào ô input khi hiển thị
                      />
                    ) : (
                      scores[playerIndex][roundIndex] || ""
                    )}
                  </TableCell>
                ))}
                <TableCell
                  className={roundTotals[roundIndex] !== 0 ? "red" : ""}
                  align="right"
                >
                  {roundTotals[roundIndex]}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell align="center">Tổng Điểm</TableCell>
              {totalScores.map((total, index) => (
                <TableCell key={index} align="right">
                  {playerNames[index] ? playerNames[index] + ": " : ""}
                  {total}
                </TableCell>
              ))}
              <TableCell align="right">{totalScoreSum}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        sx={{ mt: 2 }}
        spacing={2}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setRoundCount(roundCount + 1)}
          startIcon={<PaidTwoToneIcon color="warning" />}
        >
          Báo
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setRoundCount(roundCount + 1)}
          startIcon={<WhatshotTwoToneIcon sx={{ color: red[500] }} />}
        >
          Cháy
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleFinish}
          startIcon={<CloudDownload />}
        >
          Kết thúc
        </Button>
      </Stack>
    </div>
  );
}

export default App;
