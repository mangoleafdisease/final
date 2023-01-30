/* eslint-disable */
import './App.css';
import { Button, Card, Col, Image, Row } from "antd";
import Webcam from "react-webcam";
import { useState } from 'react';
import { isMobile } from "react-device-detect";
import axios from "axios";

//
const url = "http://localhost:8000/predict"

function App() {

  const videoConstraints = {
    width: "auto",
    height: "auto",
    facingMode: "environment"
  };
  const [predicting, setpredicting] = useState(false)
  const [imgSrc, setimgSrc] = useState("")
  const [result, setresult] = useState(null)

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

  const PredictLeaf = async (image) => {
    try {
      const file = dataURLtoFile(image, "file")
      console.log(file)
      var formData = new FormData();
      formData.append("file", file);
      await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log(res.data)
        setresult(res.data)
        //setpredicting(false)
      }).catch(err => {
        console.log(err.message)
        setresult(null)
        setpredicting(false)
      })
    } catch (err) {
      console.log(err.message)
      setresult(null)
      setpredicting(false)
    }
  }
  return (
    <Row gutter={[24, 0]}
      style={{
        width: window.innerWidth,
        backgroundColor: "gray",
        height: window.innerHeight,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundImage: "url('https://treejourney.com/wp-content/uploads/2022/01/15129582_l-1024x683.jpg')",
        opacity: "0.8",
        padding: 0, margin: 0
      }}
    >
      {
        isMobile ?
          <Col xs={24}>
            <center>
              <Col xs={24} style={{ padding: 10, textAlign: "center" }}>
                <b style={{ fontSize: 35 }}>
                  Mango Disease <br />
                  Classification
                </b>
              </Col>
              <Col xs={22}
                style={{
                  marginTop: "12%"
                }}
              >

                <Card
                  style={{
                    backgroundColor: "transparent",
                    borderColor: "transparent"
                  }}
                  cover={
                    predicting === false &&
                    <Webcam
                      audio={false}
                      height={"auto"}
                      width={"auto"}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                    >
                      {({ getScreenshot }) => (
                        <Button
                          style={{ marginTop: 20, width: "72%", }}
                          danger
                          onClick={() => {
                            const imageSrc = getScreenshot();

                            setimgSrc(imageSrc)
                            setpredicting(true)
                            PredictLeaf(imageSrc)
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
                    predicting === false &&
                    <Col>
                    <b style={{ color: "white" }}>OR </b><br/><br/>
                    <Button>
                      Upload Image
                    </Button>
                    </Col>
                  }
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
                        {
                          result === null ?
                            <Col style={{ paddingTop: 10 }}>
                              <Button loading={true} variant={"ghost"}
                                style={{ width: "100%" }}
                              >
                                Predicting . . .
                              </Button>
                            </Col>
                            :
                            <div>
                              <Col xs={24} style={{ marginTop: 20, fontSize: 15, color: "white", backgroundColor: result.unable===true? "red" : "#32CD32", borderRadius: 10 }}>
                                {
                                  result.unable===true?
                                    <b>Unable to predict image, please try again!</b>
                                    :
                                    <>
                                      Disease Detected:<b> {result.class}</b> <br />
                                      Confidence: <b>{(result.confidence * 100).toFixed(2)}%</b>
                                    </>
                                }
                              </Col>
                              <Col xs={24} style={{ marginTop: 20 }}>
                                <Button type="primary"
                                  onClick={() => {
                                    setresult(null)
                                    setpredicting(false)
                                  }}
                                >
                                  Try Another
                                </Button>
                              </Col>
                            </div>
                        }
                      </center>
                    </Col>
                  }
                </Card>
              </Col>
            </center>
          </Col>
          :
          <Col xs={24} style={{ marginTop: "10%" }}>
            <center>
              <b>⚠️ Only available on mobile web browser!</b>
            </center>
          </Col>
      }
    </Row>
  );
}

export default App;
