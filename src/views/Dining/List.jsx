import React, { Component } from "react";
import MUIDataTable from "mui-datatables";
import API from "utils/http";
import LangAPI from "langapi/http";
import { Avatar, Box, Button, Select, MenuItem, FormControl } from "@material-ui/core";

import { Link } from "react-router-dom";
import {
  AddOutlined,
  DeleteOutlined,
  EditOutlined,
  VisibilityOutlined,
} from "@material-ui/icons";

import InputLabel from "@material-ui/core/InputLabel";

class DiningList extends Component {
  state = {
    offers: [],
    selectedLang: "en",
    columns: [
      {
        name: "thumbnailPreview",
        label: "Image",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val) => <Avatar alt={"Image"} src={val}></Avatar>,
        },
      },
      {
        name: "post_name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        },
      },
      // {
      //   name: "room_type",
      //   label: "Room Type",
      //   options: {
      //     filter: true,
      //     sort: false,
      //     customBodyRender: (val) => {
      //       return val === 0 ? 'Room' : 'Suite'
      //     }
      //   }
      // },
      // {
      //   name: "category_name",
      //   label: "Category",
      //   options: {
      //     filter: true,
      //     sort: false,
      //   }
      // },
      // {
      //   name: "short_description",
      //   label: "Description",
      //   options: {
      //     filter: true,
      //     sort: false,
      //     customBodyRender: val => (
      //       val.length > 100 ? val.substr(0, 100) + '...' : val
      //     )
      //   }
      // },
      {
        name: "post_content",
        label: "Content",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => (
            <code>{val?.length > 100 ? val?.substr(0, 100) + "..." : val}</code>
          ),
        },
      },
      {
        name: "section_dress_code",
        label: "Dress Code",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => (
            <code>{val?.length > 100 ? val?.substr(0, 100) + "..." : val}</code>
          ),
        },
      },
      {
        name: "section_opening_hours",
        label: "Opening Hours",
        options: {
          filter: true,
          sort: false,
          customBodyRender: (val) => (
            <code>{val?.length > 100 ? val?.substr(0, 100) + "..." : val}</code>
          ),
        },
      },
      {
        name: "slug",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val) => (
            <div className="d-flex nowrap">
              <Link to={`/admin/dining/${val}?lang=${this.state.selectedLang}`}>
                <VisibilityOutlined fontSize="small" color="action" />
              </Link>
              <Link
                className="ml-2"
                title="Edit"
                to={`/admin/dining/edit/${val}?lang=${this.state.selectedLang}`}
              >
                <EditOutlined fontSize="small" color="primary" />
              </Link>
              <Link
                className="ml-2"
                title="Delete"
                to={`#`}
                onClick={() => this.handleDelete(val)}
              >
                <DeleteOutlined fontSize="small" color="secondary" />
              </Link>
            </div>
          ),
        },
      },
    ],
    rows: [],
  };

  options = {
    filterType: "checkbox",
    responsive: "vertical",
  };

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedLang !== this.state.selectedLang) {
      this.getData();
    }
  }

  getData() {
    LangAPI.get(`/dinings?lang=${this.state.selectedLang}`).then((response) => {
      let rows = response?.data?.data;
      this.setState({ rows: rows });
    });
  }
  handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ?")) {
      LangAPI.delete(`/dinings/${id}?lang=${this.state.selectedLang}`)
        .then((response) => {
          if (response.status === 200) {
            alert("Restaurant deleted successfully !");
            this.getData();
          }
        })
        // .then(() => {
        //   API.get(`/dining`).then((response) => {
        //     if (response.status === 200) {
        //       let rows = response.data;
        //       this.setState({ rows });
        //     }
        //   });
        // })
        .catch((err) => console.log(err));
    }
  };

  handleChange = (event) => {
    // setAge(event.target.value as string);
    if (event.target.value != this.state.selectedLang) {
      this.setState({ selectedLang: event.target.value })
    }
    console.log(event.target.value, "event.target.value")
  };


  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <div className="d-flex justify-content-between align-items-center">
            <Link to="/admin/dining/add">
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddOutlined />}
              >
                Add Restaurant
              </Button>
            </Link>
            <FormControl
              variant="outlined"
              size="small"
              style={{ width: "20%" }}
            // fullWidth
            >
              <InputLabel id="language">Select Language</InputLabel>
              <Select
                labelId="language"
                id="language"
                name="language"
                value={this.state.selectedLang}
                // onChange={handleInputChange}
                label="Select Language"
                fullWidth
                onChange={this.handleChange}
              >
                {/* <MenuItem value={-1}>
                            <em>Select Language</em>
                        </MenuItem> */}
                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'fr'}>FR</MenuItem>
                <MenuItem value={'de'}>DE</MenuItem>
                <MenuItem value={'ru'}>RU</MenuItem>

              </Select>
            </FormControl>
          </div>
        </Box>
        <MUIDataTable
          title="Restaurants &amp; Bars"
          columns={this.state.columns}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default DiningList;
