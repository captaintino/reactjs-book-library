import React from "react";
import ReactModal from 'react-modal';
import SelectSearch from 'react-select-search';
import { Button, Form, FormGroup, Input, Label } from "reactstrap";

import 'react-select-search/style.css'

import axios from "axios";

import { API_URL } from "../constants";

class BookModal extends React.Component {
    constructor(props) {
        super(props);
        // console.log(props)
        let my_state = this.build_state()
        this.state = my_state
    }

    build_state() {
        if (!this.props.new) {
            return {
                id: this.props.viewing_book.id,
                title: this.props.viewing_book.title,
                notes: this.props.viewing_book.notes,
                author: this.props.viewing_book.author,
                genre: this.props.viewing_book.genre,
                series: this.props.viewing_book.series,
                number_in_series: this.props.viewing_book.number_in_series,
                owned: this.props.viewing_book.owned
            }
        } else {
            return {
                id: -1,
                title: "",
                notes: "",
                author: "",
                genre: "",
                series: "",
                number_in_series: "",
                showAuthorModal: false,
                showModal: false,
                owned: true
            }
        }
    }

    componentDidUpdate(prevProps) {
        // comparison to avoid infinite loop
        if (this.props !== prevProps) {
            this.setState(this.build_state())
        }
    }

    onChange = e => {
        // console.log(e)
        if(e.target.name == "owned"){
            this.setState({ [e.target.name]: e.target.checked })
        }else {
            this.setState({ [e.target.name]: e.target.value });
        }
    };
    onDropdownChange = (id, item) => {
        // console.log(id, item)
        this.setState({ [item.type]: id });
    };

    createBook = e => {
        e.preventDefault();
        let book_obj = this.state
        book_obj.genre = parseInt(book_obj.genre)
        book_obj.author = parseInt(book_obj.author)
        book_obj.series = book_obj.series === " " ? "" : parseInt(book_obj.series)
        book_obj.number_in_series = book_obj.number_in_series === " " ? "": parseInt(book_obj.number_in_series)
        if (book_obj.series === "") {
            delete book_obj.series
        }
        if (book_obj.number_in_series === "") {
            delete book_obj.number_in_series
        }
        console.log(this.state)
        axios.post(API_URL + 'books', this.state).then(() => {
            this.props.on_change()
        });
    };

    editBook = e => {
        e.preventDefault();
        let book_obj = this.state
        book_obj.genre = parseInt(book_obj.genre)
        book_obj.author = parseInt(book_obj.author)
        book_obj.series = book_obj.series === " " ? "" : parseInt(book_obj.series)
        book_obj.number_in_series = book_obj.number_in_series === " " ? "": parseInt(book_obj.number_in_series)
        axios.put(API_URL + 'books/' + book_obj.id, book_obj).then(() => {
            this.props.on_change()
        });
    };

    authors_dropdown_list() {
        let items = [];
        this.props.authors.forEach(author => {
            items.push(
                {
                    value: author.id,
                    name: author.last_name + ", " + author.first_name,
                    type: 'author'
                })
        });
        return items;
    }

    genres_dropdown_list() {
        let items = [];
        this.props.genres.forEach(genre => {
            items.push(
                {
                    value: genre.id,
                    name: genre.category,
                    type: 'genre'
                })
        });
        return items;
    }

    series_dropdown_list() {
        let items = [{
            value: " ",
            name: "",
            type: 'series'
        }];
        this.props.series.forEach(series => {
            items.push(
                {
                    value: series.id,
                    name: series.name,
                    type: 'series'
                })
        });
        return items;
    }

    render() {
        const customStyles = {
            content: {
                "max-height": "80%",
                height: "fit-content",
                margin: "auto",
                width: "50%"
            }
        };
        return (
            <div>
                <ReactModal
                    isOpen={this.props.isOpen}
                    style={customStyles}
                >
                    <Form onSubmit={this.props.new ? this.createBook : this.editBook}>
                        <FormGroup>
                            <Label for="title">Title:</Label>
                            <Input
                                type="text"
                                name="title"
                                onChange={this.onChange}
                                value={this.state.title || ""}
                                required={true}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="notes">Notes:</Label>
                            <Input
                                type="textarea"
                                name="notes"
                                onChange={this.onChange}
                                value={this.state.notes || ""}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="author">Author:</Label>
                            <SelectSearch
                                name="author"
                                search
                                placeholder="Select an Author"
                                value={this.state.author || ""}
                                options={this.authors_dropdown_list()}
                                onChange={this.onDropdownChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="genre">Genre:</Label>
                            <SelectSearch
                                name="genre"
                                search
                                placeholder="Select a Genre"
                                value={this.state.genre || ""}
                                options={this.genres_dropdown_list()}
                                onChange={this.onDropdownChange}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="series">Series:</Label>
                            <SelectSearch
                                name="series"
                                search
                                placeholder="Select a Series"
                                value={this.state.series || ""}
                                options={this.series_dropdown_list()}
                                onChange={this.onDropdownChange}
                            />
                        </FormGroup>
                        {(this.state.series) !== "" && (this.state.series) !== " " && (this.state.series) !== undefined && (this.state.series) !== null &&
                        <FormGroup>
                            <Label for="number_in_series">Number in Series:</Label>
                            <Input
                                type="number"
                                name="number_in_series"
                                onChange={this.onChange}
                                value={this.state.number_in_series || ""}
                            />
                        </FormGroup>}
                        <FormGroup check>
                            <Label check for="owned"></Label>
                            <Input
                                type="checkbox"
                                name="owned"
                                onChange={this.onChange}
                                checked={this.state.owned || false}
                            />Owned
                        </FormGroup>
                        <Button>Submit</Button>
                        <Button onClick={this.props.close_modal} className={"close_modal_button"}>Cancel</Button>
                    </Form>
                </ReactModal>
            </div>
        )
    }
}
export default BookModal