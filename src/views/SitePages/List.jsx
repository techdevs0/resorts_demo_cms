import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { AddOutlined } from '@material-ui/icons';
import LangAPI from "langapi/http";

class PageList extends Component {
  state = {
    columns: [
      {
        name: "name",
        label: "Name",
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        name: "_id",
        label: "Actions",
        options: {
          filter: false,
          sort: false,
          customBodyRender: (val, row) => {
            return <Link to={`/admin/pages/${row.tableData?.[row.rowIndex]?.slug}/add/${val}`} >
              {/* <EditOutlined color="primary" /> */}
              <Button size="small" color="primary" variant="outlined">
                Update Sections
              </Button>
            </Link>
          }
        }
      },
    ],
    rows: [],
  };

  options = {
    filterType: "checkbox",
    responsive: "vertical",
    pagination: false
  };

  componentDidMount() {
    LangAPI.get('/pages').then(response => {
      let rows = response?.data
      this.setState({ rows: rows })
    })
  }

  render() {
    return (
      <div>
        <Box marginBottom={4}>
          <Link to="/admin/pages/add">
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddOutlined />}
            >
              Add Page
            </Button>
          </Link>
        </Box>
        <MUIDataTable
          title="Site Pages"
          columns={this.state.columns}
          // rowsPerPageOptions={20}
          // pageSize={15}
          pagination={false}
          data={this.state.rows}
          options={this.options}
          loading
        />
      </div>
    );
  }
}

export default PageList;