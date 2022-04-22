import Layout from '../components/layout'
import { useState, useRef, useEffect } from "react"
import API from '../common/api';
import { useRouter } from 'next/router'
import { Container, Row, Col, Form, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap'
import pageStyle from '../styles/cnft-calendar/main.module.css';
import sectionStyle from '../styles/cnft-calendar/nft-calendar.module.css';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const positions = [
  { id: 1, title: 'Main page header', price: 30 },
  { id: 2, title: 'Main page featured', price: 15 },
  { id: 3, title: 'Main page footer', price: 7 },
];

export default function PromoProject() {

  const router = useRouter();

  // init state
  const initialPromoState = {
    position_id: 1,
    image: "",
    start_date: new Date(),
    end_date: new Date(),
  };
  const [promo, setPromo] = useState(initialPromoState);

  // position handler
  const [excludeDates, setEdates] = useState([]);
  const getDdates = async (position_id) => {
    const disabledDays = await API.getJSONData(`/promos/get-disabled-days?position_id=${position_id}`);
    console.log('disabled days');
    console.log(disabledDays);
    setEdates(disabledDays);
  }
  useEffect(() => {
    getDdates(1);
  }, [])
  const changePositionHandler = id => {
    setPromo({ ...promo, position_id: id });
    getDdates(id);
  };
  const position = positions.find((position) => position.id == promo.position_id);

  // image change handler
  const placeholderImage = "https://via.placeholder.com/300X300.png?text=no%20image%20selected";
  const [previewImgUrl, setPreviewImgUrl] = useState(placeholderImage);
  const changeImageHandler = (event) => {
    const file = event.target.files[0];
    setPromo({ ...promo, image: file });
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      setPreviewImgUrl(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  // date change handler
  const changePromoDateHandler = (key, date) => {
    setPromo({ ...promo, [key]: date });
  };

  const startDateTimestamp = promo.start_date.getTime();
  const endDateTimestamp = promo.end_date.getTime();
  let diffInDays = Math.round((endDateTimestamp - startDateTimestamp) / (1000 * 3600 * 24)) + 1;
  var currentDateStamp = startDateTimestamp
  while (currentDateStamp <= endDateTimestamp) {
    let date = new Date(currentDateStamp);
    currentDateStamp = date.setDate(date.getDate() + 1);
    if (excludeDates.includes(getYmdDate(new Date(currentDateStamp)))) {
      diffInDays -= 1;
    }
  }

  const totalPrice = diffInDays * position.price;
  console.log(promo);

  // validation and submit
  const [validationError, setValidationError] = useState({})
  const ref = useRef();
  const savePromo = async () => {
    const formData = new FormData()
    formData.append("calendar_id", router.query.calendar_id);
    for (const field in promo) {
      let value = promo[field];
      if (['start_date', 'end_date'].includes(field)) {
        value = getYmdDate(value);
      }
      formData.append(field, value);
    }
    API.promoProject(formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          // text: data.message
          text: "Submitted successfully"
        })
        setShowModal(true);
        setValidationError({});
      }).catch(({ response }) => {
        if (response.status === 422) {
          setValidationError(response.data.errors)
        } else {
          Swal.fire({
            text: response.data.message,
            icon: "error"
          })
        }
      })
  }

  //barcode modal
  const [showModal, setShowModal] = useState(false);
  const handleClose = () => {
    setShowModal(false);
    setPromo(initialPromoState);
    setPreviewImgUrl(placeholderImage);
    ref.current.value = "";
  }
  const adaAddress = "addr1vxa3j0q6u5a93sjx7e0d5g2rfm7xaut4jlyhly0ws9jljzq6jnaaj";
  const pixel = 380;
  const guidelines = [
    "Only send ADA.",
    "Make sure to send the exact amount of ADA.",
    "Only use a wallet like Yoroi, Nami, Daedalus, ccvault...",
    "Do not send ADA from a crypto exchange like Binance.",
    "This will take up to 10 minutes.",
  ]

  //copied
  const [copied, setCopied] = useState(false);
  const manageCopied  = () => {
    navigator.clipboard.writeText(adaAddress);
    setCopied(true);
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {copied ? "Copied!" : "Click to clipboard"}
    </Tooltip>
  );
  return (
    <Layout title="Promote your project">
      <section>
        <Container className={sectionStyle.container}>
          <div className={sectionStyle.promoProject} >
            <div className={`${sectionStyle.alertCongrates} text-center`}>
              <h4>Congratulations, the project has been successfully posted</h4>
              <p>Project will be reviewed by the team and published within 24 hours </p>
            </div>
            <div className={sectionStyle.promoMiddle}>
              <Row>
                <Col sm={12} md={{ span: 10, offset: 1 }}>
                  <h2>Would you like to promote your project?</h2>
                  <p>Choose one of the three available optiions, set your desired advertising period, pay, and your project will be promoted automatically</p>
                  <Form>
                    <div className={sectionStyle.positions}>
                      <Row>
                        {positions.map((position, key) => {
                          let className = `${(promo.position_id == position.id ? "active" : "")} ${sectionStyle.position}`;
                          return (
                            <Col sm={12} lg={4} key={key}>
                              <div className={className} onClick={() => changePositionHandler(position.id)}>
                                <h4>{position.title}</h4>
                                <small>Price:</small>
                                <h3>{position.price} ADA</h3>
                                <p><b>day</b></p>
                              </div>
                            </Col>)
                        })}
                      </Row>
                    </div>
                    <h3>You chose {position.title} position</h3>
                    <img src={previewImgUrl} className="img-fluid" alt="" />
                    <Row>
                      <Col sm={12} lg={{ span: 8, offset: 2 }}>
                        <Form.Group controlId="Image" className={sectionStyle.promoFormGroup}>
                          <small>Image (1:1 aspect ratio, 4MB max. file size)</small>
                          <Form.Control type="file" className={sectionStyle.listProjectInput} ref={ref} onChange={changeImageHandler} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <h3>Select an available advertising period</h3>
                    <div className={sectionStyle.dateRangePicker}>
                      <Row>
                        <Col sm={12} md={6}>
                          <DatePicker
                            selected={promo.start_date}
                            onChange={(date) => changePromoDateHandler('start_date', date)}
                            selectsStart
                            startDate={promo.start_date}
                            endDate={promo.end_date}
                            excludeDates={excludeDates.map(date => new Date(date))}
                            // excludeDates={[new Date(), new Date("2022-04-21")]}
                            inline
                          />
                        </Col>
                        <Col sm={12} md={6}>
                          <DatePicker
                            selected={promo.end_date}
                            onChange={(date) => changePromoDateHandler('end_date', date)}
                            selectsEnd
                            startDate={promo.start_date}
                            endDate={promo.end_date}
                            excludeDates={excludeDates.map(date => new Date(date))}
                            minDate={promo.start_date}
                            inline
                          /></Col>
                      </Row>
                      <div className={sectionStyle.dayDescription}>
                        <span>Not available</span>
                        <span>Available dates</span>
                        <span>Selected dates</span>
                      </div>
                    </div>
                    {Object.keys(validationError).length > 0 && (
                      <div className="row my-4">
                        <div className="col-12">
                          <div className={sectionStyle.alert}>
                            <ul className="mb-0">
                              {
                                Object.entries(validationError).map(([key, value]) => (
                                  <li key={key}>{value}</li>
                                ))
                              }
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </Form>
                </Col>
              </Row>
            </div>
            <div className={sectionStyle.promoBottom}>
              <Row>
                <Col sm={12} md={{ span: 10, offset: 1 }}>
                  <Row>
                    <Col sm={12} md={4}>
                      <small>Total to pay: </small>
                      <h2>{diffInDays} days</h2>
                    </Col>
                    <Col sm={12} md={4}>
                      <small>Total to pay: </small>
                      <h2>{totalPrice} ADA</h2>
                    </Col>
                    <Col sm={12} md={4}>
                      <Button className={sectionStyle.promoSubmit} size="lg" block="block" onClick={() => savePromo()}>
                        PAY NOW
                      </Button></Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Container>
      </section>
      <Modal show={showModal} onHide={handleClose} className={sectionStyle.qrModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 className="page-header-ui-title market-detail text-center">
            Payment Information</h1>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12 col-xl-5 mt-3 mb-5">
                <div id={sectionStyle.qrCode} className="my-card item buyResult" style={{ backgroundImage: `url("https://chart.googleapis.com/chart?chs=${pixel}x${pixel}&cht=qr&chl=web+cardano:${adaAddress}?amount=${totalPrice}&choe=UTF-8")` }}></div>
              </div>
              <div className="col-md-12 mt-3 col-xl-7">
                <div className="buyResult">
                  <div className="form-group text-start mb-4">
                    <label className="control-label color-Dark01">
                      <small>Send to this ADA Address (click the address to copy)</small>
                    </label>
                    <OverlayTrigger
                  placement="top"
                  delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                >
                    <textarea className="copyThis form-control" id="address" readonly="" onClick={() => manageCopied()}>{adaAddress}</textarea>
                    </OverlayTrigger>
                  </div>
                  <div className="form-group text-start mb-4">
                    <label className="control-label color-Dark01">
                      <small>Send this exact ADA Amount (click the amount to copy)</small>
                    </label>
                    <input type="text" className="copyThis form-control" id="dust" readonly="" value={totalPrice}/>
                  </div>
                  <h3>Guidelines</h3>
                  <ul>
                    {guidelines.map((guideline, key) =>
                      <li key={key}>
                        <img src="/images/list-item.svg" /><span>{guideline}</span></li>
                    )}
                  </ul>
                </div>

              </div>
            </div>

            <div className="reminder font-bold">
              <p className="text-center">Not complying with the guidelines above may result in permanent loss of
                your ADA, and you won’t receive your NFT.</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

function getYmdDate(dateObj) {
  var month = dateObj.getMonth() + 1; //months from 1-12
  var day = dateObj.getDate();
  var year = dateObj.getFullYear();
  if (month < 10)
    month = '0' + month;
  if (day < 10)
    day = '0' + day;
  return year + "-" + month + "-" + day;
}

