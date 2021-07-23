import React from "react";
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import axios from "axios";
import DeleteModal from "../components/Delete_modal";
import DeleteFormatter from "../components/Delete_formater.js";
import { MUSIC_API_URL } from "../constants";
import { find_error_message_in_response } from "../constants/utils";
import BuildDetailFormatter from "../components/Detail_formatter";
import { toast } from "react-toastify";
import { ButtonGroup, Button } from "reactstrap";
import MusicLibraryDatabase from "./MusicLibraryDatabase";
import paginationFactory from "react-bootstrap-table2-paginator";
import sortCaret from "../components/Sort_caret";
import headerFormatter from "../components/Header_formater";

export default class MusicLibrarySongDataGrid extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showDeleteModal: false,
            showNotesColumn: false,
            showPublisherColumn: false,
            showCollectionColumn: false,
            viewing_song: {}
        };
        this.handleOpenDeleteModal = this.handleOpenDeleteModal.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.on_delete_song_change = this.on_delete_song_change.bind(this);
        this.sort_songs = this.sort_songs.bind(this);
    }


    on_delete_song_change() {
        axios.delete(MUSIC_API_URL + 'songs/' + this.state.viewing_song.id).then(() => {
            this.handleCloseModal();
            this.props.on_change();
        }).catch((thrown) => {
            toast.error(JSON.stringify(find_error_message_in_response(thrown.response)));
        });
    }

    handleOpenModal(row) {
        this.setState({ viewing_song: row, showModal: true });
    }

    handleOpenDeleteModal(row) {
        this.setState({ viewing_song: row, showDeleteModal: true });
    }

    handleCloseModal() {
        this.setState({ showModal: false, showDeleteModal: false });
    }


    find_composer = (song) => {
        if (song.composers_list) {
            return song.composers_list.map((a) => a.last_name + ", " + a.first_name).join("; ")
        }
    };

    find_arranger = (song) => {
        if (song.arrangers_list) {
            return song.arrangers_list.map((a) => a.last_name + ", " + a.first_name).join("; ")
        }
    };

    find_lyricist = (song) => {
        if (song.lyricists_list) {
            return song.lyricists_list.map((a) => a.last_name + ", " + a.first_name).join("; ")
        }
    };

    find_publisher = (song) => {
        if (song.publisher_obj) {
            return song.publisher_obj.name;
        }
    };

    find_collection = (song) => {
        if (song.collection_obj) {
            return song.collection_obj.name;
        }
    };

    find_tags = (song) => {
        if (song.tags_list) {
            return song.tags_list.map((a) => a.tag).join("; ")
        }
    };


    onChange = e => {
        // console.log(e)
        e.preventDefault();
        if (e.target.name === "showNotesColumn") {
            this.setState({ [e.target.name]: e.target.checked });
        } else if (e.target.name === "showPublisherColumn") {
            this.setState({ [e.target.name]: e.target.checked })
        } else if (e.target.name === "showCollectionColumn") {
            this.setState({ [e.target.name]: e.target.checked })
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
    };

    sort_songs = (a, b) => {
        return a[this.props.sort_field] - b[this.props.sort_field];
    };

    render() {
        const columns = [
            {
                dataField: 'title',
                text: 'Title ',
                sort: true,
                sortCaret: sortCaret,
                filter: textFilter({ delay: 0 }),
                formatter: BuildDetailFormatter('/musiclibrary/songs/'),
                headerFormatter: headerFormatter
            },
            {
                dataField: 'notes',
                text: 'Notes ',
                style: { width: 250, "fontStyle": "italic" },
                filter: textFilter({ delay: 0 }),
                hidden: !this.state.showNotesColumn
            },
            {
                dataField: 'publisher_name',
                text: 'Publisher ',
                sort: true,
                sortCaret: sortCaret,
                filter: textFilter({ delay: 0 }),
                formatter: BuildDetailFormatter('/musiclibrary/publisher/', 'publisher'),
                hidden: !this.state.showPublisherColumn,
                headerFormatter: headerFormatter
            },
            {
                dataField: 'collection_name',
                text: 'Collection ',
                sort: true,
                sortCaret: sortCaret,
                filter: textFilter({ delay: 0 }),
                formatter: BuildDetailFormatter('/musiclibrary/collection/',
                    'collection'),
                hidden: !this.state.showCollectionColumn,
                headerFormatter: headerFormatter
            },
            {
                dataField: 'arranger_name',
                text: 'Arranger ',
                sort: true,
                sortCaret: sortCaret,
                filter: textFilter({ delay: 0 }),
                headerFormatter: headerFormatter
            },
            {
                dataField: 'composer_name',
                text: 'Composer ',
                sort: true,
                sortCaret: sortCaret,
                filter: textFilter({ delay: 0 }),
                headerFormatter: headerFormatter
            },
            {
                dataField: 'lyricist_name',
                text: 'Lyricist ',
                sort: true,
                sortCaret: sortCaret,
                filter: textFilter({ delay: 0 }),
                headerFormatter: headerFormatter
            },
            {
                dataField: 'tags',
                text: 'Tags ',
                style: { width: 250, "fontStyle": "italic" },
                filter: textFilter({ delay: 0 }),
                headerFormatter: headerFormatter
            },
            {
                dataField: 'delete',
                resizable: false,
                text: 'Delete ',
                style: { width: 60 },
                formatter: DeleteFormatter
            }
        ];

        const defaultSorted = [{
            dataField: 'title',
            order: 'asc'
        }]

        let displayed_songs = [];
        this.props.songs.forEach((item) => {
            item.composer_name = this.find_composer(item);
            item.arranger_name = this.find_arranger(item);
            item.lyricist_name = this.find_lyricist(item);
            item.publisher_name = this.find_publisher(item);
            item.colletion_name = this.find_collection(item);
            item.tags = this.find_tags(item);
            item.delete = { id: item.id, on_click: this.handleOpenDeleteModal };
            displayed_songs.push(item)
        });
        function indication() {
            return "Table got nothing"
        }
        const pageButtonRenderer = ({
            page,
            active,
            onPageChange,
        }) => {
            const handleClick = (e) => {
                e.preventDefault();
                onPageChange(page);
            };
            const activeStyle = {};
            if (active) {
                activeStyle.backgroundColor = '#17a2b8';
                activeStyle.color = 'white';
            } else {
                activeStyle.backgroundColor = 'white';
                activeStyle.color = 'black';
            }
            if (typeof page === 'string') {
                activeStyle.backgroundColor = 'white';
                activeStyle.color = 'black';
            }
            return (
                <li className="page-item">
                    <a onClick={handleClick} style={activeStyle} className="btn-sm">{page}</a>
                </li>
            );
        };
        const sizePerPageRenderer = ({
            options,
            currSizePerPage,
            onSizePerPageChange
        }) => (
            <div className="btn-group" role="group">
                {
                    options.map((option) => {
                        const isSelect = currSizePerPage === `${option.page}`;
                        return (
                            <button
                                key={option.text}
                                type="button"
                                onClick={() => onSizePerPageChange(option.page)}
                                className={`btn ${isSelect ? 'btn-info' : 'btn-light'}`}
                            >
                                {option.text}
                            </button>
                        );
                    })
                }
            </div>
        );
        const options = {
            sizePerPageRenderer,
            pageButtonRenderer,
            paginationSize: 6,
            pageStartIndex: 1,
            // alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            // hideSizePerPage: true, // Hide the sizePerPage dropdown always
            hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            nextPageTitle: 'First page',
            prePageTitle: 'Pre page',
            firstPageTitle: 'Next page',
            lastPageTitle: 'Last page',
            showTotal: true,
            disablePageTitle: true,
            sizePerPageList: [{
                text: '10', value: 10
            }, {
                text: '15', value: 15
            }, {
                text: '20', value: 20
            }, {
                text: 'All', value: MusicLibraryDatabase.songs.length
            }]
        };
        return (
            <div>
                <ButtonGroup style={{ marginBottom: "1.5%", marginTop: "1.5%" }} className="row col-6">
                    <Button color="outline-info" onClick={() => this.setState({ showNotesColumn: !this.state.showNotesColumn })} active={this.state.showNotesColumn === true}>Show Notes</Button>
                    <Button color="outline-info" onClick={() => this.setState({ showPublisherColumn: !this.state.showPublisherColumn })} active={this.state.showPublisherColumn === true}>Show Publishers</Button>
                    <Button color="outline-info" onClick={() => this.setState({ showCollectionColumn: !this.state.showCollectionColumn })} active={this.state.showCollectionColumn === true}>Show Collections</Button>
                </ButtonGroup>
                <DeleteModal
                    isOpen={this.state.showDeleteModal}
                    contentLabel="Delete Song"
                    viewing_song={this.state.viewing_song}
                    close_modal={this.handleCloseModal}
                    item_type={"Song"}
                    item_desc={this.state.viewing_song.title}
                    on_change={this.on_delete_song_change} />
                <BootstrapTable
                    keyField={"wut"}
                    pagination={paginationFactory(options)}
                    noDataIndication={indication()}
                    filter={filterFactory()}
                    columns={columns}
                    data={displayed_songs}
                    defaultSorted={defaultSorted} />
            </div>
        );
    }
}