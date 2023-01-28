/* eslint-disable */
import './App.css';
import { Button, Card, Col, Image, Row } from "antd";
import Webcam from "react-webcam";
import { useState } from 'react';

function App() {

  const videoConstraints = {
    width: "auto",
    height: "auto",
    facingMode: "environment"
  };
  const [predicting, setpredicting] = useState(false)
  const [imgSrc, setimgSrc] = useState("")

  const dataURLtoFile = (dataurl, filename) => {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  return (
    <Row gutter={[24, 0]}
      style={{
        width: "100%",
        backgroundColor: "gray",
        height: window.innerHeight,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundImage: "url('https://treejourney.com/wp-content/uploads/2022/01/15129582_l-1024x683.jpg')",
        opacity: "0.8",
      }}
    >
      <Col xs={24}>
        <center>
          <Col xs={24} style={{ padding: 10, textAlign: "center" }}>
            <b style={{ fontSize: 35 }}>
              Mango Disease <br />
              Classification
            </b>
          </Col>
          <Col xs={17}
            style={{
              marginTop: "35%"
            }}
          >

            <Card
              style={{

              }}
              cover={
                predicting === false &&
                <Webcam
                  audio={false}
                  height={256}
                  width={256}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                >
                  {({ getScreenshot }) => (
                    <Button
                      style={{ marginTop: 20 }}
                      onClick={() => {
                        const imageSrc = getScreenshot();
                        const file = dataURLtoFile(imageSrc, "file")
                        console.log(file)

                        setimgSrc(imageSrc)
                        setpredicting(true)
                        setTimeout(() => {
                          setpredicting(false)
                        }, 3000)
                      }}
                    > 
                      Capture Mango Leaf
                    </Button>
                  )}
                </Webcam>
              }
              footer={null}
            >
              {
                predicting &&
                <Col xs={24} style={{}}>
                  <center>
                    <Image
                      src={imgSrc}
                      width={"auto"}
                      height={"auto"}
                      preview={false}
                    />
                    <Col style={{ paddingTop: 10 }}>
                      <Button loading={true} variant={"ghost"}
                        style={{ width: "100%" }}
                      >
                        Predicting . . .
                      </Button>
                    </Col>
                  </center>
                </Col>
              }
            </Card>
          </Col>
        </center>
      </Col>
    </Row>
  );
}

export default App;
