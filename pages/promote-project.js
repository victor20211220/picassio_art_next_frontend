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
import Globals from '../common/Globals';

const positions = [
  { id: 1, title: 'Main page header', price: 30 },
  { id: 2, title: 'Main page featured', price: 15 },
  { id: 3, title: 'Main page footer', price: 7 },
];

export default function PromoProject() {

  const router = useRouter();

  const setting = Globals.getSetting();
  const walletAddress = setting.wallet_address;
  console.log(walletAddress);
  positions[0]['price'] = setting.promote_price1;
  positions[1]['price'] = setting.promote_price2;
  positions[2]['price'] = setting.promote_price3;

  // init state
  const curDate = new Date();
  const [secondMinute, setSecondminute] = useState("");
  useEffect(
    () => {
      setSecondminute(curDate.getSeconds() + "" + curDate.getMinutes());
    }
    , []);

  curDate.setDate(curDate.getDate() + 1);
  const initialPromoState = {
    position_id: 1,
    image: "",
    start_date: new Date(),
    end_date: curDate
  };
  const [promo, setPromo] = useState(initialPromoState);

  // position handler
  const [excludeDates, setEdates] = useState([]);

  const getDdates = async (position_id) => {
    // const disabledDays = ['2022-04-20', '2022-04-21', '2022-04-22', '2022-04-23', '2022-04-25', '2022-04-26', '2022-04-27', '2022-04-29'];
    // const disabledDays = ['2022-04-20', '2022-04-21', '2022-04-22', '2022-04-23', '2022-04-25', '2022-04-28',  '2022-04-29'];
    // const disabledDays = ["2022-04-27","2022-04-28","2022-04-29"];
    const disabledDays = await API.getJSONData(`/promos/get-disabled-days?position_id=${position_id}`);
    setEdates(disabledDays);


    function availDate(date) {
      if (!disabledDays.includes(getYmdDate(date)))
        return date;
      date.setDate(date.getDate() + 1);
      while (disabledDays.includes(getYmdDate(date))) {
        date.setDate(date.getDate() + 1);
      }
      return date;
    }

    if (disabledDays.length > 0) {
      const startAvailDate = availDate(promo.start_date);
      const nextDate = new Date(startAvailDate.getTime());
      nextDate.setDate(nextDate.getDate() + 1);
      const nextAvailDate = availDate(nextDate);
      setPromo({ ...promo, start_date: startAvailDate, end_date: nextAvailDate });
    }
  }
  useEffect(() => {
    getDdates(promo.position_id);
  }, [])
  const changePositionHandler = id => {
    setPromo({ ...promo, position_id: id });
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
  const changePromoDateHandler = (dates) => {
    const [start, end] = dates;
    setPromo({ ...promo, start_date: start, end_date: end });
  };

  let diffInDays = 0;
  if (promo.end_date) {
    const startDateTimestamp = promo.start_date.getTime();
    const startDate = new Date(startDateTimestamp);
    const endDateTimestamp = promo.end_date.getTime();
    diffInDays = Math.round((endDateTimestamp - startDateTimestamp) / (1000 * 3600 * 24)) + 1;
    startDate.setDate(startDate.getDate() + 1);
    while (startDate.getTime() < endDateTimestamp) {
      if (excludeDates.includes(getYmdDate(startDate))) {
        diffInDays -= 1;
      }
      startDate.setDate(startDate.getDate() + 1);
    }
  }
  const totalPrice = diffInDays === 0 ? 0 : diffInDays * position.price + "." + secondMinute;

  // validation and submit
  const [validationError, setValidationError] = useState({})
  const ref = useRef();
  const savePromo = async () => {
    if (diffInDays === 0) return false;
    const formData = new FormData()
    formData.append("calendar_id", router.query.calendar_id);
    formData.append("total_price", totalPrice);
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
  const pixel = 380;
  const guidelines = [
    "Only send ADA.",
    "Make sure to send the exact amount of ADA.",
  ]

  //copied
  const [copied, setCopied] = useState(false);
  const manageCopied = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
  }
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {copied ? "Copied!" : "Click to clipboard"}
    </Tooltip>
  );

  console.log(promo);
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
                    <img src={`/images/position_screens/${promo.position_id}.png`} className="img-fluid" alt="" />
                    <Row>
                      <Col sm={12} lg={{ span: 8, offset: 2 }}>
                        <Form.Group controlId="Image" className={sectionStyle.promoFormGroup}>
                          <small>Image (1:1 aspect ratio, 4MB max. file size)</small>
                          <Form.Control type="file" className={sectionStyle.listProjectInput} ref={ref} onChange={changeImageHandler} />
                          <div className={sectionStyle.previewImg}>
                            <img src={previewImgUrl} className="img-fluid" alt="" />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    <h3>Select an available advertising period</h3>
                    <div className={sectionStyle.dateRangePicker}>
                      <Row>
                        <Col sm={12} md={{ span: 6, offset: 3 }}>
                          <h4 className={pageStyle.fw800}>
                            {getYmdDate(promo.start_date)} ~ {promo.end_date && getYmdDate(promo.end_date)}
                          </h4>
                          <DatePicker
                            selected={promo.start_date}
                            onChange={changePromoDateHandler}
                            startDate={promo.start_date}
                            endDate={promo.end_date}
                            excludeDates={excludeDates.map(date => new Date(date))}
                            minDate={new Date()}
                            selectsRange
                            inline
                          />
                        </Col>
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
                    <Col sm={12} md={3}>
                      <small>Total to pay: </small>
                      <h2>{diffInDays} days</h2>
                    </Col>
                    <Col sm={12} md={5}>
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
                <div id={sectionStyle.qrCode} className="my-card item buyResult" style={{ backgroundImage: `url("https://chart.googleapis.com/chart?chs=${pixel}x${pixel}&cht=qr&chl=web+cardano:${walletAddress}?amount=${totalPrice}&choe=UTF-8")` }}></div>
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
                      <textarea className="copyThis form-control" id="address" readonly="" onClick={() => manageCopied()}>{walletAddress}</textarea>
                    </OverlayTrigger>
                  </div>
                  <div className="form-group text-start mb-4">
                    <label className="control-label color-Dark01">
                      <small>Send this exact ADA Amount (click the amount to copy)</small>
                    </label>
                    <input type="text" className="copyThis form-control" id="dust" readonly="" value={totalPrice} />
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
                your ADA.</p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Layout>
  )
}

function getYmdDate(dateObj) {
  let month = dateObj.getMonth() + 1; //months from 1-12
  let day = dateObj.getDate();
  const year = dateObj.getFullYear();
  if (month < 10)
    month = '0' + month;
  if (day < 10)
    day = '0' + day;
  return year + "-" + month + "-" + day;
}