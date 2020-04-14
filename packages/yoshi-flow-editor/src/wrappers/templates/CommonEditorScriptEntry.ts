import t from './template';

type Opts = Record<'editorEntryFileName', string>;

// We want allow users to use default even despite fact that platform doesn't support it.
export default t<Opts>`
  var editorScriptEntry = require('${({ editorEntryFileName }) =>
    editorEntryFileName}');

  module.exports = editorScriptEntry.default || editorScriptEntry;
`;
