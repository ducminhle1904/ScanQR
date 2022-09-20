import QrScanner from 'qr-scanner';
import { Button, ActionIcon, List } from '@mantine/core';
import { IconFocusCentered, IconCirclePlus, IconCircleMinus } from '@tabler/icons'
import { useState } from 'react';

function App() {
  let videoElem
  let qrScanner;
  const [product, setProduct] = useState([])
  setTimeout(() => {
    videoElem = document.getElementById("qr-scan");
    if (videoElem) {
      qrScanner = new QrScanner(
        videoElem,
        result => {
          if (result) {
            setProduct(prev => [...prev, JSON.parse(result.data.toString())]);
            qrScanner.stop();
          }
        }, {
          highlightScanRegion: true,
        }
      );
    }
  }, 1000);

  return (
    <div>
      <div style={{background: "black"}}>
        <video id='qr-scan' style={{width: "100%", height: "100%"}}></video>
      </div>
      <div style={{display: 'flex', alignItems: "center", flexDirection: "column", gap: 30, marginTop: "30px"}}>
        <ActionIcon onClick={() => qrScanner.start()} color="green" size="xl" variant="filled">
          <IconFocusCentered size={34} />
        </ActionIcon>
        <Button onClick={() => qrScanner.stop()}>Dừng</Button>
      </div>

      <List listStyleType="none">
        {
          product && product.map((item) => {
            return (
              <List.Item key={item.id}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                  <p>{item.name}</p>
                  <p>{item.price}</p>
                  <div style={{display: "flex", gap: 10}}>
                    <ActionIcon color="green" variant="filled">
                      <IconCirclePlus />
                    </ActionIcon>
                    1
                    <ActionIcon color="green" variant="filled">
                      <IconCircleMinus />
                    </ActionIcon>
                  </div>
                </div>
            </List.Item>
            )
          })
        }
      </List>
    </div>
  )
}

export default App
