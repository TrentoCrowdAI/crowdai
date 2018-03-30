import React from 'react';
import PropTypes from 'prop-types';
import showdown from 'showdown';
import sanitizeHtml from 'sanitize-html';

import {FileFormats} from 'src/utils/constants';

const FileRenderer = props => {
  const {content, format} = props;
  let converter = new showdown.Converter();

  switch (format) {
    case FileFormats.MARKDOWN:
      return <div dangerouslySetInnerHTML={{__html: converter.makeHtml(content)}} />;
    case FileFormats.HTML:
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(content, {
              // by default sanitize does not allow h1, h2 and br.
              allowedTags: [...sanitizeHtml.defaults.allowedTags, 'h1', 'h2', 'br']
            })
          }}
        />
      );
    default:
      // by default we assume PLAIN_TEXT
      return <p>{content}</p>;
  }
};

FileRenderer.propTypes = {
  content: PropTypes.string.isRequired,
  format: PropTypes.string.isRequired
};

export default FileRenderer;
