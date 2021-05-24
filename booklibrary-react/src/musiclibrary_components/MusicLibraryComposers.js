import React from "react";
import ReactModal from 'react-modal';
import { Button } from "reactstrap";
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import MusicLibraryComposerModal from "./MusicLibraryComposerModal"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import MusicLibraryDatabase from "./MusicLibraryDatabase";
import BootstrapTable from "react-bootstrap-table-next";
import { find_error_message_in_response } from "../constants/utils";
import axios from "axios";
import { MUSIC_API_URL } from "../constants";
import { toast } from "react-toastify";
import EditorFormatter from "../components/Edit_formatter";
import DeleteFormatter from "../components/Delete_formater";
import DeleteModal from "../components/Delete_modal";
import BuildDetailFormatter from "../components/Detail_formatter";

ReactModal.setAppElement('#root')

export default class MusicLibraryComposers extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false,
      showDeleteModal: false,
      creating_new_composer: false,
      viewing_composer: {}
    };
    this.check_if_ready_to_render = this.check_if_ready_to_render.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleDeleteModal = this.handleDeleteModal.bind(this);
    this.on_composer_change = this.on_composer_change.bind(this);
    this.on_delete_composer_change = this.on_delete_composer_change.bind(this);
  }

  check_if_ready_to_render() {
    if (MusicLibraryDatabase.everything_loaded()) {
      this.setState();
    }
  }
  handleOpenModal(row) {
    MusicLibraryDatabase.resetState(this.check_if_ready_to_render)
    this.setState({ viewing_composer: row, showModal: true, creating_new_composer: false });
  }

  handleCloseModal() {
    this.setState({ showModal: false, showDeleteModal: false });
  }

  handleDeleteModal(row) {
    this.setState({ viewing_composer: row, showDeleteModal: true });
  }


  on_composer_change() {
    this.handleCloseModal()
    this.props.on_change();
  }

  on_delete_composer_change() {
    axios.delete(MUSIC_API_URL + 'composers/' + this.state.viewing_composer.id).then(() => {
      this.handleCloseModal();
      this.props.on_change();
    }).catch((thrown) => {
      toast.error(JSON.stringify(find_error_message_in_response(thrown.response)));
    });
  }

  render() {
    const columns = [
      { dataField: 'full_name', text: 'Name ', filter: textFilter({ delay: 0 }), formatter: BuildDetailFormatter('/musiclibrary/composers/') },
      { dataField: 'edit', text: 'Edit', style: { width: 55 }, formatter: EditorFormatter },
      { dataField: 'delete', text: 'Delete', style: { width: 60 }, formatter: DeleteFormatter }
    ]
    let displayed_composer = MusicLibraryDatabase.composers.slice();
    displayed_composer.forEach((item) => {
      item.full_name = item.last_name + ", " + item.first_name;
      item.edit = { id: item.id, on_click: this.handleOpenModal };
      item.delete = { id: item.id, on_click: this.handleDeleteModal };
    });
    return (
      <div>
        <MusicLibraryComposerModal
          isOpen={this.state.showModal}
          contentLabel="Composer Modal"
          viewing_composer={this.state.viewing_composer}
          new={this.state.creating_new_composer}
          close_modal={this.handleCloseModal}
          on_change={this.on_composer_change} />
        <DeleteModal
          isOpen={this.state.showDeleteModal}
          contentLabel="Delete Composer"
          viewing_composer={this.state.viewing_composer}
          close_modal={this.handleCloseModal}
          item_type={"Composer"}
          item_desc={this.state.viewing_composer.name}
          on_change={this.on_delete_composer_change} />
        <Button style={{ float: "right" }} outline color="success" className="Add_button" onClick={() => {
          this.setState({
            showModal: true,
            creating_new_composer: true
          });
        }}><FontAwesomeIcon icon={faPlusSquare} /> New Composer </Button>
        {/* <BootstrapTable
          keyField={"wut"}
          filter={filterFactory()}
          columns={columns}
          data={MusicLibraryDatabase.composers}
        /> */}
      </div>

    );
  }

}