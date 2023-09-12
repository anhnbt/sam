import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import ClipboardJS from "clipboard";
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
import { CloudDownload, ContentCopy } from "@mui/icons-material";
import "./App.css";

function App() {
  const [playerNames, setPlayerNames] = useState(["", "", "", "", ""]);
  const [scores, setScores] = useState(
    Array.from({ length: 5 }, () => Array(5).fill(0))
  );
  const [totalScores, setTotalScores] = useState(Array(5).fill(0));
  const [roundCount, setRoundCount] = useState(5);
  const [roundTotals, setRoundTotals] = useState(Array(5).fill(0));
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
  }, [scores, roundCount]);

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
  }, [scores, roundCount]);

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

  return (
    <div className="App">
      <h1>Sâm thủ</h1>
      <TableContainer component={Paper}>
        <Table ref={tableRef}>
          <TableHead>
            <TableRow>
              <TableCell>Người Chơi</TableCell>
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
              <TableCell>Tổng Dòng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from({ length: roundCount }).map((_, roundIndex) => (
              <TableRow key={roundIndex}>
                <TableCell>Lượt {roundIndex + 1}</TableCell>
                {playerNames.map((_, playerIndex) => (
                  <TableCell key={playerIndex}>
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
                    />
                  </TableCell>
                ))}
                <TableCell
                  className={roundTotals[roundIndex] !== 0 ? "red" : ""}
                >
                  {roundTotals[roundIndex]}
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell>Tổng Điểm</TableCell>
              {totalScores.map((total, index) => (
                <TableCell key={index}>{total}</TableCell>
              ))}
              <TableCell>{totalScoreSum}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setRoundCount(roundCount + 1)}
      >
        Thêm dòng
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleFinish}
        startIcon={<CloudDownload />}
      >
        Kết thúc
      </Button>
    </div>
  );
}

export default App;
