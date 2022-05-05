import Layout from '../components/layout'
import { useState, useEffect, useRef } from "react"
import API from '../common/api';
import { useRouter } from 'next/router'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import pageStyle from '../styles/cnft-calendar/main.module.css';
import sectionStyle from '../styles/cnft-calendar/nft-calendar.module.css';
import TwitterMembersCount from '../components/nft-calendar/twitter-members-count';
import Select from 'react-select';
import Swal from 'sweetalert2';


const FormInput = (props) => {
  const { label, type, name, calendar, handleInputChange } = props;
  return <Form.Group className={`${sectionStyle.listFormGroup}`}>
    <Form.Label>{label}</Form.Label>
    <Form.Control className={sectionStyle.listProjectInput} type={type} value={calendar[name]} name={name} onChange={handleInputChange} />
    {name === "title" && <Form.Label className="my-3">This is a comment about this field and this may be quite a long text.</Form.Label>}
  </Form.Group>
}

const SERVER_URL = API.SERVER_URL;
export default function ListProject() {
  const router = useRouter();
  const initialCalendarState = {
    title: "",
    mint_date: "",
    attrs: "",
    description: "",
    blockchain: "",
    mint_price: "",
    supply: "",
    website: "",  
    discord: "",
    twitter: "",
    image: "",
    is_upcoming: false,
  };
  const placeholderImage = "https://via.placeholder.com/300X300.png?text=no%20image%20selected";
  const ref = useRef();
  const [blockchains, setBlockchains] = useState([]);
  const [attributes, setAttributes] = useState([]);
  useEffect(() => {
    const getData = async () => {
      let blockchains = await API.fetchBlockchains();
      setBlockchains(blockchains);
      const attributes = await API.fetchAttributes();
      setAttributes(attributes);
    }
    getData();
  }, [])

  const [calendar, setCalendar] = useState(initialCalendarState);
  const handleInputChange = event => {
    let { name, value } = event.target;
    setCalendar({ ...calendar, [name]: value });
  };


  const changeAttrsHandler = event => {
    let ids = event.map(item => item.value);
    setCalendar({ ...calendar, attrs: ids.join(",") });
  };

  const changeBlockchainHandler = event => {
    setCalendar({ ...calendar, ['blockchain']: event.value });
  };

  const [previewImgUrl, setPreviewImgUrl] = useState(placeholderImage);
  const changeImageHandler = (event) => {
    const file = event.target.files[0];
    setCalendar({ ...calendar, image: file });
    const reader = new FileReader();
    reader.addEventListener("load", function () {
      // convert image file to base64 string
      setPreviewImgUrl(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const [validationError, setValidationError] = useState({})

  const saveCalendar = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    for (const field in calendar) {
      let value = calendar[field];
      switch (field) {
        case "is_upcoming":
          value = calendar[field] === true ? 1 : 0;
          break;
      }
      formData.append(field, value);
    }

    API.listProject(formData)
      .then(({ data }) => {
        Swal.fire({
          icon: "success",
          // text: data.message
          text: "Submitted successfully"
        })
        router.push({
          pathname: '/promote-project',
          query: { calendar_id: data.calendar_id }
        });
        setCalendar(initialCalendarState);
        setPreviewImgUrl(placeholderImage);
        setValidationError({});
        ref.current.value = "";
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
  let blockchainItem = <></>;
  if (blockchains.length > 0 && calendar.blockchain !== "") {
    console.log(previewImgUrl);
    const blockchain = blockchains.find(obj => obj.value === calendar.blockchain)
    blockchainItem = <><img src={`${SERVER_URL}/storage/blockchains/image/${blockchain['image']}`} className={pageStyle.blockchainImage} />
      <span>{blockchain['label']}</span></>
  }

  let attrs = calendar.attrs ? calendar.attrs.split(",").map(id => {
    return attributes.find(obj => obj.value == id);
  }) : [];
  return (
    <Layout title="List your project">
      <section>
        <Container className={sectionStyle.container}>
          <div className={sectionStyle.listProject} >
            <h2 className={pageStyle.sectionTitle}>List Your Project</h2>
            <p className={pageStyle.sectionDescription}>Fill out this form, we will review the information provided and publish your project on our calendar</p>
            <Row>
              <Col sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
                <div className="form-wrapper">
                  <Form>
                    <FormInput label="Project title" type="text" name="title" calendar={calendar} handleInputChange={handleInputChange} />

                    <Row className="my-1">
                      <Col>
                        <Form.Group className={sectionStyle.listFormGroup}>
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea" rows={4} className={sectionStyle.listProjectInput} value={calendar.description} name="description" onChange={handleInputChange} />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Form.Group className={`${sectionStyle.listFormGroup}`}>
                          <Form.Label>Blockchain</Form.Label>
                          <Select
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: 'gray',
                                primary: 'black',
                              },
                            })}
                            value={blockchains.find(obj => obj.value === calendar.blockchain)}
                            onChange={changeBlockchainHandler}
                            options={blockchains}
                            name="blockchain"
                            classNamePrefix="select"
                            className={sectionStyle.listProjectInput}
                          />
                        </Form.Group>
                        {/* <FormInput label="Blockchain" type="text" name="blockchain" calendar={calendar} handleInputChange={handleInputChange} /> */}
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <FormInput label="Mint Date" type="date" name="mint_date" calendar={calendar} handleInputChange={handleInputChange} />
                      </Col>
                      <Col sm={6}>
                        <FormInput label="Mint Price" type="text" name="mint_price" calendar={calendar} handleInputChange={handleInputChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label>Attributes</Form.Label>
                          <Select
                            theme={(theme) => ({
                              ...theme,
                              borderRadius: 0,
                              colors: {
                                ...theme.colors,
                                primary25: 'gray',
                                primary: 'black',
                              },
                            })}
                            value={attrs}
                            isOptionDisabled={() => attrs.length >= 2}
                            isMulti
                            onChange={changeAttrsHandler}
                            options={attributes}
                            name="attrs"
                            classNamePrefix="select"
                            className={`${sectionStyle.listProjectInput} basic-multi-select`}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <FormInput label="Supply" type="text" name="supply" calendar={calendar} handleInputChange={handleInputChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormInput label="Website" type="url" name="website" calendar={calendar} handleInputChange={handleInputChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormInput label="Discord" type="url" name="discord" calendar={calendar} handleInputChange={handleInputChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <FormInput label="Twitter" type="url" name="twitter" calendar={calendar} handleInputChange={handleInputChange} />
                      </Col>
                    </Row>
                    <Form.Group controlId="Image" className="mb-3">
                      <Form.Label>Image (1:1 aspect ratio, 4MB max. file size)</Form.Label>
                      <Form.Control type="file" className={sectionStyle.listProjectInput} ref={ref} onChange={changeImageHandler} />
                    </Form.Group>
                  </Form>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={{ span: 10, offset: 1 }}>
                <div className={sectionStyle.calendarItem}>
                  <a>
                    <Row>
                      <Col sm={12} lg={4} className={pageStyle.sameImageContainer}>
                        <img
                          src={previewImgUrl} className={`${sectionStyle.calendarImg} img-fluid`} alt=""
                        />
                      </Col>
                      <Col sm={12} lg={8}>
                        <div className={sectionStyle.calendarDetails}>
                          <h3>{calendar.title}</h3>
                          <div className={sectionStyle.calendarAttrs}>
                          {calendar.attrs && calendar.attrs.split(",").map((id, index) => {
                            let attribute = attributes.find(obj => obj.value == id);
                            return <button className={pageStyle.btnSmall} style={{ backgroundColor: attribute.color }} key={index}>{attribute.label}</button>
                          })}
                          </div>
                          <p className={sectionStyle.calendarDescription}>{calendar.description}</p>
                          <div className={sectionStyle.socialStats}>
                            <div>
                              <p>Blockchain</p>
                              <div>
                                {blockchainItem}
                              </div>
                            </div>
                            <div>
                              <p>Mint price</p>
                              <div>
                                <img src="/images/mint-price.svg" />
                                <span>{calendar.mint_price === "" ? "\u00A0" : calendar.mint_price}</span>
                              </div>
                            </div>
                            <div>
                              <p>Supply</p>
                              <div>
                                <img src="/images/ruby.svg" />
                                <span>{calendar.supply === "" ? "\u00A0" : calendar.supply}</span>
                              </div>
                            </div>

                            <div>
                              <p>Discord</p>
                              <div>
                                <img src="/images/discord.svg" />
                                <span>0</span>
                              </div>
                            </div>

                            <div>
                              <p>Twitter</p>
                              <div>
                                <img src="/images/twitter.svg" />
                                <span><TwitterMembersCount link={calendar.twitter} /></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </a>
                </div>
              </Col></Row>
            <div className={sectionStyle.listProjectBottom}>
              <Row>
                <Col sm={12} md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }}>
                  {Object.keys(validationError).length > 0 && (
                    <div className="row">
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
                  <Button className={sectionStyle.projectSubmit} onClick={saveCalendar} size="lg" block="block" type="submit">
                    Submit
                  </Button>
                </Col>
              </Row></div>
          </div>
        </Container>
      </section>
    </Layout>
  )
}