import QrScanner from 'qr-scanner';
import { Button, ActionIcon, List, Center } from '@mantine/core';
import { IconFocusCentered, IconCirclePlus, IconCircleMinus, IconCircleCheck } from '@tabler/icons'
import { useState } from 'react';
import { showNotification } from '@mantine/notifications';

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
            const parseProduct = JSON.parse(result.data.toString());
            const itemIndex = product.findIndex((item) => item.id === parseProduct.id);
            if (itemIndex === -1) {
              setProduct(prev => [...prev, parseProduct]);
            } else {
              setProduct(product => product.map(i => i.id === parseProduct.id 
                ? { ...i, quantity: i.quantity + 1 }
                : i
              ));
            }
            showNotification({
              title: 'Quét thành công',
              icon: <IconCircleCheck />,
              color: "green"
            })
            qrScanner.stop();
          }
        }, {
          // highlightScanRegion: true,
          // highlightCodeOutline: true,
        }
      );
    }
  }, 1000);

  const vnCurrency = (price) => {
    return price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
  }

  const onAction = (type, id) => {
    const itemIndex = product.findIndex((item) => item.id === id);
    if (itemIndex !== -1) {
      switch (type) {
        case "increase":
          setProduct(product => product.map(i => i.id === id 
            ? { ...i, quantity: i.quantity + 1 }
            : i
          ));
          break;
        case "decrease":
          setProduct(product => product.map(i => i.id === id 
            ? { ...i, quantity: i.quantity - 1 }
            : i
          ));
          if (product[itemIndex].quantity === 1) {
            setProduct(product => product.filter(i => i.id !== id));
          }
          break;
        default:
          break;
      }
    }
  }

  const onSubmit = () => {
    setProduct([])
  }

  return (
    <div>
      <div style={{background: "black"}}>
        <video id='qr-scan' style={{width: "100%", height: "100%"}}></video>
      </div>
      <div style={{display: 'flex', alignItems: "center", flexDirection: "column", gap: 30, marginTop: "30px"}}>
        <ActionIcon onClick={() => qrScanner.start()} color="green" size="xl" variant="filled">
          <IconFocusCentered size={34} />
        </ActionIcon>
        {/* <Button onClick={() => qrScanner.stop()}>Dừng</Button> */}
      </div>

      <List listStyleType="none">
        {
          product && product.map((item) => {
            return (
              <List.Item key={item.id}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                  <p>{item.name}</p>
                  <p>{vnCurrency(item.price * item.quantity)}</p>
                  <div style={{display: "flex", gap: 10, alignItems: "center"}}>
                    <ActionIcon color="green" variant="filled" onClick={() => onAction("increase",item.id)}>
                      <IconCirclePlus />
                    </ActionIcon>
                    {item.quantity}
                    <ActionIcon color="green" variant="filled" onClick={() => onAction("decrease",item.id)}>
                      <IconCircleMinus />
                    </ActionIcon>
                  </div>
                </div>
            </List.Item>
            )
          })
        }
      </List>
      <Center>
        <Button disabled={product.length === 0} mt={20} onClick={onSubmit}>Hoàn tất đơn hàng</Button>
      </Center>
    </div>
  )
}

export default App
