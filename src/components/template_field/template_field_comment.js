import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Editor} from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {EditorState, ContentState, convertFromRaw} from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import ToolBarConfig from "../common/draft_wysiwyg_toolbar_conf";

class OpinionScoreComments extends Component {
    constructor(props) {
        super(props);
        const html = this.props.comments_html? this.props.comments_html:"";
        const {contentBlocks, entityMap} = htmlToDraft(html);
        this.state = {
            comment_length: ContentState.createFromBlockArray(contentBlocks, entityMap).getPlainText().length
        };
        this.handle_editor_change = this.handle_editor_change.bind(this)
    }
    handle_editor_change(raw_content_state){
        const html = draftToHtml(raw_content_state);
        const {on_change} = this.props;
        this.setState({comment_length: convertFromRaw(raw_content_state).getPlainText().length});
        on_change({comments:html});

    }



    render() {
        const {comments_html, comments_min_length, en} = this.props;
        const {contentBlocks, entityMap} = htmlToDraft(comments_html);
        const editor_state = EditorState.createWithContent(ContentState.createFromBlockArray(contentBlocks, entityMap));

        return (
            <div>
                <h6>{en?'Enter comment in a field below ':'Введите комментарий в поле ниже'}({this.state.comment_length}/{comments_min_length}):</h6>
                <div className="grey lighten-4">
                    <Editor
                    editorState={editor_state}
                    toolbar={ToolBarConfig}
                    />
                </div>

            </div>
        );
    }
}

OpinionScoreComments.propTypes = {
    comments_min_length: PropTypes.number.isRequired,
    en: PropTypes.bool.isRequired,
    comments_html: PropTypes.string,
    on_change: PropTypes.func.isRequired,
};

export default OpinionScoreComments;