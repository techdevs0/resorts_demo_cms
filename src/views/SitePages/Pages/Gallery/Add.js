import React, { Fragment, useEffect, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
// import GridItem from "components/Grid/GridItem.js";
// import GridContainer from "components/Grid/GridContainer.js";
// import CustomInput from "components/CustomInput/CustomInput.js";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import MaterialButton from "@material-ui/core/Button";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import SelectedImagesThumbnails from "../../../Common/SelectedImagesThumbnails";
import avatar from "assets/img/faces/marc.jpg";
import {
  MenuItem,
  Select,
  FormControl,
  TextField,
  CardMedia,
  CardActionArea,
  CardContent,
  CardActions,
  RadioGroup, FormControlLabel, Radio
} from "@material-ui/core";
import CKEditor from 'ckeditor4-react';
import { ckEditorConfig } from "utils/data";
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@arslanshahab/ckeditor5-build-classic';
import { Image } from "@material-ui/icons";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useParams } from "react-router-dom";
import API from "utils/http";
import GalleryDialog from "../../../Common/GalleryDialog";
// const website_url = "/";
import LangAPI from "langapi/http";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // width:'60%',
    // margin:'auto'
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


export default function AddGallery() {
  const pageId = useParams().id;
  const classes = useStyles();
  const [gallery, setGallery] = useState({
    banner: {
      id: 0,
      section_name: '',
      section_content: "<p>Detailed content goes here!</p>",
      page_id: pageId,
      section_avatar: '',
      section_col_arr: 0,
      section_prior: 1,
      section_avtar_alt: '',
      section_slug: 'banner'
    },
    imageGallery: []
  });
  const [seoInfo, setSeoInfo] = useState({
    id: 0,
    post_id: pageId || 0,
    meta_title: '',
    meta_description: '',
    // route: website_url,
    schema_markup: '',
    is_followed: true,
    is_indexed: true,
    is_indexed_or_is_followed: '1,1',
  })
  const [currentSection, setCurrentSection] = useState("")
  const [imagesData, setImagesData] = useState([])
  const [uploadsPreview, setUploadsPreview] = useState(null)
  const [selectedImages, setSelectedImages] = useState([])
  const [showGallery, setShowGallery] = useState(false)
  const [isSingle, setIsSingle] = useState(false);
  const [isImagesList, setImagesList] = useState(false);
  const [renderPreviews, setRenderPreviews] = useState(false)
  const [thumbnailPreview, setThumbnailPreview] = useState('')
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    LangAPI.get(`/all-sections/${pageId}/${selectedLang}`).then(response => {
      if (response?.status === 200) {
        if (response.data[0]) {
          setGallery(response.data[0])
          setSeoInfo(response.data[0]?.meta)
        } else {
          setGallery({
            banner: {
              id: 0,
              section_name: '',
              section_content: "<p>Detailed content goes here!</p>",
              page_id: pageId,
              section_avatar: '',
              section_col_arr: 0,
              section_prior: 1,
              section_avtar_alt: '',
              section_slug: 'banner'
            },
          })

          setSeoInfo({
            id: 0,
            post_id: pageId || 0,
            meta_title: '',
            meta_description: '',
            // route: website_url,
            schema_markup: '',
            is_followed: true,
            is_indexed: true,
            is_indexed_or_is_followed: '1,1',
          })
        }
      }
    });

    if (!imagesData.length > 0) {
      getGalleryImages();
    }
  }, [selectedLang]);

  const getGalleryImages = () => {
    LangAPI.get(`/files`).then(response => {
      if (response.status === 200) {
        setImagesData(response.data)
      }
    })
  }

  const handleInputChange = (e, section) => {
    let updatedAbout = { ...gallery };
    updatedAbout[section][e.target.name] = e.target.value;
    setGallery(updatedAbout);
  }

  // const useForceUpdate = () =>  {

  //   return () => setState(!value);
  // }


  const handleImageSelect = (e, index, section) => {
    // setTimeout(() => {
    //   setShowGallery(false);
    // }, 500);

    if (e.target.checked) {

      if (isSingle && !isImagesList) {
        setGallery({ ...gallery, [section]: { ...gallery[section], section_avatar: imagesData[index] } })

        setTimeout(() => {
          setShowGallery(false);
        }, 500);

      } else if (!isSingle && isImagesList) {

        let gal = { ...gallery }
        // console.log(gal,"gal")
        // return false;
        if (!gal.imageGallery) {
          gal.imageGallery = []
        }
        const index2 = gal?.imageGallery?.findIndex(img => img._id === imagesData[index]._id);
        if (index2 === -1) {
          gal.imageGallery.push(imagesData[index])
          setGallery({ ...gallery, imageGallery: gal.imageGallery })
        } else {
          alert("This Image is already selected")
        }

        let imagesDataUpdated = imagesData.map((x, i) => {
          if (i === index) {
            return {
              ...x,
              isChecked: true,
            };
          } else {
            return x;
          }
        });
        setImagesData(imagesDataUpdated);
      }
    } else {
      let gal = { ...gallery }
      let updateData = gal.imageGallery.filter((u) => u._id !== imagesData[index]._id);
      gal.imageGallery = updateData
      setGallery(gal);

      // setGallery({ ...gallery, [section]: { ...gallery[section], section_avatar: "" } })
      // setThumbnailPreview("")

      setImagesData(imagesData.map((x, i) => {
        if (i === index) {
          return {
            ...x,
            isChecked: false
          }
        } else {
          return x
        }
      }));
    }
  }

  const handleSEOInputChange = (e) => {
    let updatedSeoInfo = { ...seoInfo };
    updatedSeoInfo[e.target.name] = e.target.value;
    setSeoInfo(updatedSeoInfo);
  }

  // const handleRouteChange = (e) => {
  //   let updatedSeoInfo = { ...seoInfo };
  //   let splitValues = e.target.value.split(website_url);
  //   let updatedValue = splitValues[1] ? splitValues[1].replace(/\s+/g, '-') : ""
  //   updatedValue = updatedValue.replace(/--/g, '-')
  //   updatedSeoInfo[e.target.name] = website_url + updatedValue;
  //   setSeoInfo(updatedSeoInfo);
  // }

  const handleSEOSubmit = () => {
    let updatedSeoInfo = seoInfo;
    updatedSeoInfo.is_indexed_or_is_followed = `${updatedSeoInfo.is_indexed},${updatedSeoInfo.is_followed}`;

    if (updatedSeoInfo.id > 0) {
      API.put(`/meta/${pageId}`, updatedSeoInfo).then(response => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      }).catch(err => console.log(err))
    } else {
      API.post(`/meta`, updatedSeoInfo).then(response => {
        if (response.status === 200) {
          alert("Section updated successfully !");
        }
      }).catch(err => console.log(err))

    }
  }

  const handleSubmit = (id, name) => {
    API.post(`/add_section`, gallery[name]).then(response => {
      if (response.status === 200) {
        alert("Section updated successfully !");
      }
    }).catch(err => console.log(err))

    let updatedGalery = { ...gallery };
    updatedGalery.meta = { ...seoInfo };
    updatedGalery.page_id = pageId
    updatedGalery.slug = "gallery-sections"
    // console.log("updatedGalery",updatedGalery); return false;

    LangAPI.post(`/add-section?lang=${selectedLang}`, updatedGalery).then(response => {
      if (response.status === 200) {
        alert("Section updated successfully !");
      }
    }).catch(err => console.log(err))

  }

  const handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != selectedLang) {
      setSelectedLang(event.target.value)
    }
  };

  const handleRemoveSelectedImage = (x, arrayListType) => {

    console.log("Removing selected image :: ", x)
    switch (arrayListType) {
      case "uploadsPreview":
        let updatePreview = gallery?.imageGallery?.filter((u) => u._id !== x._id)
        setUploadsPreview(updatePreview);
        setImagesData(imagesData.map(im => {
          if (im._id === x._id) {
            im.isChecked = false
          }
          return im
        }))
        setSelectedImages(updatePreview.map((u) => u._id));
        break;
      case "selectedImages":
        let gal = { ...gallery }
        let updateData = gal.imageGallery.filter((u) => u._id !== x._id);
        // console.log(updateData,"updateData")
        // return false;
        // let updateData = selectedImages.filter((u) => u._id !== x._id);
        // setImagesData(imagesData.map(im => {
        //   if (im._id === x._id) {
        //     im.isChecked = false
        //   }
        //   return im
        // }))
        gal.imageGallery = updateData
        setGallery(gal);
        break;
      default:
        return setUploadsPreview(gallery?.imageGallery?.filter((u) => u._id !== x._id))
    }
  }

  return (
    <div>
      <div className={classes.root}>
        <Card>
          <CardHeader color="primary" className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Add Gallery</h4>
            {/* <p className={classes.cardCategoryWhite}>Complete your profile</p> */}
            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%", color: "white" }}
            // fullWidth
            >
              <InputLabel id="language"
                style={{ color: "white" }}
              >Select Language</InputLabel>
              <Select
                labelId="language"
                id="language"
                name="language"
                value={selectedLang}
                label="Select Language"
                fullWidth
                style={{ color: "white" }}
                onChange={handleChange}
              >
                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'fr'}>FR</MenuItem>
                <MenuItem value={'de'}>DE</MenuItem>
                <MenuItem value={'ru'}>RU</MenuItem>

              </Select>
            </FormControl>
          </CardHeader>
          <CardBody>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panelaa-content"
                id="panelaa-header"
              >
                <Typography className={classes.heading}>Banner</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    {/* SECTION TITLE */}
                    <TextField
                      required
                      id="section_name"
                      name="section_name"
                      label="Section Title"
                      value={gallery.banner.section_name}
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleInputChange(e, "banner")}
                      size="medium"
                      style={{ marginBottom: '1rem' }}
                    />

                    <div className="thumbnail-preview-wrapper-large img-thumbnail">
                      {
                        !gallery.banner.id > 0 ?
                          gallery.banner.section_avatar?.avatar !== "" ?
                            <img src={gallery.banner.section_avatar?.avatar} alt={gallery.banner.section_avtar_alt || ""} />
                            :
                            <img src="https://artgalleryofballarat.com.au/wp-content/uploads/2020/06/placeholder-image.png" alt="" />
                          :
                          typeof (gallery.banner.section_avatar?.avatar) === typeof (0) ?
                            // dining.thumbnail && dining.thumbnail !== "" ?
                            <img src={thumbnailPreview} alt={gallery.banner.section_avtar_alt || ""} />
                            :
                            <img src={gallery.banner.section_avatar?.avatar} alt={gallery.banner.section_avtar_alt || ""} />
                      }
                    </div>
                    <Fragment>
                      <MaterialButton
                        variant="outlined"
                        color="primary"
                        startIcon={<Image />}
                        className="mt-1"
                        fullWidth
                        size="large"
                        onClick={() => {
                          setIsSingle(true);
                          setCurrentSection("banner");
                          setShowGallery(true);
                        }}
                      >
                        Upload Featured Image
                      </MaterialButton>
                    </Fragment>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel3a-content"
                id="panel3a-header"
              >
                <Typography className={classes.heading}>Image Gallery</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <p>
                    <em>Please select images from gallery.</em>
                  </p>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <MaterialButton
                        variant="outlined"
                        color="primary"
                        onClick={() => {
                          setRenderPreviews(false);
                          setImagesList(true);
                          setIsSingle(false);
                          setShowGallery(true);
                          setCurrentSection("imageGallery");
                        }}
                      >
                        Select Gallery Images
                      </MaterialButton>
                    </Grid>
                    {gallery?.imageGallery?.length > 0 && imagesData
                      ?.filter(function (array_el) {
                        return (
                          gallery?.imageGallery?.filter(function (menuItems_el) {
                            return menuItems_el._id === array_el._id;
                          }).length !== 0
                        );
                      })
                      ?.map((x) => (
                        <SelectedImagesThumbnails
                          x={x}
                          handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "selectedImages")} />
                      ))}
                    {/* {uploadsPreview &&
                      uploadsPreview?.map((x) => (
                        <SelectedImagesThumbnails x={x} handleRemoveSelectedImage={(r) => handleRemoveSelectedImage(r, "uploadsPreview")} />
                      ))} */}
                    <div className="clearfix clear-fix"></div>

                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography className={classes.heading}>SEO Information</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="meta_title"
                      name="meta_title"
                      label="Meta Title"
                      value={seoInfo.meta_title}
                      variant="outlined"
                      fullWidth
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  {/*<Grid item xs={12} sm={3}>*/}
                  {/*</Grid>*/}
                  {/*<Grid item xs={12} sm={3}>*/}
                  {/*  <TextField*/}
                  {/*      required*/}
                  {/*      id="route"*/}
                  {/*      name="route"*/}
                  {/*      label="Permalink"*/}
                  {/*      value={seoInfo.route}*/}
                  {/*      variant="outlined"*/}
                  {/*      fullWidth*/}
                  {/*      onChange={handleRouteChange}*/}
                  {/*      size="small"*/}
                  {/*  />*/}
                  {/*</Grid>*/}
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="meta_description"
                      name="meta_description"
                      label="Meta Description"
                      value={seoInfo.meta_description}
                      variant="outlined"
                      fullWidth
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="schema_markup"
                      name="schema_markup"
                      label="Schema Markup"
                      value={seoInfo.schema_markup}
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={4}
                      rowsMax={4}
                      onChange={handleSEOInputChange}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="is_followed" row defaultChecked name="is_followed" value={seoInfo.is_followed} onChange={(e) => {
                        setSeoInfo({ ...seoInfo, is_followed: !seoInfo.is_followed })
                      }}>
                        <FormControlLabel value={true} control={<Radio />} label="Follow" />
                        <FormControlLabel value={false} control={<Radio />} label="No Follow" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl component="fieldset">
                      <RadioGroup aria-label="is_indexed" row defaultChecked name="is_indexed" value={seoInfo.is_indexed} onChange={(e) => {
                        setSeoInfo({ ...seoInfo, is_indexed: !seoInfo.is_indexed })
                      }}>
                        <FormControlLabel value={true} control={<Radio />} label="Index" />
                        <FormControlLabel value={false} control={<Radio />} label="No Index" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </CardBody>
        </Card>
        <Grid item xs={12} sm={12}>
          <MaterialButton onClick={() => handleSubmit(gallery.banner.id, "banner")} size="large" color="primary" variant="contained">
            Update Section
          </MaterialButton>
        </Grid>
      </div>
      {/* GALLERY DIALOG BOX START */}
      <GalleryDialog
        isSingle={isSingle}
        section={currentSection}
        open={showGallery}
        handleImageSelect={handleImageSelect}
        handleClose={() => {
          setShowGallery(false);
          setRenderPreviews(true);
          setUploadsPreview([])
        }}
        refreshGallery={getGalleryImages}
        data={imagesData}
        selectedData={selectedImages}
      />
      {/* GALLERY DIALOG BOX END */}

      {/* <GalleryDialog
        isSingle={isSingle}
        section={currentSection}
        open={showGallery}
        handleImageSelect={handleImageSelect}
        handleClose={() => {
          setShowGallery(false);
          // setRenderPreviews(true);
        }} refreshGallery={getGalleryImages} data={imagesData} /> */}
    </div>
  );
}
