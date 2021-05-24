import React from "react";
import loading_screen from '../components/Loading_screen';
import axios from "axios";
import { Button } from "reactstrap";
import { MUSIC_API_URL } from "../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { find_error_message_in_response } from "../constants/utils";
import { withRouter } from "react-router";
import MusicLibraryPublisherModal from "./MusicLibraryPublisherModal";
import MusicLibraryDatabase from "./MusicLibraryDatabase";

export class MusicLibraryPublisherDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      publisher: undefined,
      publisher_confirmation: false,
    };
    this.check_if_ready_to_render = this.check_if_ready_to_render.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.on_publisher_change = this.on_publisher_change.bind(this);
  }

  handleOpenModal(row) {
    // console.log(row)
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  on_publisher_change() {
    this.handleCloseModal();
    MusicLibraryDatabase.resetState(this.check_if_ready_to_render);
  }

  check_if_ready_to_render() {
    if (MusicLibraryDatabase.everything_loaded()) {
      this.getPublisher();
    }
  }

  componentDidMount() {
    if (!MusicLibraryDatabase.everything_loaded()) {
        MusicLibraryDatabase.resetState(this.check_if_ready_to_render);
    } else {
      this.getPublisher();
    }
  }


  getPublisher = () => {
    axios.get(MUSIC_API_URL + 'publishers/' + this.props.match.params.id).then(res => this.setState({ publisher: res.data, publisher_confirmation: true })).catch((thrown) => {
      console.log(thrown);
      toast.error(JSON.stringify(find_error_message_in_response(thrown.response)));
    });
  };

  render() {
    if (this.state.publisher_confirmation) {
      return (<div className="container">
        <div className="row" style={{ marginTop: 60, marginLeft: 0 }}><h1>{this.state.publisher.name}</h1><Button href="#" outline color="primary" className="btn-sm edit-delete-button" onClick={() => this.handleOpenModal(this.state.series)} style={{ marginLeft: 13, marginTop: 13 }}><FontAwesomeIcon icon={faEdit} /></Button></div>
        <MusicLibraryPublisherModal
          isOpen={this.state.showModal}
          contentLabel="Publisher Modal"
          viewing_publisher={this.state.publisher}
          new={this.state.creating_new_publisher}
          close_modal={this.handleCloseModal}
          on_change={this.on_publisher_change} />
      </div>);
    } else {
      return loading_screen;
    }

  }
}
export default withRouter(MusicLibraryPublisherDetail)